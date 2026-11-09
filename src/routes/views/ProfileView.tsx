import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ListerCard } from '@/components/cards/ListerCard'
import { PropertyCard } from '@/components/cards/PropertyCard'
import { ReviewCard } from '@/components/cards/ReviewCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { PageContainer } from '@/components/shared/PageContainer'
import {
  listingsQueryOptions,
  reviewsQueryOptions,
} from '@/features/listings/api/queries'
import { DEMO_USERS } from '@/store/slices/authSlice'

export default function ProfileView() {
  const { userId } = useParams({ strict: false }) as { userId: string }
  const navigate = useNavigate()
  const { data: listings = [] } = useQuery(listingsQueryOptions())
  const { data: reviews = [] } = useQuery(reviewsQueryOptions())

  const profile =
    Object.values(DEMO_USERS).find((u) => u.id === userId) ?? DEMO_USERS.agent

  const userListings = listings.filter((l) => l.lister.id === profile.id)
  const displayListings = userListings.length > 0 ? userListings : listings.slice(0, 4)

  return (
    <PageContainer className="py-8 space-y-8">
      <ListerCard
        lister={profile}
        onContact={() => navigate({ to: '/inbox' })}
        onWhatsApp={() =>
          window.open(`https://wa.me/${profile.phone.replace(/\s+/g, '')}`, '_blank')
        }
      />

      <SectionCard
        title={`Active Listings by ${profile.name}`}
        subtitle="All properties verified by Oruvia Trust & Safety"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              onSelect={(id) =>
                navigate({ to: '/listing/$listingId', params: { listingId: id } })
              }
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Verified Seeker Reviews"
        subtitle="Ratings from completed physical and virtual property inspections"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  )
}

