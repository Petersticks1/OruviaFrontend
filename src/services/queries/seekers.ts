import { useQuery } from '@tanstack/react-query'
import { seekersService } from '../index'
import { useOruviaAppSelector } from '../../Redux/store'

export const QUERY_KEYS = {
  GET_SEEKER_ME: 'getSeekerMe',
} as const

export const UseGetSeekerMeQuery = (enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: seekerMeData,
    isLoading: seekerMeIsLoading,
    isFetching: seekerMeIsFetching,
    isError: seekerMeIsError,
    refetch: refetchSeekerMe,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_SEEKER_ME],
    queryFn: async () => await seekersService.getSeekerMeService(),
    enabled: !!token && enabled,
  })

  return {
    seekerMeData,
    seekerMeIsLoading,
    seekerMeIsFetching,
    seekerMeIsError,
    refetchSeekerMe,
  }
}

