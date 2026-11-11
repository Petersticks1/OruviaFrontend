import { AgentsService } from './agents.services'
import { LandlordsService } from './landlords.services'
import { ListingsService } from './listings.services'
import { MarketplaceService } from './marketplace.services'
import { SeekersService } from './seekers.services'

export const seekersService = new SeekersService()
export const agentsService = new AgentsService()
export const landlordsService = new LandlordsService()
export const marketplaceService = new MarketplaceService()
export const listingsService = new ListingsService()

export {
  AgentsService,
  LandlordsService,
  ListingsService,
  MarketplaceService,
  SeekersService,
}
export * from './types'
