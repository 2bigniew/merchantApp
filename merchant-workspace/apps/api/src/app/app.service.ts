import { Injectable } from '@nestjs/common';
import { Message } from '@merchant-workspace/api-interfaces';
import { AccountListener } from './account/account.listener';
import {CompanyListener} from "./company/company.listener";
import {CustomerListener} from "./customer/customer.listener";
import {InvoiceListener} from "./invoice/invoice.listener";
import {InvoicePositionListener} from "./invoice-positions/invoice-positions.listener";
import EventService from "./services/event/event.service";
import RepositoryService from "./services/repository/repository.service";

type Listeners = {
  accountListener: AccountListener
  companyListener: CompanyListener
  customerListener: CustomerListener
  invoiceListener: InvoiceListener
  invoicePositionListener: InvoicePositionListener
}

@Injectable()
export class AppService {
  private listeners: Listeners

  constructor() {
    this.listeners = runListeners()
  }

  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}

const runListeners = (): Listeners => ({
  accountListener: new AccountListener(EventService, RepositoryService),
  companyListener: new CompanyListener(EventService, RepositoryService),
  customerListener: new CustomerListener(EventService, RepositoryService),
  invoiceListener: new InvoiceListener(EventService, RepositoryService),
  invoicePositionListener: new InvoicePositionListener(EventService, RepositoryService),
})
