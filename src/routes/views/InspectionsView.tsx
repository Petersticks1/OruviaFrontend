import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Tabs } from '@/components/ui/Tabs'
import { useAppSelector } from '@/store/hooks'

export default function InspectionsView() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [activeTab, setActiveTab] = useState('all')

  const viewerRole =
    user?.role === 'agent' || user?.role === 'landlord' ? 'lister' : 'seeker'

  return (
    <PageContainer className="py-8 space-y-6">
      <SectionHeader
        eyebrow="Structured Inspection Booking"
        title="Property Inspections"
        subtitle={
          viewerRole === 'lister'
            ? 'Accept, reschedule, or launch virtual video tours with verified seekers.'
            : 'Track your physical visits and live video inspection links.'
        }
      />

      <Tabs
        items={[
          { id: 'all', label: 'All requests', badge: 0 },
          { id: 'pending', label: 'Pending' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'rescheduled', label: 'Rescheduled' },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      <EmptyStateCard
        icon="calendar"
        title="No scheduled inspections yet"
        description="Browse verified listings and contact agents or landlords directly to arrange physical or virtual inspections."
        actionLabel="Browse listings"
        onAction={() => navigate({ to: '/' })}
      />
    </PageContainer>
  )
}

