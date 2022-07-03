import { Module } from '@nestjs/common'
import { RepositoryService } from '../services/repository/repository.service'
import { CustomerController } from './customer.controller'

@Module({
  controllers: [CustomerController],
  providers: [RepositoryService],
})
export class CustomerModule {}
