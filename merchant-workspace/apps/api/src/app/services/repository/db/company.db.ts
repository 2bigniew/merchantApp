import { Company, CreateCompanyPayload, UpdateCompanyPayload } from '@merchant-workspace/api-interfaces'
import { DBObject, TableName } from '@merchant-workspace/api-interfaces'
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

export class CompanyTable extends DB {
  constructor(db: Database, private tableName: TableName = 'company') {
    super(db)
  }

  public async getCompanies(): Promise<Company[]> {
    const query = `SELECT * FROM ${this.tableName};`
    const companies = await this.all<Company, undefined>(query)
    return removeUndefined(companies.map((company) => mapDBObjectToJSFormat<Company>(company)))
  }

  public async getCompanyById(id: number): Promise<Company | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $id LIMIT 1;`
    const company = await this.get<Company, { id: number }>(query, { id })
    return mapDBObjectToJSFormat(company)
  }

  public async createCompany(payload: CreateCompanyPayload): Promise<number> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { keys } = prepareCreateProps(dbPayload)
    const keysNames = getSQLitifiedKeysNames(dbPayload)
    const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${keysNames});`
    await this.run<Company, DBObject>(query, dbPayload)
    return this.lastId()
  }

  public async updateCompany(payload: UpdateCompanyPayload): Promise<Company | undefined> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { id, ...rest } = dbPayload
    const company = await this.getCompanyById(id)
    if (!company) {
      return
    }
    const updateString = prepareUpdateProps<Omit<UpdateCompanyPayload, 'id'>>(rest)
    const query = `UPDATE ${this.tableName} SET ${updateString} WHERE id = $id;`
    await this.run<Company, DBObject>(query, dbPayload)
    return this.getCompanyById(id)
  }

  public async deleteCompany(id: number): Promise<Company | undefined> {
    const company = await this.getCompanyById(id)
    if (!company) {
      return undefined
    }
    const query = `DELETE FROM ${this.tableName} WHERE id = $id;`
    await this.run<Company, { id: number }>(query, { id })
    return company
  }

  public async lastId(): Promise<number> {
    return this.getLastId(this.tableName)
  }
}

export default new CompanyTable(connection)
