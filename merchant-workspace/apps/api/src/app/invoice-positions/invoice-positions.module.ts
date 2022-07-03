import { Module } from '@nestjs/common'
import { RepositoryService } from '../services/repository/repository.service'
import { InvoicePositionsController } from './invoice-positions.controller'

@Module({
  controllers: [InvoicePositionsController],
  providers: [RepositoryService],
})
export class InvoicePositionsModule {}
