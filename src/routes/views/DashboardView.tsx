import { useNavigate } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { StatCard } from '@/components/cards/StatCard'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageContainer } from '@/components/shared/PageContainer'
import { PriceTag } from '@/components/shared/PriceTag'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { mapPropertyListingDtoToDomain } from '@/features/listings/api/mappers'
import {
  UseDeleteAgentListingMutation,
  UseDeleteLandlordListingMutation,
  UseUpdateAgentListingAvailabilityMutation,
  UseUpdateLandlordListingAvailabilityMutation,
} from '@/services/mutations'
import { UseGetAgentListingsQuery, UseGetLandlordListingsQuery } from '@/services/queries'
import { useAppSelector } from '@/store/hooks'
import type { Listing } from '@/types/domain'

const dashboardTableFeatures = tableFeatures({})

export default function DashboardView() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const isLandlord = user?.role === 'landlord'
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null)

  const { agentListingsData, agentListingsIsLoading } = UseGetAgentListingsQuery(
    undefined,
    !isLandlord && !!user,
  )
  const { landlordListingsData, landlordListingsIsLoading } = UseGetLandlordListingsQuery(
    undefined,
    isLandlord && !!user,
  )

  const {
    updateAgentListingAvailabilityIsPending,
    updateAgentListingAvailabilityMutationAsync,
  } = UseUpdateAgentListingAvailabilityMutation()
  const {
    updateLandlordListingAvailabilityIsPending,
    updateLandlordListingAvailabilityMutationAsync,
  } = UseUpdateLandlordListingAvailabilityMutation()

  const { deleteAgentListingIsPending, deleteAgentListingMutationAsync } =
    UseDeleteAgentListingMutation()
  const { deleteLandlordListingIsPending, deleteLandlordListingMutationAsync } =
    UseDeleteLandlordListingMutation()

  const isLoading = isLandlord ? landlordListingsIsLoading : agentListingsIsLoading
  const isMutatingAvailability =
    updateAgentListingAvailabilityIsPending || updateLandlordListingAvailabilityIsPending
  const isDeleting = deleteAgentListingIsPending || deleteLandlordListingIsPending

  const listings: Listing[] = useMemo(() => {
    const raw = isLandlord ? landlordListingsData?.data ?? [] : agentListingsData?.data ?? []
    return raw.map(mapPropertyListingDtoToDomain)
  }, [isLandlord, landlordListingsData, agentListingsData])

  const handleToggleAvailability = async (row: Listing) => {
    const nextAvailability =
      row.availabilityStatus === 'available' || row.status === 'active'
        ? row.type === 'rent'
          ? 'rented'
          : 'sold'
        : 'available'

    try {
      if (isLandlord) {
        await updateLandlordListingAvailabilityMutationAsync({
          id: row.id,
          payload: { availability_status: nextAvailability },
        })
      } else {
        await updateAgentListingAvailabilityMutationAsync({
          id: row.id,
          payload: { availability_status: nextAvailability },
        })
      }
    } catch {
      // Handled by mutation hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      if (isLandlord) {
        await deleteLandlordListingMutationAsync(deleteTarget.id)
      } else {
        await deleteAgentListingMutationAsync(deleteTarget.id)
      }
      setDeleteTarget(null)
    } catch {
      // Handled by mutation hook
    }
  }

  const columns: ColumnDef<typeof dashboardTableFeatures, Listing>[] = [
    {
      id: 'property',
      header: 'Property',
      cell: (info) => {
        const row = info.row.original
        return (
          <div className="flex items-center gap-3">
            {row.images[0]?.url ? (
              <img
                src={row.images[0].url}
                alt={row.title}
                width={56}
                height={42}
                className="h-10 w-14 rounded object-cover shrink-0 bg-surface-muted"
              />
            ) : (
              <div className="h-10 w-14 rounded bg-surface-muted shrink-0" />
            )}
            <div>
              <p className="font-semibold text-ink-900">{row.title}</p>
              <p className="text-xs text-ink-500">{row.location}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: 'price',
      header: 'Price',
      cell: (info) => (
        <PriceTag
          amount={info.row.original.price}
          period={info.row.original.pricePeriod}
          compact
          size="sm"
        />
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (info) => <StatusBadge status={info.row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Quick Actions',
      cell: (info) => {
        const row = info.row.original
        const isAvailable = row.availabilityStatus === 'available' || row.status === 'active'
        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({
                  to: '/dashboard/listings/$listingId/edit',
                  params: { listingId: row.id },
                })
              }
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isMutatingAvailability}
              onClick={() => handleToggleAvailability(row)}
            >
              {isAvailable ? (row.type === 'rent' ? 'Mark Rented' : 'Mark Sold') : 'Reactivate'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-danger-600 hover:text-danger-700"
              onClick={() => setDeleteTarget(row)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useTable({
    features: dashboardTableFeatures,
    data: listings,
    columns,
  })

  const availableCount = listings.filter(
    (l) => l.availabilityStatus === 'available' || l.status === 'active',
  ).length
  const pendingReviewCount = listings.filter(
    (l) => l.moderationStatus === 'pending_review' || l.status === 'pending_review',
  ).length
  const closedCount = listings.filter(
    (l) => l.availabilityStatus === 'rented' || l.availabilityStatus === 'sold',
  ).length

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        eyebrow="Lister Control Center"
        title={isLandlord ? 'Direct Landlord Dashboard' : 'Agent Dashboard'}
        subtitle="Manage your published properties, availability status, and verification progress."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon="verified"
              onClick={() => navigate({ to: '/verify' })}
            >
              KYC Verification
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon="plus"
              onClick={() => navigate({ to: '/dashboard/listings/new' })}
            >
              Create new listing
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards computed from real lister data */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="home" label="Total Listings" value={listings.length} />
        <StatCard icon="check" label="Available" value={availableCount} />
        <StatCard icon="clock" label="Pending Review" value={pendingReviewCount} />
        <StatCard
          icon="verified"
          label="Rented / Sold"
          value={closedCount}
          delta={user?.verified ? 'Verified Lister' : 'Verification pending'}
        />
      </div>

      {/* TanStack Table for Listings Management */}
      <SectionCard
        title="Your Published Properties"
        subtitle="Edit details, update availability (Rented/Sold), or delete outdated listings."
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyStateCard
            icon="home"
            title="You haven't published any listings yet"
            description="Create your first property listing to reach verified seekers on Oruvia."
            actionLabel="Create new listing"
            onAction={() => navigate({ to: '/dashboard/listings/new' })}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs font-bold uppercase tracking-wider text-ink-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="pb-3 pr-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-line">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-muted/50">
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="py-3.5 pr-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete listing?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.title}" from your Oruvia portfolio?`
            : ''
        }
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete listing'}
        destructive
      />
    </PageContainer>
  )
}
