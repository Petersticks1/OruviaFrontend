import { useQuery } from '@tanstack/react-query'
import { landlordsService } from '../index'
import { useOruviaAppSelector } from '../../Redux/store'

export const QUERY_KEYS = {
  GET_LANDLORD_ME: 'getLandlordMe',
} as const

export const UseGetLandlordMeQuery = (enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: landlordMeData,
    isLoading: landlordMeIsLoading,
    isFetching: landlordMeIsFetching,
    isError: landlordMeIsError,
    refetch: refetchLandlordMe,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_LANDLORD_ME],
    queryFn: async () => await landlordsService.getLandlordMeService(),
    enabled: !!token && enabled,
  })

  return {
    landlordMeData,
    landlordMeIsLoading,
    landlordMeIsFetching,
    landlordMeIsError,
    refetchLandlordMe,
  }
}

