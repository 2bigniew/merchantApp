import {Account} from "./Account";
import { CommandsNames } from "./Command";
import {Company} from "./Company";
import {Customer} from "./Customer";
import {Invoice} from "./Invoice";
import {InvoicePosition} from "./InvoicePosition";

export const EVENT = 'event' as const

export type Changed<T> = { before?: T, after: T} | { before: T, after?: T}

export const EVENTS_NAMES = [
    'event.account.created',
    'event.account.updated',
    'event.account.deleted',
    'event.company.created',
    'event.company.updated',
    'event.company.deleted',
    'event.customer.created',
    'event.customer.updated',
    'event.customer.deleted',
    'event.invoice.created',
    'event.invoice.updated',
    'event.invoice.deleted',
    'event.invoicePosition.created',
    'event.invoicePosition.updated',
    'event.invoicePosition.deleted',
] as const

export type EventsNames = typeof EVENTS_NAMES[number]

type EventBase<N extends EventsNames, R> = { name: N; response: Changed<R> }

export type EventAccountCreate = EventBase<'event.account.created', Account>

export type EventAccountUpdate = EventBase<'event.account.updated', Account>

export type EventAccountDelete = EventBase<'event.account.deleted', Account>

export type EventCompanyCreate = EventBase<'event.company.created', Company>

export type EventCompanyUpdate = EventBase<'event.company.updated', Company>

export type EventCompanyDelete = EventBase<'event.company.deleted', Company>

export type EventCustomerCreate = EventBase<'event.customer.created', Customer>

export type EventCustomerUpdate = EventBase<'event.customer.updated', Customer>

export type EventCustomerDelete = EventBase<'event.customer.deleted', Customer>

export type EventInvoiceCreate = EventBase<'event.invoice.created', Invoice>

export type EventInvoiceUpdate = EventBase<'event.invoice.updated', Invoice>

export type EventInvoiceDelete = EventBase<'event.invoice.deleted', Invoice>

export type EventInvoicePositionCreate = EventBase<'event.invoicePosition.created', InvoicePosition>

export type EventInvoicePositionUpdate = EventBase<'event.invoicePosition.updated', InvoicePosition>

export type EventInvoicePositionDelete = EventBase<'event.invoicePosition.deleted', InvoicePosition>

export type Event = { type: 'event'} & (
    | EventAccountCreate
    | EventAccountUpdate
    | EventAccountDelete
    | EventCompanyCreate
    | EventCompanyUpdate
    | EventCompanyDelete
    | EventCustomerCreate
    | EventCustomerUpdate
    | EventCustomerDelete
    | EventInvoiceCreate
    | EventInvoiceUpdate
    | EventInvoiceDelete
    | EventInvoicePositionCreate
    | EventInvoicePositionUpdate
    | EventInvoicePositionDelete
    )
