import * as Joi from 'joi'
import { currencySchema, dbObjectWrapperSchema, idSchema } from './index'

export const createInvoicePositionSchema = Joi.object({
  invoiceId: idSchema.required(),
  positionName: Joi.string().required(),
  businessActivityCode: Joi.string(),
  measurement: Joi.string().min(1).max(5).required(),
  amount: Joi.number().integer().required(),
  priceNet: Joi.number().integer().required(),
  price: Joi.number().integer().required(),
  vat: Joi.number().integer().required(),
  vatRate: Joi.number().integer().required(),
  totalValueNet: Joi.number().integer().required(),
  totalValue: Joi.number().integer().required(),
  currency: currencySchema.required(),
}).required()

export const updateInvoicePositionSchema = Joi.object({
  id: idSchema.required(),
  invoiceId: idSchema,
  positionName: Joi.string(),
  businessActivityCode: Joi.string(),
  measurement: Joi.string().min(1).max(5),
  amount: Joi.number().integer(),
  priceNet: Joi.number().integer(),
  price: Joi.number().integer(),
  vat: Joi.number().integer(),
  vatRate: Joi.number().integer(),
  totalValueNet: Joi.number().integer(),
  totalValue: Joi.number().integer(),
  currency: currencySchema,
}).required()

export const deleteInvoicePositionSchema = Joi.object({
  id: idSchema.required(),
})

export const invoicePositionSchema = createInvoicePositionSchema.concat(dbObjectWrapperSchema)

export const invoicePositionSchemasToCommandMap = {
  'command.invoicePosition.create': createInvoicePositionSchema,
  'command.invoicePosition.update': updateInvoicePositionSchema,
  'command.invoicePosition.delete': deleteInvoicePositionSchema,
}

export const invoicePositionSchemasToEventMap = {
  'event.invoicePosition.created': { after: invoicePositionSchema },
  'event.invoicePosition.updated': { before: invoicePositionSchema, after: invoicePositionSchema },
  'event.invoicePosition.deleted': { before: invoicePositionSchema },
}
