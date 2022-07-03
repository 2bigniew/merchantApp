import * as Joi from 'joi'
import { CommandsNames, COMMANDS_NAMES } from '@merchant-workspace/api-interfaces'
import { CURRENCY_VALUES } from '@merchant-workspace/api-interfaces'
import {EVENTS_NAMES, EventsNames} from "@merchant-workspace/api-interfaces";

export type SchemasToCommand = Record<CommandsNames, Joi.Schema>

export type SchemasToEvent = Record<EventsNames, { before?: Joi.Schema; after?: Joi.Schema }>

export const idSchema = Joi.number().positive().integer()

export const currencySchema = Joi.string().valid(...CURRENCY_VALUES)

export const dbObjectWrapperSchema = Joi.object({
  id: idSchema.required(),
  createdAt: Joi.string().required(),
})

export const commandTypeSchema = Joi.string()
  .valid(...COMMANDS_NAMES)
  .required()

export const eventTypeSchema = Joi.string()
  .valid(...EVENTS_NAMES)
  .required()
