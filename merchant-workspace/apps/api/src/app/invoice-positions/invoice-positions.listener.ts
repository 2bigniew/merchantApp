import { RepositoryService } from '../services/repository/repository.service'
import { EventService } from '../services/event/event.service'
import { Changed } from '@merchant-workspace/api-interfaces'
import {
  CommandInvoicePositionCreate,
  CommandInvoicePositionDelete,
  CommandInvoicePositionUpdate,
} from '@merchant-workspace/api-interfaces'
import {
  CreateInvoicePositionPayload,
  InvoicePosition,
  UpdateInvoicePositionPayload,
} from '@merchant-workspace/api-interfaces'

export class InvoicePositionListener {
  constructor(private broker: EventService, private repository: RepositoryService) {
    this.broker.onCommandHandler<CommandInvoicePositionCreate & { type: 'command' }>(
      'command.invoicePosition.create',
      this.invoicePositionCreateHandler,
    )
    this.broker.onCommandHandler<CommandInvoicePositionUpdate & { type: 'command' }>(
      'command.invoicePosition.update',
      this.invoicePositionUpdateHandler,
    )
    this.broker.onCommandHandler<CommandInvoicePositionDelete & { type: 'command' }>(
      'command.invoicePosition.delete',
      this.invoicePositionDeleteHandler,
    )
  }

  async invoicePositionCreateHandler(
    payload: CreateInvoicePositionPayload,
  ): Promise<Changed<InvoicePosition>> {
    const id = await this.repository.invoicePosition.createInvoicePosition(payload)
    const after = await this.repository.invoicePosition.getInvoiceSinglePositionById(id)

    if (!after) {
      throw new Error('Created invoice position not found')
    }

    return { after }
  }

  async invoicePositionUpdateHandler(
    payload: UpdateInvoicePositionPayload,
  ): Promise<Changed<InvoicePosition>> {
    const before = await this.repository.invoicePosition.getInvoiceSinglePositionById(payload.id)

    if (!before) {
      throw new Error('Invoice position to update not found')
    }

    const after = await this.repository.invoicePosition.updateInvoicePosition(payload)
    return { before, after }
  }

  async invoicePositionDeleteHandler(payload: { id: number }): Promise<Changed<InvoicePosition>> {
    const before = await this.repository.invoicePosition.getInvoiceSinglePositionById(payload.id)
    if (!before) {
      throw new Error('Invoice position to delete not found')
    }
    await this.repository.invoicePosition.deleteInvoicePostition(payload.id)
    return { before }
  }
}
