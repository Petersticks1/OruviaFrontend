import { store } from '@/store'

export const persistor = {
  purge: async (): Promise<void> => {
    try {
      localStorage.removeItem('persist:root')
    } catch {
      // Ignore storage access errors
    }
  },
}

export { store }
export default store

