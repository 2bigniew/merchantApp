import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CustomerModule} from "./customer/customer.module";
import {AccountModule} from "./account/account.module";
import {CompanyModule} from "./company/company.module";
import {InvoiceModule} from "./invoice/invoice.module";
import {InvoicePositionsModule} from "./invoice-positions/invoice-positions.module";
import {SettingsModule} from "./settings/settings.module";
import {CompanyController} from "./company/company.controller";
import {CustomerController} from "./customer/customer.controller";
import {InvoiceController} from "./invoice/invoice.controller";
import {InvoicePositionsController} from "./invoice-positions/invoice-positions.controller";
import {SettingsController} from "./settings/settings.controller";

@Module({
  imports: [
    AccountModule,
    CustomerModule,
    CompanyModule,
    InvoiceModule,
    InvoicePositionsModule,
    SettingsModule,
  ],
  controllers: [
    AppController,
    CompanyController,
    CustomerController,
    InvoiceController,
    InvoicePositionsController,
    SettingsController,
  ],
  providers: [AppService],
})
export class AppModule {}
