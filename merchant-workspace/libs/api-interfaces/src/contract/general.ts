export type DBObject = Record<string, any>

export const CURRENCY_VALUES = ['PLN', 'EUR', 'USD', 'GBP']

export type Currency = typeof CURRENCY_VALUES[number]

export type TableName =
    | 'account'
    | 'company'
    | 'settings'
    | 'customer'
    | 'invoice'
    | 'invoice_position'


