import { Controller, Get, Param } from '@nestjs/common'
import { InvoicePosition } from '@merchant-workspace/api-interfaces'
import { RepositoryService } from '../services/repository/repository.service'

@Controller('/invoice-positions')
export class InvoicePositionsController {
  constructor(private repository: RepositoryService) {}

  @Get('/list/:invoiceId')
  getInvoicePositionList(@Param('invoiceId') invoiceId: number): Promise<InvoicePosition[]> {
    return this.repository.invoicePosition.getInvoicePositionsByInvoiceId(invoiceId)
  }

  @Get('/id/:id')
  async getInvoicePositionById(@Param('id') id: number): Promise<InvoicePosition | undefined> {
    return this.repository.invoicePosition.getInvoiceSinglePositionById(id)
  }
}
