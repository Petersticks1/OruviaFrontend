import { store } from '@/store'
import { addToast } from '@/store/slices/uiSlice'

export function showErrorToast(message: string, description?: string): void {
  store.dispatch(
    addToast({
      title: message,
      description,
      tone: 'danger',
    }),
  )
}

export function showSuccessToast(message: string, description?: string): void {
  store.dispatch(
    addToast({
      title: message,
      description,
      tone: 'success',
    }),
  )
}

