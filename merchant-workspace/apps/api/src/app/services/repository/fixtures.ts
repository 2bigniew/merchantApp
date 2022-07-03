import initDB from './db/init'
import AccountTable from './db/account.db'
import CompanyTable from './db/company.db'
import InvoiceTable from './db/invoice.db'

export const fixtures = async (): Promise<void> => {
  // TODO check is database empty
  if (process.env.NODE_ENV === 'development') {
    await initDB.initTestAccountData()
    const accountId = await AccountTable.lastId()
    await initDB.initTestCompanyData(accountId)
    await initDB.initTestCustomerData(accountId)
    const companyId = await CompanyTable.lastId()
    await initDB.initTestInvoiceData(accountId, companyId)
    const invoiceId = await InvoiceTable.lastId()
    await initDB.initTestInvoicePositionData(invoiceId)
  }
}
