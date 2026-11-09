import { Card } from './Card'
import { RatingSummary } from '@/components/shared/RatingSummary'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import type { UserProfile } from '@/types/domain'

export interface ListerCardProps {
  lister: UserProfile
  onContact?: () => void
  onViewProfile?: (userId: string) => void
  onWhatsApp?: () => void
  className?: string
}

export function ListerCard({
  lister,
  onContact,
  onViewProfile,
  onWhatsApp,
  className,
}: ListerCardProps) {
  return (
    <Card variant="elevated" padding="lg" className={className}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar
            name={lister.name}
            src={lister.avatarUrl}
            verified={lister.verified}
            size="lg"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-ink-900">{lister.name}</h3>
              {lister.verified ? <VerifiedBadge compact /> : null}
            </div>
            <p className="text-xs font-medium capitalize text-ink-500">
              {lister.role === 'landlord'
                ? 'Verified Property Owner (Direct Landlord)'
                : lister.agencyName ?? 'Verified Real Estate Agent'}
            </p>
            <RatingSummary rating={lister.rating} reviewCount={lister.reviewCount} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[var(--radius-sm)] bg-surface-muted px-4 py-2.5 text-center">
          <div>
            <p className="text-sm font-bold text-ink-900">{lister.listingsCount}</p>
            <p className="text-[11px] text-ink-500">Listings</p>
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">{lister.responseRate}%</p>
            <p className="text-[11px] text-ink-500">Response</p>
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">{lister.rating.toFixed(1)}</p>
            <p className="text-[11px] text-ink-500">Rating</p>
          </div>
        </div>
      </div>

      {lister.bio ? (
        <p className="mt-4 text-sm leading-relaxed text-ink-700">{lister.bio}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-ink-500">
          Typically responds <span className="font-semibold text-ink-900">{lister.responseTime}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {onViewProfile ? (
            <Button variant="outline" size="sm" onClick={() => onViewProfile(lister.id)}>
              View profile
            </Button>
          ) : null}
          {onContact ? (
            <Button variant="secondary" size="sm" leftIcon="chat" onClick={onContact}>
              Message in-app
            </Button>
          ) : null}
          {onWhatsApp ? (
            <Button variant="ghost" size="sm" leftIcon="whatsapp" onClick={onWhatsApp}>
              WhatsApp
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export function ListerCardSkeleton() {
  return (
    <Card variant="outlined" padding="lg" className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 shrink-0" rounded="pill" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-44" rounded="sm" />
          <Skeleton className="h-3 w-32" rounded="sm" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" rounded="sm" />
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-28" rounded="sm" />
        <Skeleton className="h-9 w-28" rounded="sm" />
      </div>
    </Card>
  )
}

