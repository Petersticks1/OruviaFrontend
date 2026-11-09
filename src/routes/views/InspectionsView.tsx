import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { InspectionCard } from '@/components/cards/InspectionCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Tabs } from '@/components/ui/Tabs'
import { inspectionsQueryOptions } from '@/features/listings/api/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'
import type { InspectionStatus } from '@/types/domain'

export default function InspectionsView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { data: initialInspections = [] } = useQuery(inspectionsQueryOptions())

  const [statusOverrides, setStatusOverrides] = useState<Record<string, InspectionStatus>>({})
  const [activeTab, setActiveTab] = useState('all')

  const viewerRole =
    user?.role === 'agent' || user?.role === 'landlord' ? 'lister' : 'seeker'

  const inspections = initialInspections.map((item) => ({
    ...item,
    status: statusOverrides[item.id] ?? item.status,
  }))

  const filtered =
    activeTab === 'all'
      ? inspections
      : inspections.filter((item) => item.status === activeTab)

  const handleUpdateStatus = (inspectionId: string, nextStatus: InspectionStatus) => {
    setStatusOverrides((prev) => ({ ...prev, [inspectionId]: nextStatus }))
    dispatch(
      addToast({
        title: `Inspection ${nextStatus}`,
        description: `Status updated to "${nextStatus}" with instant in-app notification.`,
        tone: 'success',
      }),
    )
  }

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
          { id: 'all', label: 'All requests', badge: inspections.length },
          { id: 'pending', label: 'Pending' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'rescheduled', label: 'Rescheduled' },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {filtered.length === 0 ? (
        <EmptyStateCard
          icon="calendar"
          title="No inspections in this tab"
          description="Request a physical or live virtual tour on any listing to schedule an inspection."
          actionLabel="Browse listings"
          onAction={() => navigate({ to: '/' })}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((insp) => (
            <InspectionCard
              key={insp.id}
              inspection={insp}
              viewerRole={viewerRole}
              onUpdateStatus={handleUpdateStatus}
              onSelectListing={(listingId) =>
                navigate({ to: '/listing/$listingId', params: { listingId } })
              }
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

