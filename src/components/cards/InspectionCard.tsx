import { Card } from './Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Inspection, InspectionStatus } from '@/types/domain'

export interface InspectionCardProps {
  inspection: Inspection
  viewerRole?: 'seeker' | 'lister'
  onUpdateStatus?: (inspectionId: string, status: InspectionStatus) => void
  onSelectListing?: (listingId: string) => void
  className?: string
}

export function InspectionCard({
  inspection,
  viewerRole = 'seeker',
  onUpdateStatus,
  onSelectListing,
  className,
}: InspectionCardProps) {
  const formattedDate = new Date(inspection.dateTime).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card variant="outlined" padding="md" className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <img
            src={inspection.listingImage}
            alt={inspection.listingTitle}
            width={88}
            height={72}
            loading="lazy"
            className="h-18 w-22 shrink-0 rounded-[var(--radius-sm)] object-cover cursor-pointer"
            onClick={() => onSelectListing?.(inspection.listingId)}
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={inspection.status} />
              <Badge variant="default" icon={inspection.mode === 'virtual' ? 'video' : 'location'}>
                {inspection.mode === 'virtual' ? 'Live Video Tour' : 'Physical Visit'}
              </Badge>
            </div>
            <h3
              onClick={() => onSelectListing?.(inspection.listingId)}
              className="text-sm font-semibold text-ink-900 hover:text-brand-600 cursor-pointer"
            >
              {inspection.listingTitle}
            </h3>
            <p className="text-xs text-ink-500">{inspection.listingLocation}</p>
            <p className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-ink-700">
              <Icon name="calendar" size={14} />
              <span>{formattedDate}</span>
              <span className="text-ink-300">·</span>
              <span>
                {viewerRole === 'lister'
                  ? `Seeker: ${inspection.seekerName} (${inspection.seekerPhone})`
                  : `With ${inspection.listerName} (${inspection.listerRole})`}
              </span>
            </p>
            {inspection.note ? (
              <p className="text-xs italic text-ink-500">“{inspection.note}”</p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {viewerRole === 'lister' && inspection.status === 'pending' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                leftIcon="check"
                onClick={() => onUpdateStatus?.(inspection.id, 'confirmed')}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon="calendar"
                onClick={() => onUpdateStatus?.(inspection.id, 'rescheduled')}
              >
                Reschedule
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateStatus?.(inspection.id, 'declined')}
              >
                Decline
              </Button>
            </>
          ) : viewerRole === 'seeker' && inspection.status === 'pending' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus?.(inspection.id, 'cancelled')}
            >
              Cancel request
            </Button>
          ) : inspection.status === 'confirmed' && inspection.mode === 'virtual' ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon="video"
              onClick={() => window.open(inspection.meetingLink ?? 'https://meet.google.com', '_blank')}
            >
              Join video inspection
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export function InspectionCardSkeleton() {
  return (
    <Card variant="outlined" padding="md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-1">
          <Skeleton className="h-18 w-22 shrink-0" rounded="sm" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" rounded="pill" />
            <Skeleton className="h-4 w-3/5" rounded="sm" />
            <Skeleton className="h-3 w-2/5" rounded="sm" />
          </div>
        </div>
        <Skeleton className="h-9 w-24" rounded="sm" />
      </div>
    </Card>
  )
}

