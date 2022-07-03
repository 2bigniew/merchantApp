import { Module } from '@nestjs/common'
import { AccountController } from './account.controller'
import { RepositoryService } from '../services/repository/repository.service'

@Module({
  controllers: [AccountController],
  providers: [RepositoryService],
})
export class AccountModule {}
