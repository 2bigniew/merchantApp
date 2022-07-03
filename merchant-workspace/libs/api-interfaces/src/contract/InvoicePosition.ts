import { CommandsNames } from "./Command";
import { Changed } from "./Event";
import {Currency} from "./general";

export interface InvoicePosition {
    id: number
    invoiceId: number
    positionName: string
    businessActivityCode?: string
    measurement: string
    amount: number
    priceNet: number
    price: number
    vat: number
    vatRate: number
    totalValueNet: number
    totalValue: number
    currency: Currency
    createdAt: Date
}

export type CreateInvoicePositionPayload = Omit<InvoicePosition, 'id' | 'createdAt'>

export type UpdateInvoicePositionPayload = Partial<CreateInvoicePositionPayload> & { id: number }

type InvoicePositionCommandsName = Extract<CommandsNames, 'command.invoicePosition.create' | 'command.invoicePosition.update' | 'command.invoicePosition.delete'>

export type InvoicePositionListenerResponse<T>  =  T extends InvoicePositionCommandsName
    ? Changed<InvoicePosition> 
    : never 