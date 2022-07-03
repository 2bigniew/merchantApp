import { DBObject, TableName } from '@merchant-workspace/api-interfaces'
import { CreateInvoicePayload, Invoice, UpdateInvoicePayload } from '@merchant-workspace/api-interfaces'
import { DB } from './main'
import { Database } from 'sqlite3'
import {
  getSQLitifiedKeysNames,
  mapDBObjectToJSFormat,
  mapJSObjectToDBFormat,
  prepareCreateProps,
  prepareUpdateProps,
  removeUndefined,
} from './helpers'
import connection from './connection'

export class InvoiceTable extends DB {
  constructor(db: Database, private tableName: TableName = 'invoice') {
    super(db)
  }

  public async getInvoices(): Promise<Invoice[]> {
    const query = `SELECT * FROM ${this.tableName};`
    const invoices = await this.all<Invoice, undefined>(query)
    return removeUndefined(invoices.map((invoice) => mapDBObjectToJSFormat(invoice)))
  }

  public async getInvoiceById(id: number): Promise<Invoice | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $id LIMIT 1;`
    const invoice = await this.get<Invoice, { id: number }>(query, { id })
    return mapDBObjectToJSFormat(invoice)
  }

  public async createInvoice(payload: CreateInvoicePayload): Promise<number> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { keys } = prepareCreateProps(dbPayload)
    const keysNames = getSQLitifiedKeysNames(dbPayload)
    const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${keysNames});`
    await this.run<Invoice, DBObject>(query, dbPayload)
    return this.lastId()
  }

  public async updateInvoice(payload: UpdateInvoicePayload): Promise<Invoice | undefined> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { id, ...rest } = dbPayload
    const invoice = await this.getInvoiceById(id)
    if (!invoice) {
      return
    }
    const updateString = prepareUpdateProps<Omit<UpdateInvoicePayload, 'id'>>(rest)
    const query = `UPDATE ${this.tableName} SET ${updateString} WHERE id = $id`
    await this.run<Invoice, DBObject>(query, dbPayload)
    return this.getInvoiceById(id)
  }

  public async updateInvoiceCustomer(
    id: number,
    customerId: Invoice['customerId'],
  ): Promise<Invoice | undefined> {
    return this.updateInvoice({ id, customerId })
  }

  public async updateInvoiceAuthor(
    id: number,
    author: Invoice['author'],
  ): Promise<Invoice | undefined> {
    return this.updateInvoice({ id, author })
  }
  // ... TODO more specific methods

  public async deleteInvoice(id: number): Promise<Invoice | undefined> {
    const invoice = await this.getInvoiceById(id)
    if (!invoice) {
      return
    }
    const query = `DELETE FROM ${this.tableName} WHERE id = $id;`
    await this.run<Invoice, { id: number }>(query, { id })
    return invoice
  }

  public async lastId(): Promise<number> {
    return this.getLastId(this.tableName)
  }
}

export default new InvoiceTable(connection)
