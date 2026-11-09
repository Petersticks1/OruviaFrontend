import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PropertyCard, PropertyCardSkeleton } from '@/components/cards/PropertyCard'
import { CategoryChips } from '@/components/layout/CategoryChips'
import { FilterChip } from '@/components/shared/FilterChip'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Select } from '@/components/ui/Select'
import { listingsQueryOptions } from '@/features/listings/api/queries'
import { ListingsMap } from '@/features/listings/components/ListingsMap'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  resetSearchFilters,
  setBedsFilter,
  setLocationFilter,
  setSortBy,
  setVerifiedOnlyFilter,
} from '@/store/slices/searchFiltersSlice'
import { setFilterModalOpen, toggleSavedListing } from '@/store/slices/uiSlice'

export default function SearchView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.searchFilters)
  const savedIds = useAppSelector((state) => state.ui.savedListingIds)

  const { data: listings = [], isLoading } = useQuery(listingsQueryOptions(filters))

  return (
    <div>
      <CategoryChips />
      <PageContainer className="py-6 space-y-6">
        <SectionHeader
          eyebrow="Search & Discovery"
          title={
            filters.location
              ? `${listings.length} properties in "${filters.location}"`
              : `${listings.length} verified properties in Ogun & Lagos`
          }
          subtitle="Compare annual rent or outright sale prices, view on the map, and book physical or virtual inspections."
          action={
            <div className="w-52">
              <Select
                aria-label="Sort listings"
                value={filters.sortBy}
                onChange={(e) =>
                  dispatch(
                    setSortBy(
                      e.target.value as 'recommended' | 'price_asc' | 'price_desc' | 'newest',
                    ),
                  )
                }
                options={[
                  { value: 'recommended', label: 'Sort: Recommended' },
                  { value: 'price_asc', label: 'Price: Low to High' },
                  { value: 'price_desc', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest Verified' },
                ]}
              />
            </div>
          }
        />

        {/* Active filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label="All Filters"
            icon="filter"
            onClick={() => dispatch(setFilterModalOpen(true))}
          />
          {filters.location ? (
            <FilterChip
              label={`Location: ${filters.location}`}
              active
              onRemove={() => dispatch(setLocationFilter(''))}
            />
          ) : null}
          {filters.beds > 0 ? (
            <FilterChip
              label={`${filters.beds}+ Beds`}
              active
              onRemove={() => dispatch(setBedsFilter(0))}
            />
          ) : null}
          {filters.verifiedOnly ? (
            <FilterChip
              label="Verified Only"
              active
              onRemove={() => dispatch(setVerifiedOnlyFilter(false))}
            />
          ) : null}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <PropertyCardSkeleton key={i} variant="horizontal" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyStateCard
            icon="search"
            title="No properties match your search criteria"
            description="Try removing one of your active filters or searching across all of Ogun and Lagos."
            actionLabel="Reset search filters"
            onAction={() => dispatch(resetSearchFilters())}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  variant="horizontal"
                  isSaved={savedIds.includes(listing.id)}
                  onToggleSave={(id) => dispatch(toggleSavedListing(id))}
                  onSelect={(id) =>
                    navigate({ to: '/listing/$listingId', params: { listingId: id } })
                  }
                />
              ))}
            </div>
            <div className="lg:col-span-5">
              <div className="sticky top-36">
                <ListingsMap
                  listings={listings}
                  savedIds={savedIds}
                  onToggleSave={(id) => dispatch(toggleSavedListing(id))}
                  onSelectListing={(id) =>
                    navigate({ to: '/listing/$listingId', params: { listingId: id } })
                  }
                  className="h-[580px] w-full"
                />
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  )
}

