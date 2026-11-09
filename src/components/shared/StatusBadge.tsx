import { Badge } from '@/components/ui/Badge'
import { CENTRAL_STATUS_MAP, type StatusTone } from '@/lib/constants'
import type { UnifiedStatus } from '@/types/domain'

export interface StatusBadgeProps {
  status: UnifiedStatus
  className?: string
}

const toneToVariant: Record<
  StatusTone,
  'success' | 'info' | 'warning' | 'danger' | 'default' | 'verified'
> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  neutral: 'default',
  verified: 'verified',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = CENTRAL_STATUS_MAP[status] ?? {
    label: status,
    tone: 'neutral' as const,
  }

  return (
    <Badge
      variant={toneToVariant[config.tone]}
      icon={config.icon}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

