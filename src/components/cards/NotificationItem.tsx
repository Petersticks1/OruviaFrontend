import { Card } from './Card'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { formatRelativeDate } from '@/lib/formatters'
import type { Notification, NotificationType } from '@/types/domain'

export interface NotificationItemProps {
  notification: Notification
  onSelect?: (notification: Notification) => void
  className?: string
}

const iconByType: Record<NotificationType, IconName> = {
  inspection_requested: 'calendar',
  inspection_confirmed: 'check',
  inspection_rescheduled: 'clock',
  message_received: 'chat',
  verification_approved: 'verified',
  listing_saved: 'heartFilled',
}

export function NotificationItem({
  notification,
  onSelect,
  className,
}: NotificationItemProps) {
  return (
    <Card
      as="article"
      variant="outlined"
      padding="sm"
      onClick={() => onSelect?.(notification)}
      className={cn(
        'flex items-start justify-between gap-3.5 transition-colors hover:bg-surface-muted cursor-pointer',
        !notification.read && 'border-l-4 border-l-brand-500 bg-brand-50/35',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            notification.read
              ? 'bg-surface-muted text-ink-700'
              : 'bg-brand-50 text-brand-600',
          )}
        >
          <Icon name={iconByType[notification.type]} size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-ink-900">{notification.title}</h3>
          <p className="mt-0.5 text-xs text-ink-700">{notification.body}</p>
          <p className="mt-1 text-[11px] text-ink-500">
            {formatRelativeDate(notification.createdAt)}
          </p>
        </div>
      </div>
      {!notification.read ? (
        <span
          aria-label="Unread"
          className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500"
        />
      ) : null}
    </Card>
  )
}

export function NotificationItemSkeleton() {
  return (
    <Card variant="outlined" padding="sm" className="flex items-start gap-3">
      <Skeleton className="h-9 w-9 shrink-0" rounded="pill" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" rounded="sm" />
        <Skeleton className="h-3 w-full" rounded="sm" />
        <Skeleton className="h-3 w-16" rounded="sm" />
      </div>
    </Card>
  )
}

