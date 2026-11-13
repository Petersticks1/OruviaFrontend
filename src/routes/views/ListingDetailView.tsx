import { useNavigate, useParams } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { ListerCard } from '@/components/cards/ListerCard'
import { PricingSummaryCard } from '@/components/cards/PricingSummaryCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageContainer } from '@/components/shared/PageContainer'
import { RatingSummary } from '@/components/shared/RatingSummary'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/Skeleton'
import { mapPropertyListingDtoToDomain } from '@/features/listings/api/mappers'
import { ListingsMap } from '@/features/listings/components/ListingsMap'
import { AMENITIES_CATALOG } from '@/lib/constants'
import { UseGetMarketplaceListingByIdOrSlugQuery } from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToast, toggleSavedListing } from '@/store/slices/uiSlice'
import type { AmenityKey } from '@/types/domain'

export default function ListingDetailView() {
  const { listingId } = useParams({ strict: false }) as { listingId: string }
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)
  const [reportOpen, setReportOpen] = useState(false)

  const {
    marketplaceListingDetailData,
    marketplaceListingDetailIsLoading,
  } = UseGetMarketplaceListingByIdOrSlugQuery(listingId)

  const listing = useMemo(() => {
    const dto = marketplaceListingDetailData?.data
    return dto ? mapPropertyListingDtoToDomain(dto) : undefined
  }, [marketplaceListingDetailData])

  if (marketplaceListingDetailIsLoading) {
    return (
      <PageContainer className="py-6 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-[380px] w-full rounded-[var(--radius-lg)]" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!listing) {
    return (
      <PageContainer className="py-12">
        <EmptyStateCard
          icon="home"
          title="Listing not found"
          description="This property may have been rented, sold, or removed by its owner."
          actionLabel="Explore verified homes"
          onAction={() => navigate({ to: '/' })}
        />
      </PageContainer>
    )
  }

  const isSaved = savedIds.includes(listing.id)
  const heroImage = listing.images[0]
  const sideImages = listing.images.slice(1, 5)
  const contactPhone = (listing.lister.whatsappNumber || listing.lister.phone || '').replace(
    /[^\d+]/g,
    '',
  )

  return (
    <PageContainer className="py-6 space-y-8">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {listing.verified ? <VerifiedBadge /> : null}
            <StatusBadge status={listing.status} />
            <Badge variant="default">For {listing.type}</Badge>
            {listing.videoTourUrl ? (
              <Badge variant="brand" icon="video">
                Live Video Tour Available
              </Badge>
            ) : null}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-700">
            {listing.reviewCount > 0 ? (
              <>
                <RatingSummary rating={listing.rating} reviewCount={listing.reviewCount} />
                <span>·</span>
              </>
            ) : null}
            <span className="inline-flex items-center gap-1 font-medium underline">
              <Icon name="location" size={16} />
              {listing.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon="share"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href)
              dispatch(
                addToast({
                  title: 'Link copied to clipboard',
                  description: 'Share this verified property with family or co-tenants.',
                  tone: 'info',
                }),
              )
            }}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={isSaved ? 'heartFilled' : 'heart'}
            onClick={() => dispatch(toggleSavedListing(listing.id))}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Photo-First Airbnb Gallery */}
      <div className="grid grid-cols-1 gap-2.5 overflow-hidden rounded-[var(--radius-lg)] md:grid-cols-4 md:grid-rows-2 md:h-[440px]">
        <div className="md:col-span-2 md:row-span-2 bg-surface-muted overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={heroImage.alt}
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : null}
        </div>
        {sideImages.map((img) => (
          <div key={img.id} className="hidden md:block bg-surface-muted overflow-hidden">
            <img
              src={img.url}
              alt={img.alt}
              width={400}
              height={300}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>

      {/* Main Content + Sticky Pricing & Inspection CTA */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Quick Specs */}
          <SectionCard
            title={`Listed by ${listing.lister.name}`}
            subtitle={`${listing.beds > 0 ? `${listing.beds} Bedrooms · ${listing.baths} Bathrooms · ` : ''}${listing.areaSqm > 0 ? `${listing.areaSqm} sqm · ` : ''}${listing.neighbourhood}, ${listing.city}`}
          >
            <p className="text-sm leading-relaxed text-ink-700">{listing.description}</p>
          </SectionCard>

          {/* Amenities */}
          {listing.amenities.length > 0 ? (
            <SectionCard
              title="What this property offers"
              subtitle="Verified infrastructure and estate facilities"
            >
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {listing.amenities.map((amenityKey) => {
                  const meta = AMENITIES_CATALOG[amenityKey as AmenityKey]
                  const label =
                    meta?.label ??
                    String(amenityKey)
                      .replace(/[_-]+/g, ' ')
                      .replace(/\b\w/g, (ch) => ch.toUpperCase())
                  return (
                    <div
                      key={String(amenityKey)}
                      className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-line/70 px-3.5 py-2.5"
                    >
                      <Icon name={meta?.icon ?? 'check'} size={20} className="text-ink-900" />
                      <span className="text-sm font-medium text-ink-900">{label}</span>
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          ) : null}

          {/* Location Map */}
          <SectionCard
            title="Where you’ll live"
            subtitle={`${listing.location} — exact pin shared after inspection confirmation`}
          >
            <ListingsMap listings={[listing]} className="h-80 w-full" />
          </SectionCard>

          {/* Host / Lister Profile */}
          <ListerCard
            lister={listing.lister}
            onViewProfile={(userId) => navigate({ to: '/profile/$userId', params: { userId } })}
            onContact={() => navigate({ to: '/inbox' })}
            onWhatsApp={
              contactPhone
                ? () => {
                    window.open(
                      `https://wa.me/${contactPhone}?text=${encodeURIComponent(`Hello ${listing.lister.name}, I found your listing "${listing.title}" on Oruvia and would like to book an inspection.`)}`,
                      '_blank',
                    )
                  }
                : undefined
            }
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <PricingSummaryCard
            listing={listing}
            onRequestInspection={({ mode, dateTime }) => {
              dispatch(
                addToast({
                  title: 'Inspection Request Sent!',
                  description: `${listing.lister.name} has been notified of your ${mode} inspection request for ${new Date(dateTime).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.`,
                  tone: 'success',
                }),
              )
              navigate({ to: '/inspections' })
            }}
            onInquire={() => navigate({ to: '/inbox' })}
            onReport={() => setReportOpen(true)}
          />
        </div>
      </div>

      <ConfirmDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onConfirm={() => {
          setReportOpen(false)
          dispatch(
            addToast({
              title: 'Listing flagged for Trust & Safety review',
              description: 'Our moderation team will audit this property within 2 hours.',
              tone: 'info',
            }),
          )
        }}
        title="Report suspicious listing or inflated fees"
        description="Is this property unavailable, misrepresented, or asking for an unverified upfront inspection fee? Oruvia moderators will investigate immediately."
        confirmLabel="Submit report"
        destructive
      />
    </PageContainer>
  )
}
