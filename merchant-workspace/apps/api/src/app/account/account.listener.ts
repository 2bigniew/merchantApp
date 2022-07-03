import { Account, CreateAccountPayload, UpdateAccountPayload } from '@merchant-workspace/api-interfaces'
import { CommandAccountCreate, CommandAccountUpdate, CommandAccountDelete } from '@merchant-workspace/api-interfaces'
import { Changed } from '@merchant-workspace/api-interfaces'
import { EventService } from '../services/event/event.service'
import { RepositoryService } from '../services/repository/repository.service'

export class AccountListener {
  constructor(private broker: EventService, private repository: RepositoryService) {
    this.broker.onCommandHandler<CommandAccountCreate & { type: 'command' }>(
      'command.account.create',
      this.accountCreateHandler,
    )
    this.broker.onCommandHandler<CommandAccountUpdate & { type: 'command' }>(
      'command.account.update',
      this.accountUpdateHandler,
    )
    this.broker.onCommandHandler<CommandAccountDelete & { type: 'command' }>(
      'command.account.delete',
      this.accountDeleteHandler,
    )
  }

  private async accountCreateHandler(payload: CreateAccountPayload): Promise<Changed<Account>> {
    const accountId = await this.repository.account.createAccount(payload)
    const after = await this.repository.account.getAccountsById(accountId)
    if (!after) {
      throw new Error('Created account not found')
    }

    return { after }
  }

  private async accountUpdateHandler(payload: UpdateAccountPayload): Promise<Changed<Account>> {
    const before = await this.repository.account.getAccountsById(payload.id)
    if (!before) {
      throw new Error('Account to update not found')
    }
    const after = await this.repository.account.updateAccount(payload)
    return { before, after }
  }

  private async accountDeleteHandler(payload: { id: number }): Promise<Changed<Account>> {
    const before = await this.repository.account.getAccountsById(payload.id)
    if (!before) {
      throw new Error('Account to delete not found')
    }
    await this.repository.account.deleteAccount(payload.id)
    return { before }
  }
}
