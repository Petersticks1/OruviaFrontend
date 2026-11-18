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
import { KycRequiredModal } from '@/components/shared/KycRequiredModal'
import { PageContainer } from '@/components/shared/PageContainer'
import { PriceTag } from '@/components/shared/PriceTag'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { AMENITIES_CATALOG } from '@/lib/constants'
import { formatNaira } from '@/lib/formatters'
import { mapPropertyListingDtoToDomain } from '@/features/listings/api/mappers'
import {
  UseDeleteAgentListingMutation,
  UseDeleteLandlordListingMutation,
  UseUpdateAgentListingAvailabilityMutation,
  UseUpdateLandlordListingAvailabilityMutation,
} from '@/services/mutations'
import {
  UseGetAgentKycQuery,
  UseGetAgentListingsQuery,
  UseGetLandlordKycQuery,
  UseGetLandlordListingsQuery,
} from '@/services/queries'
import { useAppSelector } from '@/store/hooks'
import type { Listing } from '@/types/domain'

const dashboardTableFeatures = tableFeatures({})

export default function DashboardView() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const isLandlord = user?.role === 'landlord'
  const isAgent = user?.role === 'agent'
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null)
  const [viewTarget, setViewTarget] = useState<Listing | null>(null)
  const [kycModalOpen, setKycModalOpen] = useState(false)

  const { agentKycData } = UseGetAgentKycQuery(isAgent && !!user)
  const { landlordKycData } = UseGetLandlordKycQuery(isLandlord && !!user)
  const kycData = isLandlord ? landlordKycData : agentKycData
  const isVerified = Boolean(kycData?.data?.is_verified ?? user?.verified)

  const handleCreateListingClick = () => {
    if (!isVerified) {
      setKycModalOpen(true)
      return
    }
    navigate({ to: '/dashboard/listings/new' })
  }

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
        <div className="whitespace-nowrap">
          <PriceTag
            amount={info.row.original.price}
            period={info.row.original.pricePeriod}
            compact
            size="sm"
          />
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (info) => (
        <div className="whitespace-nowrap">
          <StatusBadge status={info.row.original.status} />
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Quick Actions',
      cell: (info) => {
        const row = info.row.original
        const isAvailable = row.availabilityStatus === 'available' || row.status === 'active'
        return (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Button
              variant="ghost"
              size="sm"
              leftIcon="eye"
              onClick={() => setViewTarget(row)}
            >
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon="edit"
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
              leftIcon={isAvailable ? 'check' : 'plus'}
              disabled={isMutatingAvailability}
              onClick={() => handleToggleAvailability(row)}
            >
              {isAvailable ? (row.type === 'rent' ? 'Mark Rented' : 'Mark Sold') : 'Reactivate'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon="trash"
              className="text-danger hover:bg-danger/10 hover:text-danger"
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
              onClick={handleCreateListingClick}
            >
              Create new listing
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards computed from real lister data */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
            onAction={handleCreateListingClick}
          />
        ) : (
          <>
            {/* Mobile & Tablet Card View */}
            <div className="space-y-3 lg:hidden">
              {listings.map((row) => {
                const isAvailable =
                  row.availabilityStatus === 'available' || row.status === 'active'
                return (
                  <div
                    key={row.id}
                    className="rounded-[var(--radius-md)] border border-line bg-surface p-3.5 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {row.images[0]?.url ? (
                        <img
                          src={row.images[0].url}
                          alt={row.title}
                          width={72}
                          height={56}
                          className="h-14 w-18 rounded-[var(--radius-sm)] object-cover shrink-0 bg-surface-muted"
                        />
                      ) : (
                        <div className="h-14 w-18 rounded-[var(--radius-sm)] bg-surface-muted shrink-0 flex items-center justify-center text-ink-400">
                          <Icon name="home" size={20} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-ink-900 line-clamp-1">
                            {row.title}
                          </p>
                          <div className="shrink-0">
                            <StatusBadge status={row.status} />
                          </div>
                        </div>
                        <p className="text-xs text-ink-500 line-clamp-1">{row.location}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                          <PriceTag
                            amount={row.price}
                            period={row.pricePeriod}
                            compact
                            size="sm"
                          />
                          <span className="text-xs text-ink-500">
                            {row.beds} bd · {row.baths} ba
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-line pt-3 sm:flex sm:flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon="eye"
                        onClick={() => setViewTarget(row)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon="edit"
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
                        leftIcon={isAvailable ? 'check' : 'plus'}
                        disabled={isMutatingAvailability}
                        onClick={() => handleToggleAvailability(row)}
                      >
                        {isAvailable
                          ? row.type === 'rent'
                            ? 'Mark Rented'
                            : 'Mark Sold'
                          : 'Reactivate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon="trash"
                        className="text-danger hover:bg-danger/10 hover:text-danger"
                        onClick={() => setDeleteTarget(row)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
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
          </>
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

      <KycRequiredModal
        open={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onVerifiedContinue={() => navigate({ to: '/dashboard/listings/new' })}
      />

      <Modal
        open={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.title ?? 'Property Details'}
        description={viewTarget?.location}
        size="lg"
        footer={
          viewTarget ? (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <Button variant="ghost" onClick={() => setViewTarget(null)}>
                Close
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  leftIcon="chevronRight"
                  onClick={() => {
                    const id = viewTarget.id
                    setViewTarget(null)
                    navigate({ to: '/listings/$listingId', params: { listingId: id } })
                  }}
                >
                  Public Page
                </Button>
                <Button
                  variant="primary"
                  leftIcon="edit"
                  onClick={() => {
                    const id = viewTarget.id
                    setViewTarget(null)
                    navigate({
                      to: '/dashboard/listings/$listingId/edit',
                      params: { listingId: id },
                    })
                  }}
                >
                  Edit Property
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {viewTarget ? (
          <div className="space-y-5">
            {viewTarget.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {viewTarget.images.slice(0, 6).map((img, idx) => (
                  <img
                    key={`${img.url}-${idx}`}
                    src={img.url}
                    alt={`${viewTarget.title} photo ${idx + 1}`}
                    className="aspect-[4/3] w-full rounded-[var(--radius-sm)] object-cover border border-line bg-surface-muted"
                  />
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3.5">
              <PriceTag
                amount={viewTarget.price}
                period={viewTarget.pricePeriod}
                size="md"
              />
              <StatusBadge status={viewTarget.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
              <div className="rounded-[var(--radius-sm)] border border-line p-3">
                <p className="text-ink-500">Bedrooms</p>
                <p className="mt-0.5 font-bold text-ink-900">{viewTarget.beds}</p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-line p-3">
                <p className="text-ink-500">Bathrooms</p>
                <p className="mt-0.5 font-bold text-ink-900">{viewTarget.baths}</p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-line p-3">
                <p className="text-ink-500">Toilets</p>
                <p className="mt-0.5 font-bold text-ink-900">{viewTarget.toilets ?? 0}</p>
              </div>
            </div>

            {viewTarget.address ? (
              <div className="text-xs">
                <p className="font-semibold text-ink-900">Address</p>
                <p className="mt-0.5 text-ink-600">{viewTarget.address}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-[var(--radius-sm)] bg-surface-muted/50 p-2.5">
                <p className="text-ink-500">Agency Fee</p>
                <p className="font-semibold text-ink-900">
                  {formatNaira(viewTarget.agencyFee ?? 0)}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted/50 p-2.5">
                <p className="text-ink-500">Legal Fee</p>
                <p className="font-semibold text-ink-900">
                  {formatNaira(viewTarget.legalFee ?? 0)}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted/50 p-2.5">
                <p className="text-ink-500">Caution Fee</p>
                <p className="font-semibold text-ink-900">
                  {formatNaira(viewTarget.cautionFee ?? 0)}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-surface-muted/50 p-2.5">
                <p className="text-ink-500">Service Charge</p>
                <p className="font-semibold text-ink-900">
                  {formatNaira(viewTarget.serviceCharge ?? 0)}
                </p>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-semibold text-ink-900">Description</p>
              <p className="leading-relaxed text-ink-600">{viewTarget.description}</p>
            </div>

            {viewTarget.amenities.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-ink-900">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewTarget.amenities.map((amenity) => {
                    const label =
                      amenity in AMENITIES_CATALOG
                        ? AMENITIES_CATALOG[amenity as keyof typeof AMENITIES_CATALOG].label
                        : amenity
                    return (
                      <span
                        key={amenity}
                        className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </PageContainer>
  )
}
