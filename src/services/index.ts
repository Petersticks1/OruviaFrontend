import { AgentsService } from './agents.services'
import { LandlordsService } from './landlords.services'
import { SeekersService } from './seekers.services'

export const seekersService = new SeekersService()
export const agentsService = new AgentsService()
export const landlordsService = new LandlordsService()

export { AgentsService, LandlordsService, SeekersService }
export * from './types'

