import {
  createInvoicePositionsData,
  prepareCreateAccountPayload,
  prepareCreateCustomerPayload,
  prepareCreateInvoicePositionPayload,
} from '../lib/fixtures'
import AccountTable from '../../app/services/repository/db/account.db'
import CustomerTable from '../../app/services/repository/db/customer.db'
import initDB from '../../app/services/repository/db/init'
import InvoiceTable from '../../app/services/repository/db/invoice.db'
import InvoicePositionsTable from '../../app/services/repository/db/invoicePositions.db'
import { UpdateInvoicePositionPayload } from '@merchant-workspace/api-interfaces'

describe('Database - InvoicePosition Table', () => {
  let accountId = 1
  let customerId = 1
  let invoiceId = 1

  beforeAll(async () => {
    await initDB.initHandler()
    await initDB.deleteData()
    accountId = await createAccount()
    customerId = await createCustomer(accountId)
  })

  beforeEach(async () => {
    await initDB.initTestInvoiceData(accountId, customerId)
    invoiceId = await InvoiceTable.lastId()
    await initDB.initTestInvoicePositionData(invoiceId)
  })

  it('Should get invoice positions by invoice id', async () => {
    const invoicePositionsData = createInvoicePositionsData(invoiceId)
    const invoicesPositions = await InvoicePositionsTable.getInvoicePositionsByInvoiceId(invoiceId)

    expect(invoicesPositions.length).toBe(2)
    expect(invoicesPositions).toEqual(
      expect.arrayContaining([
        expect.objectContaining(invoicePositionsData[0]),
        expect.objectContaining(invoicePositionsData[1]),
      ]),
    )
  })

  it('Should get invoice position by id', async () => {
    const invoicePositionsData = createInvoicePositionsData(invoiceId)
    const id = await InvoicePositionsTable.lastId()
    const invoicePosition = await InvoicePositionsTable.getInvoiceSinglePositionById(id)
    const keys = Object.keys(invoicePositionsData[0])

    for (const key of keys) {
      expect(invoicePosition).toHaveProperty(key)
    }

    expect(id).toBeGreaterThan(0)
  })

  it('Should create invoice position', async () => {
    const payload = prepareCreateInvoicePositionPayload(invoiceId)
    const id = await InvoicePositionsTable.createInvoicePosition(payload)
    const invoicePosition = await InvoicePositionsTable.getInvoiceSinglePositionById(id)

    expect(invoicePosition).toMatchObject(payload)
    expect(id).toBeGreaterThan(0)
  })

  it('Should update invoice position', async () => {
    const id = await InvoicePositionsTable.lastId()
    const invoicePosition = await InvoicePositionsTable.getInvoiceSinglePositionById(id)
    const payload: UpdateInvoicePositionPayload = {
      id,
      positionName: 'Consulting',
    }
    const updatedInvoicePosition = await InvoicePositionsTable.updateInvoicePosition(payload)

    expect(invoicePosition!.id).toBe(updatedInvoicePosition!.id)
    expect(updatedInvoicePosition).not.toMatchObject(invoicePosition!)
    expect(updatedInvoicePosition).toMatchObject({ ...invoicePosition, ...payload })
  })

  it('Should return undefined id invoice position to update does not exist', async () => {
    const id = (await InvoicePositionsTable.lastId()) + 1
    const invoicePosition = await InvoicePositionsTable.getInvoiceSinglePositionById(id)
    const payload: UpdateInvoicePositionPayload = {
      id,
      positionName: 'Consulting',
    }
    const updatedInvoicePosition = await InvoicePositionsTable.updateInvoicePosition(payload)
    expect(invoicePosition).toBe(undefined)
    expect(updatedInvoicePosition).toBe(undefined)
  })

  it('Should delete invoice position', async () => {
    const payload = prepareCreateInvoicePositionPayload(invoiceId)
    const id = await InvoicePositionsTable.createInvoicePosition(payload)
    const invoicePosition = await InvoicePositionsTable.getInvoiceSinglePositionById(id)
    expect(invoicePosition).toMatchObject(payload)

    const deletedInvoicePosition = await InvoicePositionsTable.deleteInvoicePostition(id)
    expect(invoicePosition).toMatchObject(deletedInvoicePosition!)

    const invoicePositionAfterDelete = await InvoicePositionsTable.getInvoiceSinglePositionById(id)
    expect(invoicePositionAfterDelete).toBe(undefined)
  })

  it('Should return undefined id invoice position to delete does not exist', async () => {
    const id = (await InvoicePositionsTable.lastId()) + 1
    const invoicePosition = await InvoicePositionsTable.getInvoiceSinglePositionById(id)
    const deletedInvoicePosition = await InvoicePositionsTable.deleteInvoicePostition(id)

    expect(invoicePosition).toBe(undefined)
    expect(deletedInvoicePosition).toBe(undefined)
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
