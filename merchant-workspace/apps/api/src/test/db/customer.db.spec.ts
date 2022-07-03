import initDB from '../../app/services/repository/db/init'
import CustomerTable from '../../app/services/repository/db/customer.db'
import AccountTable from '../../app/services/repository/db/account.db'
import { UpdateCompanyPayload } from '@merchant-workspace/api-interfaces'
import { UpdateCustomerPayload } from '@merchant-workspace/api-interfaces'
import {
  createCustomersData,
  prepareCreateAccountPayload,
  prepareCreateCustomerPayload,
} from '../lib/fixtures'

describe('Database - Customer Table', () => {
  let accountId = 1

  beforeAll(async () => {
    await initDB.initHandler()
    await initDB.deleteData()
    accountId = await createAccount()
  })

  beforeEach(async () => {
    await initDB.initTestCustomerData(accountId)
  })

  it('Should get all data from db - customer table', async () => {
    const customerData = createCustomersData(accountId)
    const customers = await CustomerTable.getCustomers()

    expect(customers.length).toBe(6)
    expect(customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customerData[0]),
        expect.objectContaining(customerData[1]),
        expect.objectContaining(customerData[2]),
      ]),
    )
  })

  it('Should get customer data by id from db', async () => {
    const id = await CustomerTable.lastId()
    const customer = await CustomerTable.getCustomerById(id)
    const customerData = createCustomersData(accountId)
    const keys = Object.keys(customerData[0])

    for (const key of keys) {
      expect(customer).toHaveProperty(key)
    }

    expect(id).toBeGreaterThan(0)
  })

  it('Should create customer', async () => {
    const payload = prepareCreateCustomerPayload(accountId)
    const id = await CustomerTable.createCustomer(payload)
    const customer = await CustomerTable.getCustomerById(id)

    expect(customer).toMatchObject(payload)
    expect(id).toBeGreaterThan(0)
  })

  it('Should update customer', async () => {
    const id = await CustomerTable.lastId()
    const customer = await CustomerTable.getCustomerById(id)
    const payload: UpdateCompanyPayload = {
      id,
      nip: '9876543210',
      bankName: 'HSBC',
    }
    const updatedCustomer = await CustomerTable.updateCustomer({ ...payload })

    expect(customer!.id).toBe(updatedCustomer!.id)
    expect(customer).not.toMatchObject(updatedCustomer!)
    expect(updatedCustomer).toMatchObject({ ...customer, ...payload })
  })

  it('Should return undefined if customer to update does not exist', async () => {
    const lastId = await CustomerTable.lastId()
    const id = lastId + 1
    const customer = await CustomerTable.getCustomerById(id)
    const payload: UpdateCustomerPayload = {
      id,
      nip: '9876543210',
      bankName: 'HSBC',
    }
    const updatedCustomer = await CustomerTable.updateCustomer({ ...payload })

    expect(customer).toBe(undefined)
    expect(updatedCustomer).toBe(undefined)
  })

  it('Should delete customer', async () => {
    const payload = prepareCreateCustomerPayload(accountId)
    const id = await CustomerTable.createCustomer(payload)
    const customer = await CustomerTable.getCustomerById(id)
    expect(customer).toMatchObject(payload)

    const deletedAccount = await CustomerTable.deleteCustomer(customer!.id)
    expect(customer).toMatchObject(deletedAccount!)

    const accountAfterDelete = await CustomerTable.getCustomerById(id)
    expect(accountAfterDelete).toBe(undefined)
  })

  it('Should return undefined if customer to delete does not exist', async () => {
    const lastId = await CustomerTable.lastId()
    const id = lastId + 1
    const customer = await CustomerTable.getCustomerById(id)
    const deletedCustomer = await CustomerTable.deleteCustomer(id)

    expect(customer).toBe(undefined)
    expect(deletedCustomer).toBe(undefined)
  })

  afterEach(async () => {
    await initDB.deleteData()
  })
})

const createAccount = async (): Promise<number> => {
  const payload = prepareCreateAccountPayload()
  return AccountTable.createAccount(payload)
}
