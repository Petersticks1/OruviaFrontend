import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PropertyCard } from '@/components/cards/PropertyCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { listingsQueryOptions } from '@/features/listings/api/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSavedListing } from '@/store/slices/uiSlice'

export default function SavedView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)
  const { data: listings = [] } = useQuery(listingsQueryOptions())

  const savedListings = listings.filter((item) => savedIds.includes(item.id))

  return (
    <PageContainer className="py-8 space-y-6">
      <SectionHeader
        eyebrow="Wishlists"
        title={`Saved Properties (${savedListings.length})`}
        subtitle="Compare your shortlisted homes and request virtual or physical inspections when ready."
      />

      {savedListings.length === 0 ? (
        <EmptyStateCard
          icon="heart"
          title="No saved homes yet"
          description="Tap the heart icon on any verified property across Abeokuta, Mowe-Ofada, or Lagos to shortlist it here."
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

