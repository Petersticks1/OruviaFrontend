import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { performFullLogout } from '@/utils/logout'

export const persistor = {
  purge: async (): Promise<void> => {
    performFullLogout()
  },
}

export { store, useAppDispatch, useAppSelector }
export const useOruviaAppSelector = useAppSelector
export const useOruviaAppDispatch = useAppDispatch
export default store
