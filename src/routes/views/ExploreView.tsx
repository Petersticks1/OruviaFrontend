import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PropertyCard, PropertyCardSkeleton } from '@/components/cards/PropertyCard'
import { CategoryChips } from '@/components/layout/CategoryChips'
import { FilterChip } from '@/components/shared/FilterChip'
import { PageContainer } from '@/components/shared/PageContainer'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { LoadMore } from '@/components/ui/LoadMore'
import {
  buildMarketplaceListingsParams,
  filterListingsClientSide,
  mapPropertyListingDtoToDomain,
} from '@/features/listings/api/mappers'
import { ListingsMap } from '@/features/listings/components/ListingsMap'
import { UseGetMarketplaceListingsQuery } from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  resetSearchFilters,
  setListingTypeFilter,
  setVirtualTourOnlyFilter,
} from '@/store/slices/searchFiltersSlice'
import { addToast, toggleMapView, toggleSavedListing } from '@/store/slices/uiSlice'

export default function ExploreView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.searchFilters)
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)
  const mapView = useAppSelector((state) => state.ui.mapView)
  const [visibleCount, setVisibleCount] = useState(8)

  const apiParams = useMemo(() => buildMarketplaceListingsParams(filters), [filters])
  const { marketplaceListingsData, marketplaceListingsIsLoading } =
    UseGetMarketplaceListingsQuery(apiParams)

  const listings = useMemo(() => {
    const raw = marketplaceListingsData?.data ?? []
    return filterListingsClientSide(raw.map(mapPropertyListingDtoToDomain), filters)
  }, [marketplaceListingsData, filters])

  const isLoading = marketplaceListingsIsLoading
  const visibleListings = listings.slice(0, visibleCount)

  const handleToggleSave = (listingId: string) => {
    const wasSaved = savedIds.includes(listingId)
    dispatch(toggleSavedListing(listingId))
    dispatch(
      addToast({
        title: wasSaved ? 'Removed from Saved Wishlists' : 'Saved to Wishlist',
        description: wasSaved
          ? 'Property removed from your shortlist.'
          : 'View your shortlisted homes anytime in Saved.',
        tone: 'success',
      }),
    )
  }

  return (
    <div>
      <CategoryChips />

      <PageContainer className="py-6 space-y-6">
        {/* Quick Filter Bar & Value Proposition Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line bg-surface-muted/70 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-verified/15 text-verified">
              <Icon name="verified" size={18} />
            </span>
            <p className="text-xs sm:text-sm text-ink-700">
              <span className="font-bold text-ink-900">Oruvia Trust Guarantee:</span> Every landlord
              & agent is ID-verified. Book physical or live video inspections before paying a kobo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip
              label="For Rent"
              active={filters.type === 'rent'}
              onClick={() =>
                dispatch(setListingTypeFilter(filters.type === 'rent' ? 'all' : 'rent'))
              }
            />
            <FilterChip
              label="For Sale"
              active={filters.type === 'sale'}
              onClick={() =>
                dispatch(setListingTypeFilter(filters.type === 'sale' ? 'all' : 'sale'))
              }
            />
            <FilterChip
              label="Virtual Tour"
              icon="video"
              active={filters.virtualTourOnly}
              onClick={() => dispatch(setVirtualTourOnlyFilter(!filters.virtualTourOnly))}
            />
          </div>
        </div>

        {/* Listings Grid or Map View */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyStateCard
            icon="search"
            title="No verified properties match your current filters"
            description="Try expanding your Naira budget, switching between Rent and Sale, or clearing active amenity filters."
            actionLabel="Reset all filters"
            onAction={() => dispatch(resetSearchFilters())}
          />
        ) : mapView ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5 max-h-[620px] overflow-y-auto pr-1">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  variant="compact"
                  isSaved={savedIds.includes(listing.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={(id) =>
                    navigate({ to: '/listing/$listingId', params: { listingId: id } })
                  }
                />
              ))}
            </div>
            <div className="lg:col-span-7">
              <ListingsMap
                listings={listings}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
                onSelectListing={(id) =>
                  navigate({ to: '/listing/$listingId', params: { listingId: id } })
                }
                className="h-[620px] w-full"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  isSaved={savedIds.includes(listing.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={(id) =>
                    navigate({ to: '/listing/$listingId', params: { listingId: id } })
                  }
                />
              ))}
            </div>

            <LoadMore
              hasMore={visibleCount < listings.length}
              shownCount={visibleListings.length}
              totalCount={listings.length}
              onLoadMore={() => setVisibleCount((prev) => prev + 4)}
            />
          </>
        )}
      </PageContainer>

      {/* Floating Mobile/Desktop Map Toggle Pill (Airbnb-style) */}
      <div className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 md:bottom-8">
        <Button
          variant="primary"
          size="md"
          leftIcon={mapView ? 'list' : 'map'}
          onClick={() => dispatch(toggleMapView())}
          className="rounded-full bg-ink-900 bg-none px-5 text-surface shadow-[var(--shadow-sheet)] hover:bg-ink-700"
        >
          {mapView ? 'Show list' : 'Show map'}
        </Button>
      </div>
    </div>
  )
}

