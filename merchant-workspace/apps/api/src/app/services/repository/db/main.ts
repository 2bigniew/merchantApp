import { Database, verbose } from 'sqlite3'
import { TableName } from '@merchant-workspace/api-interfaces'
import { SQLitiffy } from './helpers'

export abstract class DB {
  protected db: Database

  protected constructor(db: Database) {
    verbose()
    this.db = db
  }

  protected async get<T, R>(query: string, params?: R): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.get(query, SQLitiffy<R>(params), (err, row) => {
        if (err) {
          reject(err)
        }

        resolve(row as T)
      })
    })
  }

  protected async all<T, R>(query: string, params?: R): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, SQLitiffy<R>(params), (err, rows) => {
        if (err) {
          reject(err)
        }

        resolve(rows as T[])
      })
    })
  }

  protected async run<T, R>(query: string, params: R): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(query, SQLitiffy<R>(params), (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  protected async getLastId(tableName: TableName): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${tableName} ORDER BY 1 DESC LIMIT 1;`
      this.db.get(query, (err, row) => {
        if (err) {
          reject(err)
        }

        resolve(row ? row.id : 0)
      })
    })
  }
}
