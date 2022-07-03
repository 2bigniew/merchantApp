import { RepositoryService } from '../services/repository/repository.service'
import { EventService } from '../services/event/event.service'
import { Changed } from '@merchant-workspace/api-interfaces'
import {
  CommandCustomerCreate,
  CommandCustomerDelete,
  CommandCustomerUpdate,
} from '@merchant-workspace/api-interfaces'
import { CreateCustomerPayload, Customer, UpdateCustomerPayload } from '@merchant-workspace/api-interfaces'

export class CustomerListener {
  constructor(private broker: EventService, private repository: RepositoryService) {
    this.broker.onCommandHandler<CommandCustomerCreate & { type: 'command' }>(
      'command.customer.create',
      this.customerCreateHandler,
    )
    this.broker.onCommandHandler<CommandCustomerUpdate & { type: 'command' }>(
      'command.customer.update',
      this.customerUpdateHandler,
    )
    this.broker.onCommandHandler<CommandCustomerDelete & { type: 'command' }>(
      'command.customer.delete',
      this.customerDeleteHandler,
    )
  }

  async customerCreateHandler(payload: CreateCustomerPayload): Promise<Changed<Customer>> {
    const customerId = await this.repository.customer.createCustomer(payload)
    const after = await this.repository.customer.getCustomerById(customerId)

    if (!after) {
      throw new Error('Created customer not found')
    }

    return { after }
  }

  async customerUpdateHandler(payload: UpdateCustomerPayload): Promise<Changed<Customer>> {
    const before = await this.repository.customer.getCustomerById(payload.id)

    if (!before) {
      throw new Error('Customer to update not found')
    }

    const after = await this.repository.customer.updateCustomer(payload)
    return { before, after }
  }

  async customerDeleteHandler(payload: { id: number }): Promise<Changed<Customer>> {
    const before = await this.repository.customer.getCustomerById(payload.id)
    if (!before) {
      throw new Error('Customer to delete not found')
    }
    await this.repository.customer.deleteCustomer(payload.id)
    return { before }
  }
}
