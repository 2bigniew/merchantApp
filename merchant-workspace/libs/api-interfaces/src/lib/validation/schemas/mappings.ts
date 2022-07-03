import { accountSchemasToCommandMap, accountSchemasToEventMap } from './accountSchema'
import { companySchemasToCommandMap, companySchemasToEventMap } from './companySchema'
import { customerSchemasToCommandMap, customerSchemasToEventMap } from './customerSchema'
import { invoiceSchemasToCommandMap, invoiceSchemasToEventMap } from './invoiceSchema'
import {
  invoicePositionSchemasToCommandMap,
  invoicePositionSchemasToEventMap,
} from './invoicePositionSchema'
import { SchemasToCommand, SchemasToEvent } from './index'

export const schemasToCommandMap: SchemasToCommand = {
  ...accountSchemasToCommandMap,
  ...companySchemasToCommandMap,
  ...customerSchemasToCommandMap,
  ...invoiceSchemasToCommandMap,
  ...invoicePositionSchemasToCommandMap,
}

export const schemasToEventMap: SchemasToEvent = {
  ...accountSchemasToEventMap,
  ...companySchemasToEventMap,
  ...customerSchemasToEventMap,
  ...invoiceSchemasToEventMap,
  ...invoicePositionSchemasToEventMap,
}
