import { Badge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'

export interface VerifiedBadgeProps {
  label?: string
  compact?: boolean
  className?: string
}

export function VerifiedBadge({
  label = 'Verified',
  compact = false,
  className,
}: VerifiedBadgeProps) {
  return (
    <Tooltip content="ID verified by Oruvia">
      <Badge
        variant="verified"
        icon="verified"
        className={cn(compact && 'px-2 py-0.5 text-[11px]', className)}
      >
        {label}
      </Badge>
    </Tooltip>
  )
}

