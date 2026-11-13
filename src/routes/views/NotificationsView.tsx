import { useNavigate } from '@tanstack/react-router'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'

export default function NotificationsView() {
  const navigate = useNavigate()

  return (
    <PageContainer narrow className="py-8 space-y-6">
      <SectionHeader
        eyebrow="Activity Center"
        title="Notifications"
        subtitle="Account activity, verification updates, and listing alerts will appear here."
      />

      <EmptyStateCard
        icon="bell"
        title="You're all caught up"
        description="There are no unread notifications right now."
        actionLabel="Explore listings"
        onAction={() => navigate({ to: '/' })}
      />
    </PageContainer>
  )
}

