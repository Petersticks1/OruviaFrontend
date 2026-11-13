import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { Header } from './Header'
import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Counter } from '@/components/ui/Counter'
import { Input } from '@/components/ui/Input'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Toaster } from '@/components/ui/Toast'
import { AMENITIES_CATALOG } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { formatCompactNaira } from '@/lib/formatters'
import { UseGetLocationsQuery } from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  resetSearchFilters,
  setBathsFilter,
  setBedsFilter,
  setCitySlugFilter,
  setListingTypeFilter,
  setLocationFilter,
  setPriceRangeFilter,
  setVerifiedOnlyFilter,
  setVirtualTourOnlyFilter,
  toggleAmenityFilter,
} from '@/store/slices/searchFiltersSlice'
import { setFilterModalOpen, setMobileSearchOpen } from '@/store/slices/uiSlice'
import type { AmenityKey } from '@/types/domain'

export function AppShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const mobileSearchOpen = useAppSelector((state) => state.ui.mobileSearchOpen)
  const filterModalOpen = useAppSelector((state) => state.ui.filterModalOpen)
  const filters = useAppSelector((state) => state.searchFilters)

  const { locationsData } = UseGetLocationsQuery()
  const cityOptions = (locationsData?.data ?? []).flatMap((state) =>
    state.cities.map((city) => ({
      slug: city.slug,
      label: `${city.name}, ${state.name}`,
      cityName: city.name,
    })),
  )

  const applyAndNavigate = () => {
    dispatch(setMobileSearchOpen(false))
    dispatch(setFilterModalOpen(false))
    navigate({ to: '/search' })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-ink-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
      <Toaster />

      {/* Mobile Full-Screen Search Sheet */}
      <BottomSheet
        open={mobileSearchOpen}
        onClose={() => dispatch(setMobileSearchOpen(false))}
        title="Search verified homes"
        fullScreen
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => dispatch(resetSearchFilters())}>
              Clear all
            </Button>
            <Button variant="primary" size="md" leftIcon="search" onClick={applyAndNavigate}>
              Show homes
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-700">
              Where to?
            </label>
            <Input
              leftIcon="search"
              placeholder="Search city, area, or property keyword..."
              value={filters.location}
              onChange={(e) => {
                dispatch(setLocationFilter(e.target.value))
                dispatch(setCitySlugFilter(''))
              }}
            />
            {cityOptions.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {cityOptions.map((loc) => (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => {
                      dispatch(setLocationFilter(loc.cityName))
                      dispatch(setCitySlugFilter(loc.slug))
                    }}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                      filters.citySlug === loc.slug
                        ? 'bg-ink-900 text-surface'
                        : 'bg-surface-muted text-ink-700 hover:bg-line',
                    )}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-700">
              Rent or Buy
            </label>
            <Select
              value={filters.type}
              onChange={(e) =>
                dispatch(setListingTypeFilter(e.target.value as 'all' | 'rent' | 'sale'))
              }
              options={[
                { value: 'all', label: 'All listings (Rent & Sale)' },
                { value: 'rent', label: 'For Rent (Annual / Monthly)' },
                { value: 'sale', label: 'For Sale (Outright)' },
              ]}
            />
          </div>

          <RangeSlider
            min={0}
            max={150_000_000}
            step={500_000}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(range) => dispatch(setPriceRangeFilter(range))}
            formatLabel={formatCompactNaira}
          />

          <Counter
            label="Bedrooms"
            subtitle="Minimum number of bedrooms"
            value={filters.beds}
            onChange={(val) => dispatch(setBedsFilter(val))}
          />

          <Switch
            label="Oruvia Verified listings only"
            description="Only show properties with verified landlord/agent ID"
            checked={filters.verifiedOnly}
            onCheckedChange={(val) => dispatch(setVerifiedOnlyFilter(val))}
          />
        </div>
      </BottomSheet>

      {/* Filters Responsive Sheet (Modal on desktop, BottomSheet on mobile) */}
      <ResponsiveSheet
        open={filterModalOpen}
        onClose={() => dispatch(setFilterModalOpen(false))}
        title="Filters"
        description="Refine homes by Naira budget, rooms, verification status, and estate amenities."
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => dispatch(resetSearchFilters())}>
              Reset filters
            </Button>
            <Button variant="primary" size="md" onClick={applyAndNavigate}>
              Apply filters
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <RangeSlider
            min={0}
            max={150_000_000}
            step={500_000}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(range) => dispatch(setPriceRangeFilter(range))}
            formatLabel={formatCompactNaira}
            label="Budget Range (₦)"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-6">
            <Counter
              label="Bedrooms"
              value={filters.beds}
              onChange={(val) => dispatch(setBedsFilter(val))}
            />
            <Counter
              label="Bathrooms"
              value={filters.baths}
              onChange={(val) => dispatch(setBathsFilter(val))}
            />
          </div>

          <div className="space-y-3 border-t border-line pt-4">
            <Switch
              label="Verified Landlords & Agents Only"
              description="Show only properties vetted by Oruvia Trust & Safety"
              checked={filters.verifiedOnly}
              onCheckedChange={(val) => dispatch(setVerifiedOnlyFilter(val))}
            />
            <Switch
              label="Live Virtual Tour Available"
              description="Inspect remotely via video call before visiting physically"
              checked={filters.virtualTourOnly}
              onCheckedChange={(val) => dispatch(setVirtualTourOnlyFilter(val))}
            />
          </div>

          <div className="border-t border-line pt-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-700">
              Essential Estate Amenities
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(Object.keys(AMENITIES_CATALOG) as AmenityKey[]).map((key) => {
                const item = AMENITIES_CATALOG[key]
                return (
                  <Checkbox
                    key={key}
                    label={item.label}
                    checked={filters.amenities.includes(key)}
                    onChange={() => dispatch(toggleAmenityFilter(key))}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </ResponsiveSheet>
    </div>
  )
}
