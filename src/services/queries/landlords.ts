import { useQuery } from '@tanstack/react-query'
import { landlordsService } from '../index'
import { useOruviaAppSelector } from '../../Redux/store'

export const QUERY_KEYS = {
  GET_LANDLORD_ME: 'getLandlordMe',
  GET_LANDLORD_KYC: 'getLandlordKyc',
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

export const UseGetLandlordKycQuery = (enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: landlordKycData,
    isLoading: landlordKycIsLoading,
    isFetching: landlordKycIsFetching,
    isError: landlordKycIsError,
    refetch: refetchLandlordKyc,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_LANDLORD_KYC],
    queryFn: async () => await landlordsService.getLandlordKycService(),
    enabled: !!token && enabled,
  })

  return {
    landlordKycData,
    landlordKycIsLoading,
    landlordKycIsFetching,
    landlordKycIsError,
    refetchLandlordKyc,
  }
}
