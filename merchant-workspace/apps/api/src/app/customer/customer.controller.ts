import { Controller, Get, Param } from '@nestjs/common'
import { Customer } from '@merchant-workspace/api-interfaces'
import { RepositoryService } from '../services/repository/repository.service'

@Controller('/customer')
export class CustomerController {
  constructor(private repository: RepositoryService) {}

  @Get('/list')
  getCustomersList(): Promise<Customer[]> {
    return this.repository.customer.getCustomers()
  }

  @Get('/id/:customerId')
  getCustomer(@Param('customerId') customerId: number): Promise<Customer | undefined> {
    return this.repository.customer.getCustomerById(customerId)
  }
}
