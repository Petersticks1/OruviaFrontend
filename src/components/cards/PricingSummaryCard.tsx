import { useState } from 'react'
import { Card } from './Card'
import { PriceTag } from '@/components/shared/PriceTag'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Rating } from '@/components/ui/Rating'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { formatNaira } from '@/lib/formatters'
import type { InspectionMode, Listing } from '@/types/domain'

export interface PricingSummaryCardProps {
  listing: Listing
  onRequestInspection?: (payload: {
    mode: InspectionMode
    dateTime: string
    note: string
  }) => void
  onInquire?: () => void
  onReport?: () => void
  className?: string
}

export function PricingSummaryCard({
  listing,
  onRequestInspection,
  onInquire,
  onReport,
  className,
}: PricingSummaryCardProps) {
  const [mode, setMode] = useState<InspectionMode>('physical')
  const [dateTime, setDateTime] = useState('2026-11-14T11:00')
  const [note, setNote] = useState('')

  const serviceCharge = listing.serviceCharge ?? 0
  const cautionFee = listing.cautionFee ?? 0
  const agencyFee =
    listing.agencyFeePercent !== undefined
      ? Math.round((listing.price * listing.agencyFeePercent) / 100)
      : 0
  const totalMoveIn = listing.price + serviceCharge + cautionFee + agencyFee

  return (
    <Card
      variant="elevated"
      padding="lg"
      className={cn('sticky top-28 space-y-4 border-line', className)}
    >
      <div className="flex items-baseline justify-between gap-2">
        <PriceTag amount={listing.price} period={listing.pricePeriod} size="lg" />
        <Rating value={listing.rating} reviewCount={listing.reviewCount} />
      </div>

      {listing.verified ? (
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-surface-muted px-3 py-2 text-xs text-ink-700">
          <VerifiedBadge compact />
          <span>Title & landlord ID verified by Oruvia</span>
        </div>
      ) : null}

      {/* Inspection Mode Selector */}
      <div className="rounded-[var(--radius-sm)] border border-line overflow-hidden">
        <div className="grid grid-cols-2 border-b border-line bg-surface-muted p-1 gap-1">
          <button
            type="button"
            onClick={() => setMode('physical')}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-[6px] py-2 text-xs font-semibold transition-colors cursor-pointer',
              mode === 'physical'
                ? 'bg-surface text-ink-900 shadow-[var(--shadow-card)]'
                : 'text-ink-500 hover:text-ink-900',
            )}
          >
            <Icon name="location" size={15} />
            <span>Physical Visit</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('virtual')}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-[6px] py-2 text-xs font-semibold transition-colors cursor-pointer',
              mode === 'virtual'
                ? 'bg-surface text-ink-900 shadow-[var(--shadow-card)]'
                : 'text-ink-500 hover:text-ink-900',
            )}
          >
            <Icon name="video" size={15} />
            <span>Live Video Tour</span>
          </button>
        </div>

        <div className="p-3 space-y-2.5">
          <div>
            <label
              htmlFor={`inspection-dt-${listing.id}`}
              className="block text-[11px] font-bold uppercase tracking-wider text-ink-700"
            >
              Preferred Date & Time
            </label>
            <Input
              id={`inspection-dt-${listing.id}`}
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="mt-1 h-9 text-xs"
            />
          </div>
          <div>
            <label
              htmlFor={`inspection-note-${listing.id}`}
              className="block text-[11px] font-bold uppercase tracking-wider text-ink-700"
            >
              Note for {listing.lister.role} (optional)
            </label>
            <Input
              id={`inspection-note-${listing.id}`}
              type="text"
              placeholder="e.g. Moving in next month, checking water pressure"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        leftIcon="calendar"
        onClick={() => onRequestInspection?.({ mode, dateTime, note })}
      >
        Request inspection
      </Button>

      <Button
        variant="secondary"
        size="md"
        fullWidth
        leftIcon="chat"
        onClick={onInquire}
      >
        Ask {listing.lister.name.split(' ')[0]} a question
      </Button>

      <p className="text-center text-xs text-ink-500">
        Free inspection request · Pay nothing until tenancy agreement
      </p>

      <Divider />

      {/* Transparent Nigerian Rent/Sale Fee Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-ink-700">
          <span className="underline decoration-line underline-offset-2">
            {listing.type === 'rent' ? 'Annual base rent' : 'Outright sale price'}
          </span>
          <span>{formatNaira(listing.price)}</span>
        </div>
        {serviceCharge > 0 ? (
          <div className="flex justify-between text-ink-700">
            <span className="underline decoration-line underline-offset-2">
              Estate service charge
            </span>
            <span>{formatNaira(serviceCharge)}</span>
          </div>
        ) : null}
        {cautionFee > 0 ? (
          <div className="flex justify-between text-ink-700">
            <span className="underline decoration-line underline-offset-2">
              Refundable caution deposit
            </span>
            <span>{formatNaira(cautionFee)}</span>
          </div>
        ) : null}
        {agencyFee > 0 ? (
          <div className="flex justify-between text-ink-700">
            <span className="underline decoration-line underline-offset-2">
              Agency & agreement ({listing.agencyFeePercent}%)
            </span>
            <span>{formatNaira(agencyFee)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-success font-medium">
            <span>Direct landlord (Agency fee)</span>
            <span>₦0</span>
          </div>
        )}
        <Divider />
        <div className="flex justify-between text-base font-bold text-ink-900">
          <span>Total estimated move-in</span>
          <span>{formatNaira(totalMoveIn)}</span>
        </div>
      </div>

      {onReport ? (
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onReport}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 underline hover:text-ink-900 cursor-pointer"
          >
            <Icon name="report" size={14} />
            <span>Report this listing</span>
          </button>
        </div>
      ) : null}
    </Card>
  )
}

export function PricingSummaryCardSkeleton() {
  return (
    <Card variant="outlined" padding="lg" className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-7 w-36" rounded="sm" />
        <Skeleton className="h-5 w-16" rounded="sm" />
      </div>
      <Skeleton className="h-32 w-full" rounded="sm" />
      <Skeleton className="h-12 w-full" rounded="sm" />
      <Skeleton className="h-10 w-full" rounded="sm" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" rounded="sm" />
        <Skeleton className="h-4 w-full" rounded="sm" />
        <Skeleton className="h-5 w-full" rounded="sm" />
      </div>
    </Card>
  )
}

