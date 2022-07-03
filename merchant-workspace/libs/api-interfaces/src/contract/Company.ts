import { CommandsNames } from "./Command"
import { Changed } from "./Event"

export interface Company {
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


export type CreateCompanyPayload = Omit<Company, 'id' | 'createdAt'>

export type UpdateCompanyPayload = Partial<CreateCompanyPayload> & { id: number }

type CompanyCommandsName = Extract<CommandsNames, 'command.company.create' | 'command.company.update' | 'command.company.delete'>

export type CompanyListenerResponse<T>  =  T extends CompanyCommandsName
    ? Changed<Company> 
    : never 
