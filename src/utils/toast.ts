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

export function showOruviaToast(
  type: 'success' | 'error' | 'info',
  message: string,
  description?: string,
): void {
  store.dispatch(
    addToast({
      title: message,
      description,
      tone: type === 'error' ? 'danger' : type,
    }),
  )
}
