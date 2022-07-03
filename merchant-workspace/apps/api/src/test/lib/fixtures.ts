import {Company, CreateCustomerPayload, Customer, Invoice} from '@merchant-workspace/api-interfaces'
import { CreateAccountPayload } from '@merchant-workspace/api-interfaces'
import { CreateInvoicePositionPayload, InvoicePosition } from '@merchant-workspace/api-interfaces'
import {CreateCompanyPayload, CreateInvoicePayload} from "@merchant-workspace/api-interfaces";

export const prepareCreateInvoicePositionPayload = (
  invoiceId: number,
): CreateInvoicePositionPayload => ({
  invoiceId,
  positionName: 'Consulting',
  businessActivityCode: '62.01.Z',
  measurement: 'szt.',
  amount: 2,
  priceNet: 1000,
  price: 1230,
  vat: 230,
  vatRate: 23,
  totalValueNet: 2000,
  totalValue: 2460,
  currency: 'PLN',
})

export const prepareCreateInvoicePayload = (
  accountId: number,
  customerId: number,
): CreateInvoicePayload => ({
  accountId,
  customerId,
  invoiceNumber: 'zxc001',
  priceNet: 1000,
  price: 1230,
  vat: 230,
  currency: 'PLN',
  invoiceDate: new Date('2021-02-28').toISOString(), // TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
  paymentDate: new Date('2021-03-07').toISOString(), // TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
  paymentPeriod: '7 days',
  servicePeriod: '01-02-2021 - 28-02-2021', // when service has been provided
  author: 'Bobby Firmino',
})

export const prepareCreateCompanyPayload = (accountId: number): CreateCompanyPayload => ({
  accountId,
  name: 'Liverpool FC',
  street: 'Anfield Road',
  buldingNumber: '3',
  postalCode: '123456',
  city: 'Liverpool',
  country: 'United Kingdom',
  nip: '1234567890',
  bankAccount: '123456789012345678900000',
  bankName: 'Liverpool Bank',
})

export const prepareCreateCustomerPayload = (accountId: number): CreateCustomerPayload => ({
  accountId,
  name: 'Liverpool FC',
  street: 'Anfield Road',
  buldingNumber: '3',
  postalCode: '123456',
  city: 'Liverpool',
  country: 'United Kingdom',
  nip: '1234567890',
  bankAccount: '123456789012345678900000',
  bankName: 'Liverpool Bank',
})

export const prepareCreateAccountPayload = (): CreateAccountPayload => ({
  firstname: 'Bobby',
  lastname: 'Firmino',
  email: 'bobby.firmino@lfc.com',
  password: 'cxzdsaeqw',
})

export const createCustomersData = (accountId: number): Omit<Customer, 'id' | 'createdAt'>[] => [
  {
    accountId,
    name: 'Otcom',
    street: 'Hallows',
    buldingNumber: '9',
    locality: '1',
    postalCode: '18-500',
    city: 'Kolno',
    country: 'Poland',
    nip: '1789442890',
    bankAccount: '32168545031438073902',
    bankName: 'Stim Bank',
  },
  {
    accountId,
    name: 'Namfix',
    street: 'Redwing',
    buldingNumber: '03',
    locality: '5',
    postalCode: '90-360',
    city: 'Zbytków',
    country: 'Poland',
    nip: '5983075519',
    bankAccount: '44422159652897351161',
    bankName: 'Flowdesk Bank',
  },
  {
    accountId,
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
  },
]

export const createCompanyData = (accountId: number): Omit<Company, 'id' | 'createdAt'>[] => [
  {
    accountId,
    name: 'Otcom',
    street: 'Hallows',
    buldingNumber: '9',
    locality: '1',
    postalCode: '18-500',
    city: 'Kolno',
    country: 'Poland',
    nip: '1789442890',
    bankAccount: '32168545031438073902',
    bankName: 'Stim Bank',
  },
  {
    accountId,
    name: 'Namfix',
    street: 'Redwing',
    buldingNumber: '03',
    locality: '5',
    postalCode: '90-360',
    city: 'Zbytków',
    country: 'Poland',
    nip: '5983075519',
    bankAccount: '44422159652897351161',
    bankName: 'Flowdesk Bank',
  },
  {
    accountId,
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
  },
]

export const createInvoiceData = (
  accountId: number,
  customerId: number,
): Omit<Invoice, 'id' | 'createdAt'>[] => [
  {
    accountId,
    customerId,
    invoiceNumber: 'abc001',
    priceNet: 1000,
    price: 1230,
    vat: 230,
    currency: 'PLN',
    invoiceDate: new Date('2021-04-30').toISOString(),
    paymentDate: new Date('2021-05-07').toISOString(),
    paymentPeriod: '7 dni',
    servicePeriod: '01-04-2021 - 30-04-2021',
    author: 'Roberto Firmino',
  },
  {
    accountId,
    customerId,
    invoiceNumber: 'abc002',
    priceNet: 1000,
    price: 1230,
    vat: 230,
    currency: 'PLN',
    invoiceDate: new Date('2021-05-31').toISOString(),
    paymentDate: new Date('2021-06-07').toISOString(),
    paymentPeriod: '7 dni',
    servicePeriod: '01-05-2021 - 31-05-2021',
    author: 'Roberto Firmino',
  },
]

export const createInvoicePositionsData = (
  invoiceId: number,
): Omit<InvoicePosition, 'id' | 'createdAt'>[] => [
  {
    invoiceId,
    positionName: 'Software developing',
    businessActivityCode: '62.01.Z',
    measurement: 'szt.',
    amount: 1,
    priceNet: 500,
    price: 615,
    vat: 115,
    vatRate: 23,
    totalValueNet: 500,
    totalValue: 615,
    currency: 'PLN',
  },
  {
    invoiceId,
    positionName: 'Software designing',
    businessActivityCode: '62.01.Z',
    measurement: 'szt.',
    amount: 1,
    priceNet: 500,
    price: 615,
    vat: 115,
    vatRate: 23,
    totalValueNet: 500,
    totalValue: 615,
    currency: 'PLN',
  },
]
