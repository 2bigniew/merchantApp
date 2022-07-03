import { Company, CreateCompanyPayload, UpdateCompanyPayload } from '@merchant-workspace/api-interfaces'
import { RepositoryService } from '../services/repository/repository.service'
import { EventService } from '../services/event/event.service'
import { Changed } from '@merchant-workspace/api-interfaces'
import { CommandCompanyCreate, CommandCompanyDelete, CommandCompanyUpdate } from '@merchant-workspace/api-interfaces'

export class CompanyListener {
  constructor(private broker: EventService, private repository: RepositoryService) {
    this.broker.onCommandHandler<CommandCompanyCreate & { type: 'command' }>(
      'command.company.create',
      this.companyCreateHandler,
    )
    this.broker.onCommandHandler<CommandCompanyUpdate & { type: 'command' }>(
      'command.company.update',
      this.companyUpdateHandler,
    )
    this.broker.onCommandHandler<CommandCompanyDelete & { type: 'command' }>(
      'command.company.delete',
      this.deleteCompanyHandler,
    )
  }

  async companyCreateHandler(payload: CreateCompanyPayload): Promise<Changed<Company>> {
    const companyId = await this.repository.company.createCompany(payload)
    const after = await this.repository.company.getCompanyById(companyId)

    if (!after) {
      throw new Error('Created company not found')
    }

    return { after }
  }

  async companyUpdateHandler(payload: UpdateCompanyPayload): Promise<Changed<Company>> {
    const before = await this.repository.company.getCompanyById(payload.id)

    if (!before) {
      throw new Error('Company to update not found')
    }

    const after = await this.repository.company.updateCompany(payload)
    return { before, after }
  }

  async deleteCompanyHandler(payload: { id: number }): Promise<Changed<Company>> {
    const before = await this.repository.company.getCompanyById(payload.id)
    if (!before) {
      throw new Error('Account to delete not found')
    }
    await this.repository.company.deleteCompany(payload.id)
    return { before }
  }
}
