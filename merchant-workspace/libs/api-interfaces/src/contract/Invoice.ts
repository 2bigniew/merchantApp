import { CommandsNames } from "./Command";
import { Changed } from "./Event";
import {Currency} from "./general";
import {InvoicePosition} from "./InvoicePosition";

export interface Invoice {
    id: number
    accountId: number
    customerId: number
    invoiceNumber: string
    priceNet: number
    price: number
    vat: number
    currency: Currency
    invoiceDate: string // TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
    paymentDate: string // TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")
    paymentPeriod?: string
    servicePeriod?: string // when service has been provided
    author?: string
    createdAt: Date
    // status
}


export type PublicInvoice = Invoice & {
    postitions: InvoicePosition[]
}

export type CreateInvoicePayload = Omit<Invoice, 'id' | 'createdAt'>

export type UpdateInvoicePayload = Partial<CreateInvoicePayload> & {
    id: number
}

type InvoiceCommandsName = Extract<CommandsNames, 'command.invoice.create' | 'command.invoice.update' | 'command.invoice.delete'>

export type InvoiceListenerResponse<T>  =  T extends InvoiceCommandsName
    ? Changed<Invoice> 
    : never 