import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { Provider as ReduxProvider } from 'react-redux'
import { configureApiClient } from '@/lib/apiClient'
import { router } from '@/routes/router'
import { store } from '@/store'
import { logout } from '@/store/slices/authSlice'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

configureApiClient({
  getToken: () => store.getState().auth.token,
  on401: () => {
    store.dispatch(logout())
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

