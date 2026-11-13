export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const record = error as Record<string, unknown>
    if (
      record['error'] &&
      typeof record['error'] === 'object' &&
      'message' in record['error'] &&
      typeof (record['error'] as Record<string, unknown>)['message'] === 'string'
    ) {
      return (record['error'] as Record<string, string>)['message'] ?? fallback
    }
    if ('message' in record && typeof record['message'] === 'string' && record['message'].trim() !== '') {
      return record['message']
    }
  }
  return fallback
}

export function buildQueryString(params?: object): string {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

