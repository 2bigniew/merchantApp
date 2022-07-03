import { Test, TestingModule } from '@nestjs/testing'
import { InvoicePositionsController } from './invoice-positions.controller'

describe('InvoicePositionsController', () => {
  let controller: InvoicePositionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicePositionsController],
    }).compile()

    controller = module.get<InvoicePositionsController>(InvoicePositionsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
