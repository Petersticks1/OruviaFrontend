const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

/**
 * Formats an amount in Nigerian Naira (e.g., ₦2,500,000).
 */
export function formatNaira(amount: number): string {
  if (!Number.isFinite(amount)) {
    return '₦0'
  }
  return nairaFormatter.format(Math.round(amount))
}

/**
 * Formats large Naira values compactly (e.g., ₦1.2M, ₦450K, ₦1.5B).
 */
export function formatCompactNaira(amount: number): string {
  if (!Number.isFinite(amount)) {
    return '₦0'
  }
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs >= 1_000_000_000) {
    const val = (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '')
    return `${sign}₦${val}B`
  }
  if (abs >= 1_000_000) {
    const val = (abs / 1_000_000).toFixed(1).replace(/\.0$/, '')
    return `${sign}₦${val}M`
  }
  if (abs >= 1_000) {
    const val = (abs / 1_000).toFixed(0)
    return `${sign}₦${val}K`
  }
  return `${sign}₦${Math.round(abs)}`
}

/**
 * Formats a date or ISO string relative to `now` (e.g., "Just now", "3h ago", "2d ago").
 */
export function formatRelativeDate(
  dateInput: Date | string | number,
  nowInput: Date | number = Date.now(),
): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const nowMs = nowInput instanceof Date ? nowInput.getTime() : nowInput
  const diffSeconds = Math.round((nowMs - date.getTime()) / 1000)

  if (Number.isNaN(diffSeconds)) {
    return ''
  }
  if (diffSeconds < 60) {
    return 'Just now'
  }
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) {
    return `${diffDays}d ago`
  }
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`
  }
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears}y ago`
}

