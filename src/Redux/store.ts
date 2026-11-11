import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export const persistor = {
  purge: async (): Promise<void> => {
    try {
      localStorage.removeItem('persist:root')
    } catch {
      // Ignore storage access errors
    }
  },
}

export { store, useAppDispatch, useAppSelector }
export const useOruviaAppSelector = useAppSelector
export const useOruviaAppDispatch = useAppDispatch
export default store
