import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { StatCard } from '@/components/cards/StatCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { mapPropertyListingDtoToDomain } from '@/features/listings/api/mappers'
import { UseGetMarketplaceListingsQuery } from '@/services/queries'

export default function AdminView() {
  const navigate = useNavigate()
  const { marketplaceListingsData, marketplaceListingsIsLoading } =
    UseGetMarketplaceListingsQuery({ per_page: 50 })

  const listings = useMemo(
    () => (marketplaceListingsData?.data ?? []).map(mapPropertyListingDtoToDomain),
    [marketplaceListingsData],
  )

  const verifiedListerCount = useMemo(() => {
    const ids = new Set(listings.filter((l) => l.lister.verified).map((l) => l.lister.id))
    return ids.size
  }, [listings])

  const availableCount = listings.filter((l) => l.status === 'active').length

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        eyebrow="Platform Moderation"
        title="Oruvia Admin Marketplace Overview"
        subtitle="Inspect active marketplace listings and verified lister coverage."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon="home"
          label="Published Listings"
          value={listings.length}
        />
        <StatCard
          icon="verified"
          label="Verified Listers"
          value={verifiedListerCount}
        />
        <StatCard
          icon="check"
          label="Available Properties"
          value={availableCount}
        />
      </div>

      <SectionCard
        title="Marketplace Listings Snapshot"
        subtitle="Live properties returned by the Oruvia catalog."
      >
        {marketplaceListingsIsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyStateCard
            icon="home"
            title="No marketplace listings returned"
            description="No published properties were found in the catalog."
          />
        ) : (
          <div className="divide-y divide-line">
            {listings.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 py-3.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink-900">{item.title}</p>
                    {item.verified ? <VerifiedBadge compact /> : null}
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-ink-500">
                    {item.location} · Listed by {item.lister.name} ({item.lister.role})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({ to: '/listing/$listingId', params: { listingId: item.id } })
                    }
                  >
                    Inspect listing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  )
}

