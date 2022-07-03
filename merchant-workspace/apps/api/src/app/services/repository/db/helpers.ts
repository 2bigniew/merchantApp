import { camelCase, snakeCase } from 'lodash'
import { DBObject } from '@merchant-workspace/api-interfaces'

export const prepareCreateProps = <T>(payload: T): { keys: string; values: string } => {
  const keys = []
  const values = []
  for (const [key, value] of Object.entries(payload)) {
    if (value) {
      keys.push(key)
      values.push(value)
    }
  }

  return {
    keys: keys.join(', '),
    values: values.join(', '),
  }
}

export const prepareUpdateProps = <T>(payload: T): string => {
  const pairs = []
  for (const [key, value] of Object.entries(payload)) {
    if (value) {
      pairs.push(`${key} = $${key}`)
    }
  }

  return pairs.join(', ')
}

export type WhereSeparator = 'AND' | 'OR'
export type WhereCondition = '=' | 'LIKE' | 'IN' | 'IS' | '<' | '>' | '>=' | '<='
export type WhereDateCondition = 'GT' | 'GTE' | 'LT' | 'LTE'
export type WhereDate = { date: Date; dateCondition: WhereDateCondition }
export type WhereSource =
  | string
  | number
  | boolean
  | Array<string>
  | Array<number>
  | undefined
  | null
  | WhereDate

export type WhereValue = string | number | boolean | Array<string> | Array<number> | null | Date
export type WhereObject = {
  field: string
  condition: WhereCondition
  value: WhereValue
}

const dateConditionMapper: Record<WhereDateCondition, WhereCondition> = {
  GT: '>',
  GTE: '>=',
  LT: '<',
  LTE: '<=',
}

export const SQLitiffy = <T>(payload: T | undefined): Record<string, string> | undefined => {
  if (!payload) {
    return
  }

  const sqliteObject: Record<string, string> = {}
  for (const [key, value] of Object.entries(payload)) {
    sqliteObject[`$${key}`] = value
  }
  return sqliteObject
}

export const getSQLitifiedKeysNames = <T>(payload: T | undefined): string => {
  if (!payload) {
    return ''
  }
  const sqliteKeys = []
  for (const key of Object.keys(payload)) {
    sqliteKeys.push(`$${key}`)
  }
  return sqliteKeys.join(', ')
}

export const mapJSObjectToDBFormat = <T>(obj: T): DBObject => {
  const dbObject: Record<string, any> = {}
  for (const key of Object.keys(obj)) {
    const dbKey = snakeCase(key)
    dbObject[dbKey] = obj[key as keyof T]
  }
  return dbObject
}

export const mapDBObjectToJSFormat = <T>(obj: DBObject | undefined): T | undefined => {
  if (!obj) {
    return
  }

  const object: { [prop: string]: any } = {}
  for (const key of Object.keys(obj)) {
    const jsKey = camelCase(key)
    object[jsKey] = obj[key]
  }
  return object as T
}

export const prepareConditions = (
  obj: Record<string, WhereSource>,
  separator: WhereSeparator = 'AND',
): string => {
  const where: WhereObject[] = []
  const dbObj: Record<string, WhereSource> = mapJSObjectToDBFormat(obj)
  for (const key in dbObj) {
    if (typeof dbObj[key] === 'undefined') {
      continue
    }

    if (typeof dbObj[key] === 'string') {
      where.push({
        field: key,
        condition: 'LIKE',
        value: `'%${dbObj[key]}%'`,
      })
    }

    if (typeof dbObj[key] === 'number') {
      where.push({
        field: key,
        condition: '=',
        value: dbObj[key] as number,
      })
    }

    if (typeof dbObj[key] === 'object' && dbObj[key] instanceof Array) {
      const values: Array<string | number> = dbObj[key] as Array<string> | Array<number>
      where.push({
        field: key,
        condition: 'IN',
        value: `(${values
          .map((value) => (typeof value === 'string' ? `'${value}'` : value))
          .join(', ')})`,
      })
    }

    if (dbObj[key] === null) {
      where.push({
        field: key,
        condition: 'IS',
        value: 'NULL',
      })
    }

    if (typeof dbObj[key] === 'boolean') {
      where.push({
        field: key,
        condition: 'IS',
        value: dbObj[key] ? 'TRUE' : 'FALSE',
      })
    }

    // TODO fix after adding luxon
    // if (
    //   typeof dbObj[key] === 'object' &&
    //   dbObj[key] !== null &&
    //   'date' in (dbObj[key] as Record<string, unknown>) &&
    //   'dateCondition' in (dbObj[key] as Record<string, unknown>)
    // ) {
    //   const value = dbObj[key] as WhereDate
    //   where.push({
    //     field: key,
    //     condition: dateConditionMapper[value.dateCondition],
    //     value: `'${value.date}'::date`,
    //   })
    // }
  }

  const conditions = where.map((w) => `${w.field} ${w.condition} ${w.value}`).join(` ${separator} `)
  return conditions.length > 0 ? `WHERE ${conditions}` : ''
}

export const removeUndefined = <T>(arr: Array<T | undefined>): T[] =>
  arr.filter((el) => el !== undefined) as T[]
