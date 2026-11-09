import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PROPERTY_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setCategoryFilter,
  setVerifiedOnlyFilter,
} from '@/store/slices/searchFiltersSlice'
import { setFilterModalOpen, toggleMapView } from '@/store/slices/uiSlice'

export function CategoryChips() {
  const dispatch = useAppDispatch()
  const activeCategory = useAppSelector((state) => state.searchFilters.category)
  const verifiedOnly = useAppSelector((state) => state.searchFilters.verifiedOnly)
  const mapView = useAppSelector((state) => state.ui.mapView)

  return (
    <div className="sticky top-20 z-30 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Horizontally scrollable category icons */}
        <div
          role="tablist"
          aria-label="Property categories"
          className="flex items-center gap-6 overflow-x-auto py-3 no-scrollbar"
        >
          {PROPERTY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => dispatch(setCategoryFilter(cat.id))}
                className={cn(
                  'group relative flex shrink-0 flex-col items-center gap-1.5 pb-2 text-xs font-semibold transition-colors cursor-pointer',
                  isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
                )}
              >
                <Icon
                  name={cat.icon}
                  size={22}
                  className={cn(
                    'transition-transform duration-150 group-hover:scale-105',
                    isActive ? 'text-brand-500' : 'text-current',
                  )}
                />
                <span>{cat.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute bottom-0 inset-x-0 h-0.5 rounded-full transition-colors',
                    isActive ? 'bg-ink-900' : 'bg-transparent group-hover:bg-line',
                  )}
                />
              </button>
            )
          })}
        </div>

        {/* Right Controls: Verified Toggle, Filters Button, Map/List Toggle */}
        <div className="hidden md:flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            aria-pressed={verifiedOnly}
            onClick={() => dispatch(setVerifiedOnlyFilter(!verifiedOnly))}
            className={cn(
              'inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer',
              verifiedOnly
                ? 'border-verified bg-verified/10 text-ink-900'
                : 'border-line bg-surface text-ink-700 hover:border-ink-900',
            )}
          >
            <Icon name="verified" size={16} className="text-verified" />
            <span>Verified only</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            leftIcon="filter"
            onClick={() => dispatch(setFilterModalOpen(true))}
          >
            Filters
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={mapView ? 'list' : 'map'}
            onClick={() => dispatch(toggleMapView())}
          >
            {mapView ? 'Show list' : 'Show map'}
          </Button>
        </div>
      </div>
    </div>
  )
}

