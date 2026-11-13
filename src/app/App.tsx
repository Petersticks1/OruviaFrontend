import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { Provider as ReduxProvider } from 'react-redux'
import { queryClient } from '@/app/queryClient'
import { configureApiClient } from '@/lib/apiClient'
import { router } from '@/routes/router'
import { store } from '@/store'
import { performFullLogout } from '@/utils/logout'

export { queryClient }

configureApiClient({
  getToken: () => store.getState().auth.token,
  on401: () => {
    performFullLogout()
  },
})

export function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ReduxProvider>
  )
}

