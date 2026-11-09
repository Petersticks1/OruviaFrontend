import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/cn'
import {
  formatCompactNaira,
  formatNaira,
  formatRelativeDate,
} from '@/lib/formatters'

describe('cn utility', () => {
  it('merges conditional classes and resolves Tailwind conflicts', () => {
    const isHidden = Boolean(0)
    expect(cn('px-3 py-2', isHidden && 'hidden', 'px-5')).toBe('py-2 px-5')
  })
})

describe('formatNaira', () => {
  it('formats Nigerian Naira with currency symbol and zero decimals', () => {
    expect(formatNaira(2_500_000)).toBe('₦2,500,000')
    expect(formatNaira(0)).toBe('₦0')
    expect(formatNaira(Number.NaN)).toBe('₦0')
  })
})

describe('formatCompactNaira', () => {
  it('formats millions, thousands, and billions compactly', () => {
    expect(formatCompactNaira(1_200_000)).toBe('₦1.2M')
    expect(formatCompactNaira(3_000_000)).toBe('₦3M')
    expect(formatCompactNaira(450_000)).toBe('₦450K')
    expect(formatCompactNaira(1_500_000_000)).toBe('₦1.5B')
  })
})

describe('formatRelativeDate', () => {
  const baseNow = new Date('2026-11-09T16:00:00Z')

  it('returns "Just now" for < 60 seconds', () => {
    expect(formatRelativeDate('2026-11-09T15:59:30Z', baseNow)).toBe('Just now')
  })

  it('returns minutes, hours, and days ago accurately', () => {
    expect(formatRelativeDate('2026-11-09T15:45:00Z', baseNow)).toBe('15m ago')
    expect(formatRelativeDate('2026-11-09T13:00:00Z', baseNow)).toBe('3h ago')
    expect(formatRelativeDate('2026-11-07T16:00:00Z', baseNow)).toBe('2d ago')
  })
})
