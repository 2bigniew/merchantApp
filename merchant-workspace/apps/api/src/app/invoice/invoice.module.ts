import { Module } from '@nestjs/common'
import { RepositoryService } from '../services/repository/repository.service'
import { InvoiceController } from './invoice.controller'

@Module({
  controllers: [InvoiceController],
  providers: [RepositoryService],
})
export class InvoiceModule {}
