import {forwardRef, Inject, Injectable} from '@nestjs/common'
import { AccountTable } from './db/account.db'
import { CompanyTable } from './db/company.db'
import { CustomerTable } from './db/customer.db'
import { InvoiceTable } from './db/invoice.db'
import { InvoicePositionsTable } from './db/invoicePositions.db'
import connection from './db/connection'

@Injectable()
export class RepositoryService {
  constructor(
    @Inject(forwardRef(() => AccountTable )) public account: AccountTable,
    @Inject(forwardRef(() => CompanyTable )) public company: CompanyTable,
    @Inject(forwardRef(() => CustomerTable )) public customer: CustomerTable,
    @Inject(forwardRef(() => InvoiceTable )) public invoice: InvoiceTable,
    @Inject(forwardRef(() => InvoicePositionsTable )) public invoicePosition: InvoicePositionsTable,
  ) {}
}

export default RepositoryService
