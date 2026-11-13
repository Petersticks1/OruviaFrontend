import { type ReactNode, useState } from 'react'
import { Card } from './Card'
import { PriceTag } from '@/components/shared/PriceTag'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { Rating } from '@/components/ui/Rating'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import type { Listing } from '@/types/domain'

export interface PropertyCardProps {
  listing: Listing
  variant?: 'vertical' | 'horizontal' | 'compact'
  isSaved?: boolean
  onToggleSave?: (listingId: string) => void
  onSelect?: (listingId: string) => void
  badgeSlot?: ReactNode
  className?: string
}

const VERIFICATION_BADGE_LABELS: Record<string, string> = {
  licensed_agent: 'Licensed Agent',
  verified_agent: 'Verified Agent',
  verified_owner: 'Verified Owner',
  verified_landlord: 'Verified Landlord',
}

export function PropertyCard({
  listing,
  variant = 'vertical',
  isSaved = false,
  onToggleSave,
  onSelect,
  badgeSlot,
  className,
}: PropertyCardProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [popping, setPopping] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const images =
    listing.images.length > 0
      ? listing.images
      : [
          {
            id: 'fallback',
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
            alt: listing.title,
          },
        ]

  const currentImage = images[activeIdx] ?? images[0]
  const verifiedLabel =
    (listing.lister.verificationBadge &&
      VERIFICATION_BADGE_LABELS[listing.lister.verificationBadge]) ||
    'Verified'

  const specsSummary =
    listing.beds > 0
      ? `${listing.beds} ${listing.beds === 1 ? 'bed' : 'beds'} · ${listing.baths} ${listing.baths === 1 ? 'bath' : 'baths'}${listing.areaSqm > 0 ? ` · ${listing.areaSqm} sqm` : ''}`
      : `${listing.areaSqm > 0 ? `${listing.areaSqm} sqm · ` : ''}${listing.propertyTypeName ?? (listing.lister.role === 'landlord' ? 'Direct Landlord' : 'Verified Agent')}`

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setPopping(true)
    setTimeout(() => setPopping(false), 260)
    onToggleSave?.(listing.id)
  }

  if (variant === 'compact') {
    return (
      <Card
        as="article"
        variant="interactive"
        padding="sm"
        onClick={() => onSelect?.(listing.slug || listing.id)}
        className={cn('flex items-center gap-3.5', className)}
      >
        <img
          src={currentImage?.url}
          alt={currentImage?.alt ?? listing.title}
          width={96}
          height={80}
          loading="lazy"
          className="h-20 w-24 shrink-0 rounded-[var(--radius-sm)] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-ink-900">{listing.title}</p>
            {listing.verified ? <VerifiedBadge compact label="Verified" /> : null}
          </div>
          <p className="truncate text-xs text-ink-500">{listing.location}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <PriceTag
              amount={listing.price}
              period={listing.pricePeriod}
              compact
              size="sm"
            />
            <span className="text-xs text-ink-500">
              {listing.beds > 0
                ? `${listing.beds} bd · ${listing.baths} ba`
                : listing.propertyTypeName ?? 'Property'}
            </span>
          </div>
        </div>
      </Card>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Card
        as="article"
        variant="interactive"
        padding="none"
        onClick={() => onSelect?.(listing.slug || listing.id)}
        className={cn('group flex flex-col sm:flex-row', className)}
      >
        <Card.Media className="relative aspect-[4/3] w-full sm:w-64 shrink-0">
          <img
            src={currentImage?.url}
            alt={currentImage?.alt ?? listing.title}
            width={400}
            height={300}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {listing.verified ? <VerifiedBadge compact label={verifiedLabel} /> : null}
            {badgeSlot}
          </div>
          <button
            type="button"
            aria-label={isSaved ? 'Remove from saved listings' : 'Save listing'}
            aria-pressed={isSaved}
            onClick={handleHeartClick}
            className={cn(
              'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer',
              isSaved ? 'text-brand-500' : 'text-ink-900',
              popping && 'animate-heart-pop',
            )}
          >
            <Icon name={isSaved ? 'heartFilled' : 'heart'} size={18} />
          </button>
        </Card.Media>
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {listing.neighbourhood}, {listing.city} · For {listing.type}
                </p>
                <h3 className="mt-0.5 text-base font-semibold text-ink-900 group-hover:text-brand-600 transition-colors">
                  {listing.title}
                </h3>
              </div>
              {listing.rating > 0 ? (
                <Rating value={listing.rating} reviewCount={listing.reviewCount} />
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-ink-500">{listing.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-700">
              {listing.beds > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Icon name="bed" size={15} /> {listing.beds} Beds
                </span>
              ) : null}
              {listing.baths > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Icon name="bath" size={15} /> {listing.baths} Baths
                </span>
              ) : null}
              {listing.areaSqm > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Icon name="area" size={15} /> {listing.areaSqm} sqm
                </span>
              ) : null}
              {listing.videoTourUrl ? (
                <Badge variant="surface" icon="video">
                  Virtual tour
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <PriceTag amount={listing.price} period={listing.pricePeriod} />
            <span className="text-xs font-semibold text-brand-600">View details →</span>
          </div>
        </div>
      </Card>
    )
  }

  // Default Airbnb-style vertical card
  return (
    <Card
      as="article"
      variant="flat"
      padding="none"
      onClick={() => onSelect?.(listing.slug || listing.id)}
      className={cn('group bg-transparent cursor-pointer', className)}
    >
      <Card.Media
        onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return
          const delta = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
          if (Math.abs(delta) > 40) {
            if (delta < 0) {
              setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
            } else {
              setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
            }
          }
          setTouchStartX(null)
        }}
        className="relative aspect-[4/3] w-full rounded-[var(--radius-md)] bg-surface-muted overflow-hidden"
      >
        <img
          src={currentImage?.url}
          alt={currentImage?.alt ?? listing.title}
          width={480}
          height={360}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />

        {/* Top-left Verified / Type badge */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {listing.verified ? <VerifiedBadge compact label={verifiedLabel} /> : null}
          {listing.videoTourUrl ? (
            <Badge variant="surface" icon="video" className="px-2 py-0.5 text-[11px]">
              Virtual tour
            </Badge>
          ) : null}
          {badgeSlot}
        </div>

        {/* Top-right Heart button */}
        <button
          type="button"
          aria-label={isSaved ? 'Remove from saved listings' : 'Save to wishlist'}
          aria-pressed={isSaved}
          onClick={handleHeartClick}
          className={cn(
            'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform duration-150 hover:scale-110 active:scale-95 cursor-pointer',
            isSaved ? 'text-brand-500' : 'text-ink-900',
            popping && 'animate-heart-pop',
          )}
        >
          <Icon name={isSaved ? 'heartFilled' : 'heart'} size={18} />
        </button>

        {/* Prev / Next Carousel Controls on Hover */}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink-900 opacity-0 shadow-[var(--shadow-card)] transition-opacity duration-150 group-hover:opacity-100 hover:scale-105 cursor-pointer"
            >
              <Icon name="chevronLeft" size={16} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink-900 opacity-0 shadow-[var(--shadow-card)] transition-opacity duration-150 group-hover:opacity-100 hover:scale-105 cursor-pointer"
            >
              <Icon name="chevronRight" size={16} />
            </button>

            {/* Dot indicators */}
            <div
              className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink-900/35 px-2 py-1 backdrop-blur-[2px]"
              aria-label={`Photo ${activeIdx + 1} of ${images.length}`}
            >
              {images.map((img, idx) => (
                <span
                  key={img.id}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-150',
                    idx === activeIdx ? 'w-3 bg-surface' : 'w-1.5 bg-surface/60',
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </Card.Media>

      <div className="pt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-ink-900">
            {listing.neighbourhood}, {listing.city}
          </h3>
          {listing.rating > 0 ? (
            <Rating value={listing.rating} size={14} />
          ) : (
            <span className="shrink-0 text-[11px] font-semibold text-ink-500">
              {listing.lister.role === 'landlord' ? 'Direct Owner' : 'Agent'}
            </span>
          )}
        </div>
        <p className="line-clamp-1 text-sm text-ink-500">{listing.title}</p>
        <p className="text-xs text-ink-500">{specsSummary}</p>
        <div className="pt-1 flex items-center justify-between">
          <PriceTag amount={listing.price} period={listing.pricePeriod} size="sm" />
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-700">
            For {listing.type}
          </span>
        </div>
      </div>
    </Card>
  )
}

export function PropertyCardSkeleton({
  variant = 'vertical',
}: {
  variant?: 'vertical' | 'horizontal' | 'compact'
}) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3.5 rounded-[var(--radius-md)] border border-line p-3.5">
        <Skeleton className="h-20 w-24 shrink-0" rounded="sm" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" rounded="sm" />
          <Skeleton className="h-3 w-1/2" rounded="sm" />
          <Skeleton className="h-4 w-1/3" rounded="sm" />
        </div>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div className="flex flex-col sm:flex-row rounded-[var(--radius-md)] border border-line overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full sm:w-64 shrink-0" rounded="sm" />
        <div className="flex-1 p-5 space-y-3">
          <Skeleton className="h-3 w-1/3" rounded="sm" />
          <Skeleton className="h-5 w-3/4" rounded="sm" />
          <Skeleton className="h-4 w-full" rounded="sm" />
          <Skeleton className="h-5 w-1/3 mt-4" rounded="sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full" rounded="md" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-2/3" rounded="sm" />
          <Skeleton className="h-4 w-10" rounded="sm" />
        </div>
        <Skeleton className="h-3.5 w-3/4" rounded="sm" />
        <Skeleton className="h-3.5 w-1/2" rounded="sm" />
        <Skeleton className="h-4 w-2/5" rounded="sm" />
      </div>
    </div>
  )
}
