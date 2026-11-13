import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'
import { Divider } from '@/components/ui/Divider'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Popover } from '@/components/ui/Popover'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { Select } from '@/components/ui/Select'
import { mapProfileDtoToDomain } from '@/features/listings/api/mappers'
import { cn } from '@/lib/cn'
import { formatCompactNaira } from '@/lib/formatters'
import {
  UseGetAgentMeQuery,
  UseGetLandlordMeQuery,
  UseGetLocationsQuery,
  UseGetSeekerMeQuery,
} from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, updateUserProfile } from '@/store/slices/authSlice'
import {
  resetSearchFilters,
  setBedsFilter,
  setCitySlugFilter,
  setListingTypeFilter,
  setLocationFilter,
  setPriceRangeFilter,
} from '@/store/slices/searchFiltersSlice'
import { setFilterModalOpen, setMobileSearchOpen } from '@/store/slices/uiSlice'

function OruviaLogo() {
  return (
    <span className="inline-flex items-center gap-2 text-brand-500">
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-brand-500"
      >
        <path
          d="M4 15.5L16 5L28 15.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 14.5V25C8.5 26.1046 9.39543 27 10.5 27H21.5C22.6046 27 23.5 26.1046 23.5 25V14.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 27V20C13.5 18.6193 14.6193 17.5 16 17.5C17.3807 17.5 18.5 18.6193 18.5 20V27"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight text-brand-500">oruvia</span>
    </span>
  )
}

export function Header() {
  const [isCompact, setIsCompact] = useState(false)
  const [expandedSearchPanel, setExpandedSearchPanel] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const filters = useAppSelector((state) => state.searchFilters)
  const savedCount = useAppSelector((state) => state.ui.savedListingIds.length)

  const { locationsData } = UseGetLocationsQuery()
  const statesWithCities = locationsData?.data ?? []
  const cityOptions = statesWithCities.flatMap((state) =>
    state.cities.map((city) => ({
      slug: city.slug,
      label: `${city.name}, ${state.name}`,
      cityName: city.name,
    })),
  )

  const { seekerMeData } = UseGetSeekerMeQuery(Boolean(token) && user?.role === 'seeker')
  const { agentMeData } = UseGetAgentMeQuery(Boolean(token) && user?.role === 'agent')
  const { landlordMeData } = UseGetLandlordMeQuery(Boolean(token) && user?.role === 'landlord')

  useEffect(() => {
    const profileDto = seekerMeData?.data ?? agentMeData?.data ?? landlordMeData?.data
    if (profileDto) {
      dispatch(updateUserProfile(mapProfileDtoToDomain(profileDto)))
    }
  }, [seekerMeData, agentMeData, landlordMeData, dispatch])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 48) {
        setIsCompact(true)
      } else if (window.scrollY < 16) {
        setIsCompact(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = () => {
    setExpandedSearchPanel(false)
    navigate({ to: '/search' })
  }

  const priceSummary =
    filters.minPrice === 0 && filters.maxPrice >= 150_000_000
      ? 'Any price'
      : `${formatCompactNaira(filters.minPrice)}–${formatCompactNaira(filters.maxPrice)}`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md transition-shadow duration-200">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        {/* Brand Logo */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-2 rounded-[var(--radius-sm)] py-1 pr-2"
          aria-label="Oruvia home — your path to a roof"
        >
          <OruviaLogo />
        </Link>

        {/* Mobile Full-Width Search Pill (<768px) */}
        <div className="flex flex-1 items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => dispatch(setMobileSearchOpen(true))}
            className="flex flex-1 items-center gap-3 rounded-full border border-line bg-surface px-4 py-2.5 text-left shadow-[var(--shadow-card)] transition-shadow active:scale-[0.99] cursor-pointer"
          >
            <Icon name="search" size={18} className="text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink-900">
                {filters.location || 'Search city or area...'}
              </p>
              <p className="truncate text-[11px] text-ink-500">
                {filters.type === 'all' ? 'Rent or Buy' : `For ${filters.type}`} · {priceSummary} ·{' '}
                {filters.beds > 0 ? `${filters.beds}+ beds` : 'Any beds'}
              </p>
            </div>
          </button>
          <button
            type="button"
            aria-label="Open filters"
            onClick={() => dispatch(setFilterModalOpen(true))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-900 shadow-[var(--shadow-card)] cursor-pointer"
          >
            <Icon name="filter" size={18} />
          </button>
        </div>

        {/* Desktop Centered Pill Search Bar (Location | Type | Price | Beds) */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl">
          <div
            className={cn(
              'flex items-center rounded-full border border-line bg-surface shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-hover)]',
              isCompact ? 'py-1 pl-4 pr-1.5 scale-[0.96]' : 'py-1.5 pl-5 pr-2',
            )}
          >
            <button
              type="button"
              onClick={() => setExpandedSearchPanel((prev) => !prev)}
              className="flex flex-col text-left pr-4 border-r border-line cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900">
                Location
              </span>
              <span className="text-xs font-medium text-ink-500 truncate max-w-32">
                {filters.location || 'Anywhere'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setExpandedSearchPanel((prev) => !prev)}
              className="flex flex-col text-left px-4 border-r border-line cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900">
                Type
              </span>
              <span className="text-xs font-medium capitalize text-ink-500">
                {filters.type === 'all' ? 'Rent or Sale' : `For ${filters.type}`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setExpandedSearchPanel((prev) => !prev)}
              className="flex flex-col text-left px-4 border-r border-line cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900">
                Price
              </span>
              <span className="text-xs font-medium text-ink-500">{priceSummary}</span>
            </button>

            <button
              type="button"
              onClick={() => setExpandedSearchPanel((prev) => !prev)}
              className="flex flex-col text-left pl-4 pr-3 cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900">
                Beds
              </span>
              <span className="text-xs font-medium text-ink-500">
                {filters.beds > 0 ? `${filters.beds}+ beds` : 'Any beds'}
              </span>
            </button>

            <button
              type="button"
              aria-label="Search properties"
              onClick={handleSearchSubmit}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-surface transition-colors hover:bg-brand-600 cursor-pointer"
            >
              <Icon name="search" size={16} />
            </button>
          </div>
        </div>

        {/* Right Actions: List a property, Notification Bell, User Menu Pill */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to={
              user && (user.role === 'agent' || user.role === 'landlord')
                ? '/dashboard/listings/new'
                : '/signup'
            }
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-surface-muted"
          >
            List a property
          </Link>

          {user ? (
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-surface-muted hover:text-ink-900"
            >
              <Icon name="bell" size={20} />
            </Link>
          ) : null}

          <Popover
            align="right"
            trigger={({ open, toggle, setTriggerEl }) => (
              <button
                ref={setTriggerEl}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Account menu"
                onClick={toggle}
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-1.5 transition-shadow hover:shadow-[var(--shadow-card)] cursor-pointer"
              >
                <Icon name="menu" size={18} className="text-ink-700" />
                {user ? (
                  <Avatar name={user.name} src={user.avatarUrl} verified={user.verified} size="xs" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-300 text-surface">
                    <Icon name="user" size={16} />
                  </span>
                )}
              </button>
            )}
          >
            {({ close }) => (
              <div className="w-64 space-y-1 py-1 text-sm">
                {user ? (
                  <div className="px-3 py-2 border-b border-line">
                    <p className="font-bold text-ink-900 truncate">{user.name}</p>
                    <p className="text-xs text-ink-500 capitalize">
                      Role: {user.role} {user.verified ? '· Verified' : ''}
                    </p>
                  </div>
                ) : null}

                {user ? (
                  <>
                    <Link
                      to="/saved"
                      onClick={close}
                      className="flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 font-medium text-ink-900 hover:bg-surface-muted"
                    >
                      <span>Saved Wishlists</span>
                      {savedCount > 0 ? (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">
                          {savedCount}
                        </span>
                      ) : null}
                    </Link>
                    <Link
                      to="/inspections"
                      onClick={close}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 font-medium text-ink-900 hover:bg-surface-muted"
                    >
                      Inspections
                    </Link>
                    <Link
                      to="/inbox"
                      onClick={close}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 font-medium text-ink-900 hover:bg-surface-muted"
                    >
                      Messages & Inquiries
                    </Link>

                    {user.role === 'agent' || user.role === 'landlord' ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={close}
                          className="block rounded-[var(--radius-sm)] px-3 py-2 font-medium text-ink-900 hover:bg-surface-muted"
                        >
                          Lister Dashboard
                        </Link>
                        <Link
                          to="/verify"
                          onClick={close}
                          className="block rounded-[var(--radius-sm)] px-3 py-2 font-medium text-ink-900 hover:bg-surface-muted"
                        >
                          KYC Verification
                        </Link>
                      </>
                    ) : null}

                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={close}
                        className="block rounded-[var(--radius-sm)] px-3 py-2 font-semibold text-brand-600 hover:bg-brand-50"
                      >
                        Admin Moderation
                      </Link>
                    ) : null}

                    <Divider />
                    <Link
                      to="/profile/$userId"
                      params={{ userId: user.id }}
                      onClick={close}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 text-ink-700 hover:bg-surface-muted"
                    >
                      Profile & Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(logout())
                        close()
                        navigate({ to: '/' })
                      }}
                      className="w-full text-left rounded-[var(--radius-sm)] px-3 py-2 font-medium text-danger hover:bg-surface-muted cursor-pointer"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={close}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 font-semibold text-ink-900 hover:bg-surface-muted"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={close}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 text-ink-700 hover:bg-surface-muted"
                    >
                      Sign up
                    </Link>
                    <Divider />
                    <Link
                      to="/search"
                      onClick={close}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 text-ink-700 hover:bg-surface-muted"
                    >
                      Explore Properties
                    </Link>
                  </>
                )}
              </div>
            )}
          </Popover>
        </div>
      </div>

      {/* Desktop Expandable Quick Search Panel */}
      {expandedSearchPanel ? (
        <div className="hidden md:block border-t border-line bg-surface shadow-[var(--shadow-hover)]">
          <div className="mx-auto max-w-4xl px-6 py-5 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-700">
                  Location
                </label>
                <Input
                  leftIcon="location"
                  placeholder="Search city or neighbourhood..."
                  value={filters.location}
                  onChange={(e) => {
                    dispatch(setLocationFilter(e.target.value))
                    dispatch(setCitySlugFilter(''))
                  }}
                />
                {cityOptions.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {cityOptions.map((loc) => (
                      <button
                        key={loc.slug}
                        type="button"
                        onClick={() => {
                          dispatch(setLocationFilter(loc.cityName))
                          dispatch(setCitySlugFilter(loc.slug))
                        }}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-700">
                  Listing Type
                </label>
                <Select
                  value={filters.type}
                  onChange={(e) =>
                    dispatch(setListingTypeFilter(e.target.value as 'all' | 'rent' | 'sale'))
                  }
                  options={[
                    { value: 'all', label: 'All (Rent & Sale)' },
                    { value: 'rent', label: 'For Rent (Annual / Monthly)' },
                    { value: 'sale', label: 'For Sale (Outright)' },
                  ]}
                />
                <div className="mt-3">
                  <Counter
                    label="Minimum Bedrooms"
                    value={filters.beds}
                    onChange={(val) => dispatch(setBedsFilter(val))}
                  />
                </div>
              </div>

              <div>
                <RangeSlider
                  min={0}
                  max={150_000_000}
                  step={500_000}
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(range) => dispatch(setPriceRangeFilter(range))}
                  formatLabel={formatCompactNaira}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(resetSearchFilters())}
              >
                Reset all
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedSearchPanel(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon="search"
                  onClick={handleSearchSubmit}
                >
                  Search homes
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
