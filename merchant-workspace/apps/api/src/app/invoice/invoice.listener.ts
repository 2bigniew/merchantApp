import { RepositoryService } from '../services/repository/repository.service'
import { EventService } from '../services/event/event.service'
import { Changed } from '@merchant-workspace/api-interfaces'
import { CommandInvoiceCreate, CommandInvoiceDelete, CommandInvoiceUpdate } from '@merchant-workspace/api-interfaces'
import { CreateInvoicePayload, Invoice, UpdateInvoicePayload } from '@merchant-workspace/api-interfaces'

export class InvoiceListener {
  constructor(private broker: EventService, private repository: RepositoryService) {
    this.broker.onCommandHandler<CommandInvoiceCreate & { type: 'command' }>(
      'command.invoice.create',
      this.invoiceCreateHandler,
    )
    this.broker.onCommandHandler<CommandInvoiceUpdate & { type: 'command' }>(
      'command.invoice.update',
      this.invoiceUpdateHandler,
    )
    this.broker.onCommandHandler<CommandInvoiceDelete & { type: 'command' }>(
      'command.invoice.delete',
      this.invoiceDeleteHandler,
    )
  }

  async invoiceCreateHandler(payload: CreateInvoicePayload): Promise<Changed<Invoice>> {
    const invoiceId = await this.repository.invoice.createInvoice(payload)
    const after = await this.repository.invoice.getInvoiceById(invoiceId)

    if (!after) {
      throw new Error('Created invoice not found')
    }

    return { after }
  }

  async invoiceUpdateHandler(payload: UpdateInvoicePayload): Promise<Changed<Invoice>> {
    const before = await this.repository.invoice.getInvoiceById(payload.id)

    if (!before) {
      throw new Error('Invoice to update not found')
    }

    const after = await this.repository.invoice.updateInvoice(payload)
    return { before, after }
  }

  async invoiceDeleteHandler(payload: { id: number }): Promise<Changed<Invoice>> {
    const before = await this.repository.invoice.getInvoiceById(payload.id)
    if (!before) {
      throw new Error('Invoice to delete not found')
    }
    await this.repository.invoice.deleteInvoice(payload.id)
    return { before }
  }
}
