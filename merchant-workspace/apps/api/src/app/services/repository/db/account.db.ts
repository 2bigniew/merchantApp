import { Account, CreateAccountPayload, UpdateAccountPayload } from '@merchant-workspace/api-interfaces'
import { TableName } from '@merchant-workspace/api-interfaces'
import { Database } from 'sqlite3'
import { DB } from './main'
import { mapDBObjectToJSFormat, prepareUpdateProps, removeUndefined } from './helpers'
import connection from './connection'

export class AccountTable extends DB {
  constructor(db: Database, private tableName: TableName = 'account') {
    super(db)
  }

  public async getAccounts(): Promise<Account[]> {
    const query = `SELECT * FROM ${this.tableName};`
    const accounts = await this.all<Account, undefined>(query)
    return removeUndefined(accounts.map((account) => mapDBObjectToJSFormat<Account>(account)))
  }

  public async getAccountsById(id: number): Promise<Account | undefined> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $id LIMIT 1;`
    const account = await this.get<Account, { id: number }>(query, { id })
    return mapDBObjectToJSFormat(account)
  }

  public async createAccount(payload: CreateAccountPayload): Promise<number> {
    const query = `INSERT INTO ${this.tableName} (firstname, lastname, password, email)
            VALUES ($firstname, $lastname, $password, $email);`
    await this.run<Account, CreateAccountPayload>(query, payload)
    return this.lastId()
  }

  public async updateAccount(payload: UpdateAccountPayload): Promise<Account | undefined> {
    const { id, ...rest } = payload
    const account = await this.getAccountsById(id)
    if (!account) {
      return
    }
    const updateString = prepareUpdateProps<Omit<UpdateAccountPayload, 'id'>>(rest)
    const query = `UPDATE ${this.tableName} SET ${updateString} WHERE id = $id;`
    await this.run<Account, UpdateAccountPayload>(query, payload)
    return this.getAccountsById(id)
  }

  public async deleteAccount(id: number): Promise<Account | undefined> {
    const account = await this.getAccountsById(id)
    if (!account) {
      return undefined
    }
    const query = `DELETE FROM ${this.tableName} WHERE id = $id;`
    await this.run<Account, { id: number }>(query, { id })
    return account
  }

  public async lastId(): Promise<number> {
    return this.getLastId(this.tableName)
  }
}

export default new AccountTable(connection)
