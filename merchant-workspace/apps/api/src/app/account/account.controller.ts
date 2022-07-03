import { Controller, Get, Param } from '@nestjs/common'
import { RepositoryService } from '../services/repository/repository.service'
import {Account} from "@merchant-workspace/api-interfaces";

@Controller('/account')
export class AccountController {
  constructor(private repository: RepositoryService) {}

  @Get('/list')
  getAccountsList(): Promise<Account[]> {
    return this.repository.account.getAccounts()
  }

  @Get('/id/:accountId')
  getAccount(@Param('accountId') accountId: number): Promise<Account | undefined> {
    return this.repository.account.getAccountsById(accountId)
  }
}
