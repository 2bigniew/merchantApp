import {
  mapDBObjectToJSFormat,
  mapJSObjectToDBFormat,
  prepareConditions,
  prepareCreateProps,
  prepareUpdateProps,
  SQLitiffy,
  WhereSource,
} from '../../app/services/repository/db/helpers'

const payload = {
  firstname: 'Krishna',
  lastname: 'Carnalan',
  email: 'kcarnalan0@yellowpages.com',
  password: 'z9Bcu06',
}

const jsObject = {
  name: 'Transcof',
  street: 'Montana',
  buldingNumber: '206',
  locality: '102',
  postalCode: '38-123',
  city: 'Wysoka Strzyżowska',
  country: 'Poland',
  nip: '7195596289',
  bankAccount: '65693911804359744968',
  bankName: 'Hatity Bank',
}

const dbObject = {
  name: 'Transcof',
  street: 'Montana',
  bulding_number: '206',
  locality: '102',
  postal_code: '38-123',
  city: 'Wysoka Strzyżowska',
  country: 'Poland',
  nip: '7195596289',
  bank_account: '65693911804359744968',
  bank_name: 'Hatity Bank',
}

describe('Database - Helpers', () => {
  it('prepareCreateProps', async () => {
    const { keys, values } = prepareCreateProps({ ...payload })
    expect(keys).toBe('firstname, lastname, email, password')
    expect(values).toBe('Krishna, Carnalan, kcarnalan0@yellowpages.com, z9Bcu06')
  })

  it('prepareUpdateProps', async () => {
    const data = prepareUpdateProps({ ...payload, email: undefined })
    expect(data).toBe('firstname = $firstname, lastname = $lastname, password = $password')
  })

  it('SQLitiffy', async () => {
    const data = SQLitiffy({ ...payload })
    expect(data).toMatchObject({
      ['$firstname']: 'Krishna',
      ['$lastname']: 'Carnalan',
      ['$email']: 'kcarnalan0@yellowpages.com',
      ['$password']: 'z9Bcu06',
    })
  })

  it('mapJSObjectToDBFormat', async () => {
    const data = mapJSObjectToDBFormat(jsObject)
    expect(data).toMatchObject(dbObject)
  })

  it('mapDBObjectToJSFormat', async () => {
    const data = mapDBObjectToJSFormat(dbObject)
    expect(data).toMatchObject(jsObject)
  })
})

describe('Database - Helpers - prepareConditions', () => {
  const whereString: Record<string, WhereSource> = { lastName: 'Firmino' }
  const whereNumber: Record<string, WhereSource> = { id: 42 }
  const whereBoolean: Record<string, WhereSource> = { isMarried: true }
  const whereNull: Record<string, WhereSource> = { somethingReallyWeird: null }
  const whereUndefined: Record<string, WhereSource> = { somethingElse: undefined }
  const whereArray: Record<string, WhereSource> = { month: ['june', 'july', 'august'] }
  const whereDate: Record<string, WhereSource> = {
    day: { date: new Date('2020-02-02'), dateCondition: 'LT' },
  }
  const whereAll: Record<string, WhereSource> = {
    ...whereString,
    ...whereNumber,
    ...whereBoolean,
    ...whereNull,
    ...whereUndefined,
    ...whereArray,
    ...whereDate,
  }
  it('Should return where condition - string', () => {
    const dbObj = mapJSObjectToDBFormat(whereString)
    const where = prepareConditions(dbObj)

    expect(where).toBe("WHERE last_name LIKE '%Firmino%'")
  })

  it('Should return where condition - number', () => {
    const dbObj = mapJSObjectToDBFormat(whereNumber)
    const where = prepareConditions(dbObj)

    expect(where).toBe('WHERE id = 42')
  })

  it('Should return where condition - boolean', () => {
    const dbObj = mapJSObjectToDBFormat(whereBoolean)
    const where = prepareConditions(dbObj)

    expect(where).toBe('WHERE is_married IS TRUE')
  })

  it('Should return where condition - null', () => {
    const dbObj = mapJSObjectToDBFormat(whereNull)
    const where = prepareConditions(dbObj)

    expect(where).toBe('WHERE something_really_weird IS NULL')
  })

  it('Should return where condition - undefined', () => {
    const dbObj = mapJSObjectToDBFormat(whereUndefined)
    const where = prepareConditions(dbObj)

    expect(where).toBe('')
  })

  it('Should return where condition - array', () => {
    const dbObj = mapJSObjectToDBFormat(whereArray)
    const where = prepareConditions(dbObj)

    expect(where).toBe("WHERE month IN ('june', 'july', 'august')")
  })

  // TODO fix after adding luxon
  // it('Should return where condition - date', () => {
  //   const dbObj = mapJSObjectToDBFormat(whereDate)
  //   const where = prepareConditions(dbObj, 'AND')
  //
  //   expect(where).toBe("WHERE day < '2020-02-02'::date")
  // })

  it('Should return where condition - all - AND', () => {
    const dbObj = mapJSObjectToDBFormat(whereAll)
    const where = prepareConditions(dbObj, 'AND')

    expect(where).toBe(
      "WHERE last_name LIKE '%Firmino%' AND id = 42 AND is_married IS TRUE AND something_really_weird IS NULL AND month IN ('june', 'july', 'august')",
    )
  })

  it('Should return where condition - all - OR', () => {
    const dbObj = mapJSObjectToDBFormat(whereAll)
    const where = prepareConditions(dbObj, 'OR')

    expect(where).toBe(
      "WHERE last_name LIKE '%Firmino%' OR id = 42 OR is_married IS TRUE OR something_really_weird IS NULL OR month IN ('june', 'july', 'august')",
    )
  })
})
