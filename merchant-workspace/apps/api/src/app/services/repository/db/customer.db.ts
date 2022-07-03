import { CreateCustomerPayload, Customer, UpdateCustomerPayload } from '@merchant-workspace/api-interfaces'
import { DBObject, TableName } from '@merchant-workspace/api-interfaces'
import { Company } from '@merchant-workspace/api-interfaces'
import { DB } from './main'
import {
  getSQLitifiedKeysNames,
  mapDBObjectToJSFormat,
  mapJSObjectToDBFormat,
  prepareCreateProps,
  prepareUpdateProps,
  removeUndefined,
} from './helpers'
import { Database } from 'sqlite3'
import connection from './connection'

export class CustomerTable extends DB {
  constructor(db: Database, private tableName: TableName = 'customer') {
    super(db)
  }

  public async getCustomers(): Promise<Customer[]> {
    const query = `SELECT * FROM ${this.tableName};`
    const customers = await this.all<Customer, undefined>(query)
    return removeUndefined(customers.map((customer) => mapDBObjectToJSFormat(customer)))
  }

  public async getCustomerById(id: number): Promise<Customer | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $id LIMIT 1;`
    const customer = await this.get<Customer, { id: number }>(query, { id })
    return mapDBObjectToJSFormat(customer)
  }

  public async createCustomer(payload: CreateCustomerPayload): Promise<number> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { keys } = prepareCreateProps(dbPayload)
    const keysNames = getSQLitifiedKeysNames(dbPayload)
    const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${keysNames});`
    await this.run<Company, DBObject>(query, dbPayload)
    return this.lastId()
  }

  public async updateCustomer(payload: UpdateCustomerPayload): Promise<Customer | undefined> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { id, ...rest } = dbPayload
    const customer = await this.getCustomerById(id)
    if (!customer) {
      return
    }
    const updateString = prepareUpdateProps<Omit<UpdateCustomerPayload, 'id'>>(rest)
    const query = `UPDATE ${this.tableName} SET ${updateString} WHERE id = $id;`
    await this.run<Customer, DBObject>(query, dbPayload)
    return this.getCustomerById(id)
  }

  public async deleteCustomer(id: number): Promise<Customer | undefined> {
    const customer = await this.getCustomerById(id)
    if (!customer) {
      return
    }
    const query = `DELETE FROM ${this.tableName} WHERE id = $id;`
    await this.run<Company, { id: number }>(query, { id })
    return customer
  }

  public async lastId(): Promise<number> {
    return this.getLastId(this.tableName)
  }
}

export default new CustomerTable(connection)
