import { DBObject, TableName } from '@merchant-workspace/api-interfaces'
import {
  CreateInvoicePositionPayload,
  InvoicePosition,
  UpdateInvoicePositionPayload,
} from '@merchant-workspace/api-interfaces'
import { Invoice } from '@merchant-workspace/api-interfaces'
import { DB } from './main'
import { Database } from 'sqlite3'
import {
  getSQLitifiedKeysNames,
  mapDBObjectToJSFormat,
  mapJSObjectToDBFormat,
  prepareConditions,
  prepareCreateProps,
  prepareUpdateProps,
  removeUndefined,
} from './helpers'

import connection from './connection'

export class InvoicePositionsTable extends DB {
  constructor(db: Database, private tableName: TableName = 'invoice_position') {
    super(db)
  }

  public async getInvoicePositionsByInvoiceId(
    invoiceId: InvoicePosition['invoiceId'],
  ): Promise<InvoicePosition[]> {
    const dbObject = mapJSObjectToDBFormat({ invoiceId })
    const query = `SELECT * FROM ${this.tableName} ${prepareConditions(dbObject)};`
    const invoicePositions = await this.all<InvoicePosition, undefined>(query)
    return removeUndefined(
      invoicePositions.map((invoicePosition) => mapDBObjectToJSFormat(invoicePosition)),
    )
  }

  public async getInvoiceSinglePositionById(id: number): Promise<InvoicePosition | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $id LIMIT 1;`
    const invoicePosition = await this.get<InvoicePosition, { id: number }>(query, { id })
    return mapDBObjectToJSFormat(invoicePosition)
  }

  public async createInvoicePosition(payload: CreateInvoicePositionPayload): Promise<number> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { keys } = prepareCreateProps(dbPayload)
    const keysNames = getSQLitifiedKeysNames(dbPayload)
    const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${keysNames});`
    await this.run<InvoicePosition, DBObject>(query, dbPayload)
    return this.lastId()
  }

  public async updateInvoicePosition(
    payload: UpdateInvoicePositionPayload,
  ): Promise<InvoicePosition | undefined> {
    const dbPayload = mapJSObjectToDBFormat(payload)
    const { id, ...rest } = dbPayload
    const invoicePosition = await this.getInvoiceSinglePositionById(id)
    if (!invoicePosition) {
      return
    }
    const updateString = prepareUpdateProps<Omit<UpdateInvoicePositionPayload, 'id'>>(rest)
    const query = `UPDATE ${this.tableName} SET ${updateString} WHERE id = $id`
    await this.run<InvoicePosition, DBObject>(query, dbPayload)
    return this.getInvoiceSinglePositionById(id)
  }

  public async deleteInvoicePostition(id: number): Promise<InvoicePosition | undefined> {
    const invoicePosition = await this.getInvoiceSinglePositionById(id)
    if (!invoicePosition) {
      return
    }

    const query = `DELETE FROM ${this.tableName} WHERE id = $id;`
    await this.run<Invoice, { id: number }>(query, { id })
    return invoicePosition
  }

  public async lastId(): Promise<number> {
    return this.getLastId(this.tableName)
  }
}

export default new InvoicePositionsTable(connection)
