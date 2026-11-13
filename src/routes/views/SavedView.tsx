import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PropertyCard, PropertyCardSkeleton } from '@/components/cards/PropertyCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { mapPropertyListingDtoToDomain } from '@/features/listings/api/mappers'
import { UseGetMarketplaceListingsQuery } from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSavedListing } from '@/store/slices/uiSlice'

export default function SavedView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)
  const { marketplaceListingsData, marketplaceListingsIsLoading } = UseGetMarketplaceListingsQuery(
    { per_page: 100 },
    savedIds.length > 0,
  )

  const savedListings = useMemo(() => {
    const raw = marketplaceListingsData?.data ?? []
    return raw
      .map(mapPropertyListingDtoToDomain)
      .filter((item) => savedIds.includes(item.id))
  }, [marketplaceListingsData, savedIds])

  return (
    <PageContainer className="py-8 space-y-6">
      <SectionHeader
        eyebrow="Wishlists"
        title={`Saved Properties (${savedIds.length})`}
        subtitle="Compare your shortlisted homes and request virtual or physical inspections when ready."
      />

      {marketplaceListingsIsLoading && savedIds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: Math.min(savedIds.length, 4) }, (_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      ) : savedListings.length === 0 ? (
        <EmptyStateCard
          icon="heart"
          title="No saved homes yet"
          description="Tap the heart icon on any verified property to shortlist it here."
          actionLabel="Explore homes"
          onAction={() => navigate({ to: '/' })}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              isSaved
              onToggleSave={(id) => dispatch(toggleSavedListing(id))}
              onSelect={(id) =>
                navigate({ to: '/listing/$listingId', params: { listingId: id } })
              }
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

