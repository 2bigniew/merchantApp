import * as Joi from 'joi'
import { currencySchema, dbObjectWrapperSchema, idSchema } from './index'

export const invoiceNumberSchema = Joi.string() // TODO add schema, and configuration type in Settings.ts

export const createInvoiceSchema = Joi.object({
  accountId: idSchema.required(),
  customerId: idSchema.required(),
  invoiceNumber: Joi.string().required(),
  priceNet: Joi.number().positive().precision(2).required(),
  price: Joi.number().positive().precision(2).required(),
  vat: Joi.number().positive().precision(2).required(),
  currency: currencySchema.required(),
  invoiceDate: Joi.date().iso().required(), // TODO shoud be TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
  paymentDate: Joi.date().iso().required(), // TODO shoud be TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
  paymentPeriod: Joi.string(),
  servicePeriod: Joi.string(), // when service has been provided
  author: Joi.string(),
})

export const updateInvoiceSchema = Joi.object({
  id: idSchema.required(),
  accountId: idSchema,
  customerId: idSchema,
  invoiceNumber: Joi.string(),
  priceNet: Joi.number().positive().precision(2),
  price: Joi.number().positive().precision(2),
  vat: Joi.number().positive().precision(2),
  currency: currencySchema,
  invoiceDate: Joi.date().iso(), // TODO shoud be TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
  paymentDate: Joi.date().iso(), // TODO shoud be TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
  paymentPeriod: Joi.string(),
  servicePeriod: Joi.string(), // when service has been provided
  author: Joi.string(),
})

export const deleteInvoiceSchema = Joi.object({ id: idSchema.required() })

export const invoiceSchema = createInvoiceSchema.concat(dbObjectWrapperSchema)

export const invoiceSchemasToCommandMap = {
  'command.invoice.create': createInvoiceSchema,
  'command.invoice.update': updateInvoiceSchema,
  'command.invoice.delete': deleteInvoiceSchema,
}

export const invoiceSchemasToEventMap = {
  'event.invoice.created': { after: invoiceSchema },
  'event.invoice.updated': { before: invoiceSchema, after: invoiceSchema },
  'event.invoice.deleted': { before: invoiceSchema },
}
