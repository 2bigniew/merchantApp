import * as Joi from 'joi'
import { COMMAND, Command, CommandsNames } from '../../contract/Command'
import { EVENT, Event, EventsNames } from '../../contract/Event'
import { schemasToCommandMap, schemasToEventMap } from './schemas/mappings'
import * as account from './schemas/accountSchema'
import * as company from './schemas/companySchema'
import * as customer from './schemas/customerSchema'
import * as invoice from './schemas/invoiceSchema'
import * as invoicePosition from './schemas/invoicePositionSchema'
import * as mappings from './schemas/mappings'
import * as main from './schemas'

export const schemas = {
  account,
  company,
  customer,
  invoice,
  invoicePosition,
  mappings,
  main,
}

export const validateSchema = <T>(
  payload: T,
  schema: Joi.Schema | Record<keyof Required<T>, Joi.Schema>,
) => { // TODO add returned type | error
  const validation = Joi.compile(schema).validate(payload)
  if (validation.error) {
    console.error(validation.error) // TODO add logger and failure handler
  }
  return validation.value
}

export const validateCommand = (commandName: CommandsNames, data: any): Command => {
  const payload = validateSchema(data, schemasToCommandMap[commandName])
  return {
    type: COMMAND,
    name: commandName,
    payload,
  }
}

export const validateEvent = (eventName: EventsNames, data: any): Event => {
  const response = validateSchema(data, schemasToEventMap[eventName])
  return {
    type: EVENT,
    name: eventName,
    response,
  }
}
