import initDB from '../../app/services/repository/db/init'
import {
  createInvoiceData,
  prepareCreateAccountPayload,
  prepareCreateCustomerPayload,
  prepareCreateInvoicePayload,
} from '../lib/fixtures'
import AccountTable from '../../app/services/repository/db/account.db'
import CustomerTable from '../../app/services/repository/db/customer.db'
import InvoiceTable from '../../app/services/repository/db/invoice.db'
import { UpdateInvoicePayload } from '@merchant-workspace/api-interfaces'

describe('Database - Invoice Table', () => {
  let accountId = 1
  let customerId = 1

  beforeAll(async () => {
    await initDB.initHandler()
    await initDB.deleteData()
    accountId = await createAccount()
    customerId = await createCustomer(accountId)
  })

  beforeEach(async () => {
    await initDB.initTestInvoiceData(accountId, customerId)
  })

  it('Should get all data from invoice table', async () => {
    const invoiceData = createInvoiceData(accountId, customerId)
    const invoices = await InvoiceTable.getInvoices()

    expect(invoices.length).toBe(4)
    expect(invoices).toEqual(
      expect.arrayContaining([
        expect.objectContaining(invoiceData[0]),
        expect.objectContaining(invoiceData[1]),
      ]),
    )
  })

  it('Should get invoice by id', async () => {
    const invoiceData = createInvoiceData(accountId, customerId)
    const id = await InvoiceTable.lastId()
    const invoice = await InvoiceTable.getInvoiceById(id)
    const keys = Object.keys(invoiceData[0])

    for (const key of keys) {
      expect(invoice).toHaveProperty(key)
    }

    expect(id).toBeGreaterThan(0)
  })

  it('Should create invoice', async () => {
    const payload = prepareCreateInvoicePayload(accountId, customerId)
    const id = await InvoiceTable.createInvoice(payload)
    const invoice = await InvoiceTable.getInvoiceById(id)

    expect(invoice).toMatchObject(payload)
    expect(id).toBeGreaterThan(0)
  })

  it('Should update invoice', async () => {
    const id = await InvoiceTable.lastId()
    const invoice = await InvoiceTable.getInvoiceById(id)
    const payload: UpdateInvoicePayload = {
      id,
      author: 'Sadio Mane',
      servicePeriod: '01-02-2021 - 26-02-2021',
    }
    const updatedInvoice = await InvoiceTable.updateInvoice(payload)

    expect(invoice!.id).toBe(updatedInvoice!.id)
    expect(invoice).not.toMatchObject(updatedInvoice!)
    expect(updatedInvoice).toMatchObject({ ...invoice, ...payload })
  })

  it('Should return undefined if invoice to update does not exist', async () => {
    const id = (await InvoiceTable.lastId()) + 1
    const invoice = await InvoiceTable.getInvoiceById(id)
    const payload: UpdateInvoicePayload = {
      id,
      author: 'Sadio Mane',
      servicePeriod: '01-02-2021 - 26-02-2021',
    }
    const updatedInvoice = await InvoiceTable.updateInvoice(payload)

    expect(invoice).toBe(undefined)
    expect(updatedInvoice).toBe(undefined)
  })

  it('Should delete invoice', async () => {
    const payload = prepareCreateInvoicePayload(accountId, customerId)
    const id = await InvoiceTable.createInvoice(payload)
    const invoice = await InvoiceTable.getInvoiceById(id)
    expect(invoice).toMatchObject(payload)

    const deletedInvoice = await InvoiceTable.deleteInvoice(id)
    expect(invoice).toMatchObject(deletedInvoice!)

    const invoiceAfterDelete = await InvoiceTable.getInvoiceById(id)
    expect(invoiceAfterDelete).toBe(undefined)
  })

  it('Should return undefined if company to delete does not exist', async () => {
    const id = (await InvoiceTable.lastId()) + 1
    const invoice = await InvoiceTable.getInvoiceById(id)
    const deletedInvoice = await InvoiceTable.deleteInvoice(id)

    expect(invoice).toBe(undefined)
    expect(deletedInvoice).toBe(undefined)
  })

  afterEach(async () => {
    await initDB.deleteData()
  })
})

const createAccount = async (): Promise<number> => {
  const payload = prepareCreateAccountPayload()
  return AccountTable.createAccount(payload)
}

const createCustomer = async (accountId: number): Promise<number> => {
  const payload = prepareCreateCustomerPayload(accountId)
  return CustomerTable.createCustomer(payload)
}
