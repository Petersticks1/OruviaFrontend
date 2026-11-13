import { useNavigate } from '@tanstack/react-router'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'

export default function InboxView() {
  const navigate = useNavigate()

  return (
    <PageContainer className="py-8 space-y-6">
      <SectionHeader
        eyebrow="In-App Messaging"
        title="Messages & Property Inquiries"
        subtitle="Direct messaging and WhatsApp handoff with verified landlords and agents."
      />

      <EmptyStateCard
        icon="chat"
        title="No active conversations yet"
        description="Open any verified listing to contact its landlord or agent via WhatsApp or submit an inquiry."
        actionLabel="Explore listings"
        onAction={() => navigate({ to: '/' })}
      />
    </PageContainer>
  )
}

