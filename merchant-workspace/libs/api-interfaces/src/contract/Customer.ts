import { CommandsNames } from "./Command"
import { Changed } from "./Event"

export interface Customer {
    id: number
    accountId: number
    name: string
    street: string
    buldingNumber?: string
    locality?: string
    postalCode: string
    city: string
    country: string
    nip: string
    bankAccount: string
    bankName?: string
    createdAt: Date
}

export type CreateCustomerPayload = Omit<Customer, 'id' | 'createdAt'>

export type UpdateCustomerPayload = Partial<Customer> & { id: number }

type CustomerCommandsName = Extract<CommandsNames, 'command.customer.create' | 'command.customer.update' | 'command.customer.delete'>

export type CustomerListenerResponse<T>  =  T extends CustomerCommandsName
    ? Changed<Customer> 
    : never 

