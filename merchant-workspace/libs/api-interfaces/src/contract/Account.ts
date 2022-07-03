import { CommandsNames } from './Command'
import { Changed } from './Event'

export interface Account {
    id: number
    firstname: string
    lastname: string
    email: string
    password: string
    createdAt: Date
}

export type CreateAccountPayload = {
    firstname: string
    lastname: string
    password: string
    email: string
}

export type UpdateAccountPayload = Partial<CreateAccountPayload> & { id: number }

export interface AccountRouter {
    'account/list': {
        response: Account[]
    }
}

type AccountCommandsName = Extract<CommandsNames, 'command.account.create' | 'command.account.update' | 'command.account.delete'>

export type AccountListenerResponse<T>  =  T extends AccountCommandsName
    ? Changed<Account> 
    : never 

