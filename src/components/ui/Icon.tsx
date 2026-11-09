import { Icon as IconifyIcon, addIcon } from '@iconify/react'
import { ICON_DEFINITIONS, ICON_REGISTRY, type IconName, type OfflineIconDef } from './icons'
import { cn } from '@/lib/cn'

// Pre-bundle all registered icons offline so the app never relies on the Iconify public API at runtime
let iconsRegistered = false
function ensureIconsRegistered(): void {
  if (iconsRegistered) return
  const definitions = Object.values(ICON_DEFINITIONS) as OfflineIconDef[]
  for (const def of definitions) {
    addIcon(def.id, {
      body: def.body,
      width: def.width ?? 24,
      height: def.height ?? 24,
    })
  }
  iconsRegistered = true
}

ensureIconsRegistered()

export interface IconProps {
  name: IconName
  size?: number | string
  className?: string
  'aria-label'?: string
  decorative?: boolean
}

export function Icon({
  name,
  size = 20,
  className,
  'aria-label': ariaLabel,
  decorative = true,
}: IconProps) {
  const iconId = ICON_REGISTRY[name]
  const isDecorative = decorative && !ariaLabel

  return (
    <IconifyIcon
      icon={iconId}
      width={size}
      height={size}
      className={cn('inline-block shrink-0 select-none text-current', className)}
      aria-label={ariaLabel}
      aria-hidden={isDecorative ? 'true' : undefined}
      role={isDecorative ? undefined : 'img'}
    />
  )
}
