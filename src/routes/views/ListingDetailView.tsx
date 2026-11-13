import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
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
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { mapPropertyListingDtoToDomain } from '@/features/listings/api/mappers'
import { ListingsMap } from '@/features/listings/components/ListingsMap'
import { cn } from '@/lib/cn'
import { AMENITIES_CATALOG } from '@/lib/constants'
import { UseGetMarketplaceListingByIdOrSlugQuery } from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToast, toggleSavedListing } from '@/store/slices/uiSlice'
import type { AmenityKey } from '@/types/domain'

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    let videoId: string | null = null
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.replace('/embed/', '')
      } else {
        videoId = parsed.searchParams.get('v')
      }
    } else if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1)
    }
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
    }
    return null
  } catch {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    )
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null
  }
}

function getVimeoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('vimeo.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean)
      const last = parts[parts.length - 1]
      if (last && /^\d+$/.test(last)) {
        return `https://player.vimeo.com/video/${last}?autoplay=1`
      }
    }
    return null
  } catch {
    return null
  }
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}

export default function ListingDetailView() {
  const { listingId } = useParams({ strict: false }) as { listingId: string }
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)
  const [reportOpen, setReportOpen] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const {
    marketplaceListingDetailData,
    marketplaceListingDetailIsLoading,
  } = UseGetMarketplaceListingByIdOrSlugQuery(listingId)

  const listing = useMemo(() => {
    const dto = marketplaceListingDetailData?.data
    return dto ? mapPropertyListingDtoToDomain(dto) : undefined
  }, [marketplaceListingDetailData])

  useEffect(() => {
    if (!photoModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev > 0 ? prev - 1 : (listing?.images.length ? listing.images.length - 1 : 0),
        )
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          listing?.images.length && prev < listing.images.length - 1 ? prev + 1 : 0,
        )
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [photoModalOpen, listing?.images.length])

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

  const verifiedLabel =
    listing.lister.verificationBadge === 'verified_owner'
      ? 'Verified Owner'
      : listing.lister.verificationBadge === 'licensed_agent'
        ? 'Licensed Agent'
        : listing.lister.verificationBadge === 'verified_agent'
          ? 'Verified Agent'
          : listing.lister.verificationBadge === 'verified_landlord'
            ? 'Verified Landlord'
            : 'Verified'

  const youtubeEmbedUrl = listing.videoTourUrl ? getYouTubeEmbedUrl(listing.videoTourUrl) : null
  const vimeoEmbedUrl = listing.videoTourUrl ? getVimeoEmbedUrl(listing.videoTourUrl) : null
  const isDirectVideo = listing.videoTourUrl ? isDirectVideoUrl(listing.videoTourUrl) : false

  return (
    <PageContainer className="py-6 space-y-8">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {listing.verified ? <VerifiedBadge label={verifiedLabel} /> : null}
            <StatusBadge status={listing.status} />
            <Badge variant="default">For {listing.type}</Badge>
            {listing.videoTourUrl ? (
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="cursor-pointer transition-transform hover:scale-105"
                title="Click to preview video walkthrough"
              >
                <Badge variant="brand" icon="video">
                  Live Video Tour Available · Watch now
                </Badge>
              </button>
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

      {/* Photo-First Airbnb Gallery with Full Previews */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line">
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4 md:grid-rows-2 md:h-[440px]">
          <div className="md:col-span-2 md:row-span-2 bg-surface-muted overflow-hidden">
            {heroImage ? (
              <button
                type="button"
                aria-label={`Preview photo 1: ${heroImage.alt}`}
                onClick={() => {
                  setActivePhotoIndex(0)
                  setPhotoModalOpen(true)
                }}
                className="group relative h-full w-full block text-left cursor-pointer overflow-hidden"
              >
                <img
                  src={heroImage.url}
                  alt={heroImage.alt}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-ink-900/0 transition-colors group-hover:bg-ink-900/10" />
              </button>
            ) : null}
          </div>
          {sideImages.map((img, idx) => (
            <div key={img.id} className="hidden md:block bg-surface-muted overflow-hidden">
              <button
                type="button"
                aria-label={`Preview photo ${idx + 2}: ${img.alt}`}
                onClick={() => {
                  setActivePhotoIndex(idx + 1)
                  setPhotoModalOpen(true)
                }}
                className="group relative h-full w-full block text-left cursor-pointer overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  width={400}
                  height={300}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-ink-900/0 transition-colors group-hover:bg-ink-900/10" />
              </button>
            </div>
          ))}
        </div>

        {/* Gallery floating preview action buttons */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-wrap items-center gap-2">
          {listing.videoTourUrl ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon="video"
              onClick={() => setVideoModalOpen(true)}
              className="bg-surface/90 backdrop-blur-md shadow-[var(--shadow-card)] hover:bg-surface"
            >
              Watch Video Tour
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            leftIcon="list"
            onClick={() => {
              setActivePhotoIndex(0)
              setPhotoModalOpen(true)
            }}
            className="bg-surface/90 backdrop-blur-md shadow-[var(--shadow-card)] hover:bg-surface"
          >
            Show all {listing.images.length} photos
          </Button>
        </div>
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

          {/* Virtual Video Tour Section */}
          {listing.videoTourUrl ? (
            <SectionCard
              title="Virtual Video Tour"
              subtitle="Explore this verified home via online video walkthrough"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon="video"
                  onClick={() => setVideoModalOpen(true)}
                >
                  Full screen
                </Button>
              }
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-md)] bg-ink-900 shadow-[var(--shadow-card)]">
                {youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`Video tour for ${listing.title}`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : vimeoEmbedUrl ? (
                  <iframe
                    src={vimeoEmbedUrl}
                    title={`Video tour for ${listing.title}`}
                    className="h-full w-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : isDirectVideo ? (
                  <video
                    controls
                    src={listing.videoTourUrl}
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-surface">
                    <Icon name="video" size={40} className="mb-3 text-brand-400" />
                    <p className="text-sm font-semibold">External Video Tour Available</p>
                    <p className="mt-1 max-w-sm text-xs text-ink-300">
                      This property includes a verified virtual video tour hosted by the lister.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon="video"
                      className="mt-4"
                      onClick={() =>
                        window.open(listing.videoTourUrl, '_blank', 'noopener,noreferrer')
                      }
                    >
                      Open Video Tour
                    </Button>
                  </div>
                )}
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

      {/* Photo Lightbox Modal */}
      <Modal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        title={`${listing.title} (${activePhotoIndex + 1}/${listing.images.length})`}
        description={listing.images[activePhotoIndex]?.alt || 'Property photo preview'}
        size="xl"
      >
        <div className="flex flex-col gap-4">
          <div className="relative flex min-h-[300px] max-h-[60vh] sm:min-h-[420px] items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-ink-900/95">
            {listing.images[activePhotoIndex] ? (
              <img
                src={listing.images[activePhotoIndex].url}
                alt={listing.images[activePhotoIndex].alt}
                className="max-h-[58vh] w-auto max-w-full object-contain"
              />
            ) : null}

            {listing.images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev > 0 ? prev - 1 : listing.images.length - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink-900 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                >
                  <Icon name="chevronLeft" size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev < listing.images.length - 1 ? prev + 1 : 0,
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink-900 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                >
                  <Icon name="chevronRight" size={20} />
                </button>
              </>
            ) : null}
          </div>

          {/* Thumbnails strip */}
          {listing.images.length > 1 ? (
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {listing.images.map((img, idx) => {
                const isCurrent = idx === activePhotoIndex
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={cn(
                      'relative h-16 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-all cursor-pointer',
                      isCurrent
                        ? 'border-brand-500 ring-2 ring-brand-500/30'
                        : 'border-transparent opacity-65 hover:opacity-100',
                    )}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </Modal>

      {/* Video Tour Modal */}
      {listing.videoTourUrl ? (
        <Modal
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          title={`Virtual Video Tour — ${listing.title}`}
          description={`Walkthrough tour for verified listing in ${listing.neighbourhood}, ${listing.city}`}
          size="xl"
          footer={
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-ink-500">
                Contact host to book physical or video inspection
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon="video"
                onClick={() =>
                  window.open(listing.videoTourUrl, '_blank', 'noopener,noreferrer')
                }
              >
                Open in external tab
              </Button>
            </div>
          }
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-md)] bg-ink-900 shadow-[var(--shadow-card)]">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={`Video tour for ${listing.title}`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : vimeoEmbedUrl ? (
              <iframe
                src={vimeoEmbedUrl}
                title={`Video tour for ${listing.title}`}
                className="h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : isDirectVideo ? (
              <video
                controls
                autoPlay
                src={listing.videoTourUrl}
                className="h-full w-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-surface">
                <Icon name="video" size={48} className="mb-3 text-brand-400" />
                <p className="text-base font-semibold">Verified Virtual Tour</p>
                <p className="mt-1 max-w-sm text-xs text-ink-300">
                  {listing.videoTourUrl}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon="video"
                  className="mt-4"
                  onClick={() =>
                    window.open(listing.videoTourUrl, '_blank', 'noopener,noreferrer')
                  }
                >
                  Watch video tour
                </Button>
              </div>
            )}
          </div>
        </Modal>
      ) : null}

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
