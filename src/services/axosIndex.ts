import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { APISuccessResponse } from './types'
import { logout } from '@/Redux/Reducers/auth'
import store, { persistor } from '@/Redux/store'
import { showErrorToast } from '@/utils/toast'
import { appPath } from '@/config/basename'

// Prioritize absolute URL from .env (if provided), fallback to Vite proxy in development
const BASE_URL = (import.meta.env['VITE_API_URL'] as string | undefined) || '/api/v1'

const getUserToken = (): string | null => {
  return store.getState().auth.token
}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const setAuthorization = (): Record<string, string> => ({
  Authorization: `Bearer ${getUserToken() ?? ''}`,
})

const instance = axios.create({
  baseURL: BASE_URL,
  headers: defaultHeaders,
  timeout: 60000, // Increased to 60s for image uploads
  withCredentials: true, // Changed to true for HttpOnly cookies
})



interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Response interceptor
instance.interceptors.response.use(
  ({ data }: AxiosResponse<APISuccessResponse>): AxiosResponse<APISuccessResponse> => {
    return data as unknown as AxiosResponse<APISuccessResponse>
  },
  (error: AxiosError<Record<string, unknown>>) => {
    if (error.response?.status === 429) {
      showErrorToast('Yoo chill, too many requests...')
    }
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Prevent infinite loops if refresh endpoint itself returns 401
      if (originalRequest.url === '/admin/refresh') {
        store.dispatch(logout())
        void persistor.purge().then(() => {
          window.location.href = appPath('/')
        })
        return Promise.reject(error)
      }

      const token = getUserToken()

      if (!token) {
        // Just fall through if no access token
      } else {
        // Refresh token logic commented out as requested. Now we just expire and log out.
        /*
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers["Authorization"] = "Bearer " + newToken;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          axios
            .post(
              `${BASE_URL}/admin/refresh`,
              {}, // Backend uses HttpOnly cookie 'project_sync_refresh'
              { withCredentials: true }
            )
            .then(({ data }) => {
              // Support multiple payload formats
              const newAccessToken = data?.access_token || data?.accessToken || data?.data?.access_token || data?.payload?.accessToken;
              const newRefreshToken = data?.refresh_token || data?.refreshToken || data?.data?.refresh_token || data?.payload?.refreshToken || store.getState().auth.refreshToken;

              store.dispatch(
                login({
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                  user: store.getState().auth.user,
                })
              );

              originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
              processQueue(null, newAccessToken);
              resolve(instance(originalRequest));
            })
            .catch((err) => {
              processQueue(err, null);
              console.error("Token refresh failed in interceptor:", err.response?.data || err.message);
              showErrorToast("Session expired or refresh failed. Please login again.");
              store.dispatch(logout());
              persistor.purge().then(() => {
                window.location.href = appPath('/');
              });
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
        */

        // Log out immediately on 401 when token expires
        showErrorToast('Session expired. Please login again.')
        store.dispatch(logout())
        void persistor.purge().then(() => {
          window.location.href = appPath('/')
        })
        return Promise.reject(error)
      }
    }

    // Check for network connectivity on Web
    if (!error.response) {
      if (!navigator.onLine) {
        const msg = 'Network error. Please check your internet connection.'
        showErrorToast(msg)
        const friendly = {
          response: { data: { message: msg }, status: null },
          message: msg,
        }
        return Promise.reject(friendly)
      } else {
        // If connected but no response, treat as generic error
        showErrorToast('An Error was encountered...')
        return Promise.reject(error)
      }
    }

    if (error.response) {
      return Promise.reject(error.response.data)
    }

    showErrorToast('An Error was encountered...')
    return Promise.reject(null)
  },
)

// Helper to determine if data is FormData
const isFormData = (data: unknown): data is FormData => {
  return Boolean(data && typeof (data as FormData).append === 'function')
}

// Enhanced request functions
export const unauthorizedRequest = async <T, K>(
  method: 'POST' | 'GET',
  url: string,
  data?: T,
  signal?: AbortSignal,
): Promise<K> => {
  const isForm = isFormData(data)
  const headers: Record<string, string> = isForm ? { 'Content-Type': 'multipart/form-data' } : { ...defaultHeaders }

  const config: AxiosRequestConfig<T> = {
    method,
    url,
    data,
    signal,
    headers,
  }

  const response = (await instance.request(config)) as K
  return response
}

export const authorizedRequest = async <T, K>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: T,
  signal?: AbortSignal,
): Promise<K> => {
  const isForm = isFormData(data)
  const headers: Record<string, string> = {
    ...setAuthorization(),
    ...(isForm ? { 'Content-Type': 'multipart/form-data' } : defaultHeaders),
  }

  const config: AxiosRequestConfig<T> = {
    method,
    url,
    data,
    signal,
    headers,
  }

  const response = (await instance.request(config)) as K

  return response
}

export default instance
