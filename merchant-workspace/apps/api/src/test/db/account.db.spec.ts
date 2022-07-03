import initDB from '../../app/services/repository/db/init'
import AccountTable from '../../app/services/repository/db/account.db'
import { prepareCreateAccountPayload } from '../lib/fixtures'

const accountData = [
  {
    firstname: 'Krishna',
    lastname: 'Carnalan',
    email: 'kcarnalan0@yellowpages.com',
    password: 'z9Bcu06',
  },
  { firstname: 'Aldo', lastname: 'Djorevic', email: 'adjorevic1@loc.gov', password: 'uZG5tPSVDX' },
  { firstname: 'Howie', lastname: 'Mix', email: 'hmix2@ask.com', password: 'xz8NMuYXt4M' },
  {
    firstname: 'Gustav',
    lastname: 'Craigmile',
    email: 'gcraigmile3@rediff.com',
    password: 'h71aesLPwHZ',
  },
  {
    firstname: 'Gabrielle',
    lastname: 'Cadany',
    email: 'gcadany4@histats.com',
    password: 'DbcTQKAWJ',
  },
]

describe('Database - Account Table', () => {
  beforeAll(async () => {
    await initDB.deleteData()
  })

  beforeEach(async () => {
    await initDB.initHandler()
    await initDB.initTestAccountData()
  })

  it('Should get all data from db', async () => {
    const accounts = await AccountTable.getAccounts()

    expect(accounts.length).toBe(5)
    expect(accounts).toMatchObject(accountData)
  })

  it('Should get account data by id from db', async () => {
    const id = await AccountTable.lastId()
    const account = await AccountTable.getAccountsById(id)

    expect(account).toMatchObject(accountData[accountData.length - 1])
    expect(id).toBeGreaterThan(0)
  })

  it('Should create account', async () => {
    const payload = prepareCreateAccountPayload()
    const id = await AccountTable.createAccount(payload)
    const account = await AccountTable.getAccountsById(id)

    expect(account).toMatchObject(payload)
    expect(id).toBeGreaterThan(0)
  })

  it('Should update account', async () => {
    const id = await AccountTable.lastId()
    const account = await AccountTable.getAccountsById(id)
    const payload = {
      firstname: 'Virgil',
      lastname: 'Van Dijk',
    }
    const updatedAccount = await AccountTable.updateAccount({ ...payload, id })

    expect(account!.id).toBe(updatedAccount!.id)
    expect(account).not.toMatchObject(updatedAccount!)
    expect(updatedAccount).toMatchObject({ ...account, ...payload })
  })

  it('Should return undefined if account to update does not exist', async () => {
    const lastId = await AccountTable.lastId()
    const id = lastId + 1
    const account = await AccountTable.getAccountsById(id)
    const payload = {
      firstname: 'Virgil',
      lastname: 'Van Dijk',
    }
    const updatedAccount = await AccountTable.updateAccount({ ...payload, id })

    expect(account).toBe(undefined)
    expect(updatedAccount).toBe(undefined)
  })

  it('Should delete account', async () => {
    const payload = prepareCreateAccountPayload()
    const id = await AccountTable.createAccount(payload)
    const account = await AccountTable.getAccountsById(id)
    expect(account).toMatchObject(payload)

    const deletedAccount = await AccountTable.deleteAccount(account!.id)
    expect(account).toMatchObject(deletedAccount!)

    const accountAfterDelete = await AccountTable.getAccountsById(id)
    expect(accountAfterDelete).toBe(undefined)
  })

  it('Should return undefined if account to delete does not exist', async () => {
    const lastId = await AccountTable.lastId()
    const id = lastId + 1
    const account = await AccountTable.getAccountsById(id)
    const deletedAccount = await AccountTable.deleteAccount(id)
    const accountAfterDelete = await AccountTable.getAccountsById(id)

    expect(account).toBe(undefined)
    expect(deletedAccount).toBe(undefined)
    expect(accountAfterDelete).toBe(undefined)
  })

  afterEach(async () => {
    await initDB.deleteData()
  })
})
