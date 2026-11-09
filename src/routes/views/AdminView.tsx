import { useQuery } from '@tanstack/react-query'
import { SectionCard } from '@/components/cards/SectionCard'
import { StatCard } from '@/components/cards/StatCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { listingsQueryOptions } from '@/features/listings/api/queries'
import { useAppDispatch } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'

export default function AdminView() {
  const dispatch = useAppDispatch()
  const { data: listings = [] } = useQuery(listingsQueryOptions())

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        eyebrow="Platform Moderation"
        title="Oruvia Admin Trust & Verification Queue"
        subtitle="Approve agent/landlord NIN documents, audit flagged listings, and protect seekers from scams."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon="verified"
          label="Verified Listers"
          value="142"
          delta="100% ID checked"
        />
        <StatCard
          icon="clock"
          label="Pending ID Approvals"
          value="4"
          delta="Avg review: 18m"
        />
        <StatCard
          icon="report"
          label="Flagged Listings"
          value="0"
          delta="Zero active scams"
        />
      </div>

      <SectionCard
        title="Listing Verification & Moderation Queue"
        subtitle="Verify C of O / survey plans or suspend non-compliant listings."
      >
        <div className="divide-y divide-line">
          {listings.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 py-3.5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-900">{item.title}</p>
                  <VerifiedBadge compact />
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
                    dispatch(
                      addToast({
                        title: 'Verification confirmed',
                        description: `${item.title} remains Verified.`,
                        tone: 'success',
                      }),
                    )
                  }
                >
                  Re-verify Title
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  )
}

