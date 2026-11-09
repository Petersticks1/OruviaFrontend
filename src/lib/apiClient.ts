export interface ApiErrorPayload {
  status: number
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors?: Record<string, string[]>

  constructor({ status, code, message, fieldErrors }: ApiErrorPayload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
  retryOnNetworkError?: boolean
}

type UnauthorizedHandler = () => void
type TokenGetter = () => string | null

let onUnauthorized: UnauthorizedHandler | null = null
let getAuthToken: TokenGetter = () => null

export function configureApiClient(options: {
  getToken: TokenGetter
  on401: UnauthorizedHandler
}): void {
  getAuthToken = options.getToken
  onUnauthorized = options.on401
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const baseUrl = (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'https://api.oruvia.ng/v1'
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${normalizedBase}${normalizedPath}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

export async function apiClient<TResponse>(
  path: string,
  config: RequestConfig = {},
): Promise<TResponse> {
  const { body, params, retryOnNetworkError = true, headers, ...rest } = config
  const url = buildUrl(path, params)
  const token = getAuthToken()

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  if (headers) {
    const entries =
      headers instanceof Headers
        ? Array.from(headers.entries())
        : Array.isArray(headers)
          ? headers
          : Object.entries(headers)
    for (const [k, v] of entries) {
      if (typeof v === 'string') {
        requestHeaders[k] = v
      }
    }
  }

  const execute = async (): Promise<Response> =>
    fetch(url, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

  let response: Response
  try {
    response = await execute()
  } catch (err) {
    if (retryOnNetworkError && !rest.signal?.aborted) {
      response = await execute()
    } else {
      throw new ApiError({
        status: 0,
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network error occurred',
      })
    }
  }

  if (response.status === 401) {
    onUnauthorized?.()
  }

  if (!response.ok) {
    let errorBody: Partial<ApiErrorPayload> = {}
    try {
      errorBody = (await response.json()) as Partial<ApiErrorPayload>
    } catch {
      // Ignore non-JSON error body
    }
    throw new ApiError({
      status: response.status,
      code: errorBody.code ?? `HTTP_${response.status}`,
      message: errorBody.message ?? response.statusText ?? 'Request failed',
      fieldErrors: errorBody.fieldErrors,
    })
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

