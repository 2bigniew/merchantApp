import { Module } from '@nestjs/common'
import { RepositoryService } from '../services/repository/repository.service'
import { CompanyController } from './company.controller'

@Module({
  controllers: [CompanyController],
  providers: [RepositoryService],
})
export class CompanyModule {}
