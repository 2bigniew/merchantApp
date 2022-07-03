import initDB from '../../app/services/repository/db/init'
import CompanyTable from '../../app/services/repository/db/company.db'
import AccountTable from '../../app/services/repository/db/account.db'
import { UpdateCompanyPayload } from '@merchant-workspace/api-interfaces'
import {
  createCompanyData,
  prepareCreateAccountPayload,
  prepareCreateCompanyPayload,
} from '../lib/fixtures'

describe('Database - Company Table', () => {
  let accountId = 1

  beforeAll(async () => {
    await initDB.initHandler()
    await initDB.deleteData()
    accountId = await createAccount()
  })

  beforeEach(async () => {
    await initDB.initTestCompanyData(accountId)
  })

  it('Should get all data from db - company table', async () => {
    const companyData = createCompanyData(accountId)
    const companies = await CompanyTable.getCompanies()

    expect(companies.length).toBe(6)
    expect(companies).toEqual(
      expect.arrayContaining([
        expect.objectContaining(companyData[0]),
        expect.objectContaining(companyData[1]),
        expect.objectContaining(companyData[2]),
      ]),
    )
  })

  it('Should get company data by id from db', async () => {
    const id = await CompanyTable.lastId()
    const company = await CompanyTable.getCompanyById(id)
    const companyData = createCompanyData(accountId)
    const keys = Object.keys(companyData[0])

    for (const key of keys) {
      expect(company).toHaveProperty(key)
    }

    expect(id).toBeGreaterThan(0)
  })

  it('Should create company', async () => {
    const payload = prepareCreateCompanyPayload(accountId)
    const id = await CompanyTable.createCompany(payload)
    const company = await CompanyTable.getCompanyById(id)

    expect(company).toMatchObject(payload)
    expect(id).toBeGreaterThan(0)
  })

  it('Should update company', async () => {
    const id = await CompanyTable.lastId()
    const company = await CompanyTable.getCompanyById(id)
    const payload: UpdateCompanyPayload = {
      id,
      nip: '9876543210',
      bankName: 'HSBC',
    }
    const updatedCompany = await CompanyTable.updateCompany({ ...payload })

    expect(company!.id).toBe(updatedCompany!.id)
    expect(company).not.toMatchObject(updatedCompany!)
    expect(updatedCompany).toMatchObject({ ...company, ...payload })
  })

  it('Should return undefined if company to update does not exist', async () => {
    const lastId = await CompanyTable.lastId()
    const id = lastId + 1
    const company = await CompanyTable.getCompanyById(id)
    const payload: UpdateCompanyPayload = {
      id,
      nip: '9876543210',
      bankName: 'HSBC',
    }
    const updatedCompany = await CompanyTable.updateCompany({ ...payload })

    expect(company).toBe(undefined)
    expect(updatedCompany).toBe(undefined)
  })

  it('Should delete company', async () => {
    const payload = prepareCreateCompanyPayload(accountId)
    const id = await CompanyTable.createCompany(payload)
    const company = await CompanyTable.getCompanyById(id)
    expect(company).toMatchObject(payload)

    const deletedCompany = await CompanyTable.deleteCompany(company!.id)
    expect(company).toMatchObject(deletedCompany!)

    const companyAfterDelete = await CompanyTable.getCompanyById(id)
    expect(companyAfterDelete).toBe(undefined)
  })

  it('Should return undefined if company to delete does not exist', async () => {
    const lastId = await CompanyTable.lastId()
    const id = lastId + 1
    const company = await CompanyTable.getCompanyById(id)
    const deletedCompany = await CompanyTable.getCompanyById(id)

    expect(company).toBe(undefined)
    expect(deletedCompany).toBe(undefined)
  })

  afterEach(async () => {
    await initDB.deleteData()
  })
})

const createAccount = async (): Promise<number> => {
  const payload = prepareCreateAccountPayload()
  return AccountTable.createAccount(payload)
}
