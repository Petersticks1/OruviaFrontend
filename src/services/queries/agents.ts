import { useQuery } from '@tanstack/react-query'
import { agentsService } from '../index'
import { useOruviaAppSelector } from '../../Redux/store'

export const QUERY_KEYS = {
  GET_AGENT_ME: 'getAgentMe',
  GET_AGENT_KYC: 'getAgentKyc',
} as const

export const UseGetAgentMeQuery = (enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: agentMeData,
    isLoading: agentMeIsLoading,
    isFetching: agentMeIsFetching,
    isError: agentMeIsError,
    refetch: refetchAgentMe,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_AGENT_ME],
    queryFn: async () => await agentsService.getAgentMeService(),
    enabled: !!token && enabled,
  })

  return {
    agentMeData,
    agentMeIsLoading,
    agentMeIsFetching,
    agentMeIsError,
    refetchAgentMe,
  }
}

export const UseGetAgentKycQuery = (enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: agentKycData,
    isLoading: agentKycIsLoading,
    isFetching: agentKycIsFetching,
    isError: agentKycIsError,
    refetch: refetchAgentKyc,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_AGENT_KYC],
    queryFn: async () => await agentsService.getAgentKycService(),
    enabled: !!token && enabled,
  })

  return {
    agentKycData,
    agentKycIsLoading,
    agentKycIsFetching,
    agentKycIsError,
    refetchAgentKyc,
  }
}
