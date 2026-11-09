import { Card } from './Card'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { formatRelativeDate } from '@/lib/formatters'
import type { Thread } from '@/types/domain'

export interface ThreadCardProps {
  thread: Thread
  active?: boolean
  onSelect?: (threadId: string) => void
  className?: string
}

export function ThreadCard({ thread, active = false, onSelect, className }: ThreadCardProps) {
  return (
    <Card
      as="article"
      variant={active ? 'elevated' : 'outlined'}
      padding="sm"
      onClick={() => onSelect?.(thread.id)}
      className={cn(
        'flex items-center justify-between gap-3.5 cursor-pointer transition-colors hover:bg-surface-muted',
        active && 'border-ink-900 bg-surface-muted/60',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          name={thread.participantName}
          src={thread.participantAvatar}
          verified={thread.participantVerified}
          size="md"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-ink-900">
              {thread.participantName}
            </h3>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium capitalize text-ink-500">
              {thread.participantRole}
            </span>
          </div>
          <p className="truncate text-xs font-medium text-ink-700">{thread.listingTitle}</p>
          <p
            className={cn(
              'mt-0.5 truncate text-xs',
              thread.unreadCount > 0 ? 'font-semibold text-ink-900' : 'text-ink-500',
            )}
          >
            {thread.lastMessage}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[11px] text-ink-500">
          {formatRelativeDate(thread.lastMessageAt)}
        </span>
        {thread.unreadCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-surface">
            {thread.unreadCount}
          </span>
        ) : null}
      </div>
    </Card>
  )
}

export function ThreadCardSkeleton() {
  return (
    <Card variant="outlined" padding="sm" className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="h-11 w-11 shrink-0" rounded="pill" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-36" rounded="sm" />
          <Skeleton className="h-3 w-48" rounded="sm" />
          <Skeleton className="h-3 w-60" rounded="sm" />
        </div>
      </div>
      <Skeleton className="h-3 w-12" rounded="sm" />
    </Card>
  )
}

