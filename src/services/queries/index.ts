import { QUERY_KEYS as SEEKER_QUERY_KEYS, UseGetSeekerMeQuery } from './seekers'
import { QUERY_KEYS as AGENT_QUERY_KEYS, UseGetAgentMeQuery } from './agents'
import { QUERY_KEYS as LANDLORD_QUERY_KEYS, UseGetLandlordMeQuery } from './landlords'

export const QUERY_KEYS = {
  ...SEEKER_QUERY_KEYS,
  ...AGENT_QUERY_KEYS,
  ...LANDLORD_QUERY_KEYS,
} as const

export {
  SEEKER_QUERY_KEYS,
  AGENT_QUERY_KEYS,
  LANDLORD_QUERY_KEYS,
  UseGetSeekerMeQuery,
  UseGetAgentMeQuery,
  UseGetLandlordMeQuery,
}
