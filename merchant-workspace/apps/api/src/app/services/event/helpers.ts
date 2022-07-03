import { EVENTS_NAMES, EventsNames } from '@merchant-workspace/api-interfaces'
import { COMMANDS_NAMES, CommandsFailuresNames } from '@merchant-workspace/api-interfaces'

export type ListenersCountForEvents = Record<EventsNames | CommandsFailuresNames, number>

export const LISTENERS_COUNT_FOR_EVENTS: Partial<ListenersCountForEvents> = {
  'event.account.created': 1, // add values like that if event have more than one listener
}

export const getListenersCountForEvents = (): Partial<ListenersCountForEvents> => {
  const events: Partial<ListenersCountForEvents> = {}

  for (const event of EVENTS_NAMES) {
    events[event] = 1
  }

  for (const command of COMMANDS_NAMES) {
    const commandFailureName: CommandsFailuresNames = `${command}.failed`
    events[commandFailureName] = 1
  }

  return events
}
