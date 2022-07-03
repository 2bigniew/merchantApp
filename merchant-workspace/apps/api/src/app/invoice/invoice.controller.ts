import { Controller, Get, Param } from '@nestjs/common'
import { Invoice, PublicInvoice } from '@merchant-workspace/api-interfaces'
import { RepositoryService } from '../services/repository/repository.service'

@Controller('/invoice')
export class InvoiceController {
  constructor(private repository: RepositoryService) {}

  @Get('/list')
  getInvoiceList(): Promise<Invoice[]> {
    return this.repository.invoice.getInvoices()
  }

  @Get('/id/:invoiceId')
  async getInvoice(@Param('invoiceId') invoiceId: number): Promise<Invoice | undefined> {
    return this.repository.invoice.getInvoiceById(invoiceId)
  }

  @Get('/public/id/:invoiceId')
  async getPublicInvoice(
    @Param('invoiceId') invoiceId: number,
  ): Promise<PublicInvoice | undefined> {
    const invoice = await this.repository.invoice.getInvoiceById(invoiceId)
    const postitions = await this.repository.invoicePosition.getInvoicePositionsByInvoiceId(
      invoiceId,
    )
    if (invoice) {
      return { ...invoice, postitions }
    }
  }
}
