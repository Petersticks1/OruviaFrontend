import { useState } from 'react'
import { Icon } from './Icon'
import { cn } from '@/lib/cn'

export interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  verified?: boolean
  className?: string
}

const sizeMap = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
} as const

function getInitials(name: string): string {
  const parts = name
    .replace(/[().,]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return 'OR'
  if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? 'OR').toUpperCase()
  const first = parts[0]?.[0] ?? 'O'
  const last = parts[parts.length - 1]?.[0] ?? 'R'
  return `${first}${last}`.toUpperCase()
}

export function Avatar({ name, src, size = 'md', verified = false, className }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)

  return (
    <div className={cn('relative inline-flex shrink-0 items-center justify-center', className)}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full bg-ink-900 font-semibold text-surface select-none',
          verified && 'ring-2 ring-verified ring-offset-2 ring-offset-surface',
          sizeMap[size],
        )}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={name}
            width={56}
            height={56}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {verified ? (
        <span
          title="ID verified by Oruvia"
          className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface text-verified shadow-[var(--shadow-card)]"
        >
          <Icon name="verified" size={14} aria-label="Verified" />
        </span>
      ) : null}
    </div>
  )
}

