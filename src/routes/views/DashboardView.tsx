import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { InspectionCard } from '@/components/cards/InspectionCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { StatCard } from '@/components/cards/StatCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { PriceTag } from '@/components/shared/PriceTag'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/Button'
import {
  inspectionsQueryOptions,
  listingsQueryOptions,
} from '@/features/listings/api/queries'
import { useAppDispatch } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'
import type { Listing, ListingStatus } from '@/types/domain'

const dashboardTableFeatures = tableFeatures({})

export default function DashboardView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: initialListings = [] } = useQuery(listingsQueryOptions())
  const { data: inspections = [] } = useQuery(inspectionsQueryOptions())
  const [statusMap, setStatusMap] = useState<Record<string, ListingStatus>>({})

  const listings: Listing[] = initialListings.map((item) => ({
    ...item,
    status: statusMap[item.id] ?? item.status,
  }))

  const columns: ColumnDef<typeof dashboardTableFeatures, Listing>[] = [
    {
      id: 'property',
      header: 'Property',
      cell: (info) => {
        const row = info.row.original
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.images[0]?.url}
              alt={row.title}
              width={56}
              height={42}
              className="h-10 w-14 rounded object-cover shrink-0"
            />
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
              onClick={() => {
                const nextStatus: ListingStatus =
                  row.status === 'active'
                    ? row.type === 'rent'
                      ? 'rented'
                      : 'sold'
                    : 'active'
                setStatusMap((prev) => ({ ...prev, [row.id]: nextStatus }))
                dispatch(
                  addToast({
                    title: `Listing marked as ${nextStatus.toUpperCase()}`,
                    description: row.title,
                    tone: 'success',
                  }),
                )
              }}
            >
              {row.status === 'active'
                ? row.type === 'rent'
                  ? 'Mark Rented'
                  : 'Mark Sold'
                : 'Reactivate'}
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

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        eyebrow="Lister Control Center"
        title="Agent & Landlord Dashboard"
        subtitle="Manage your verified properties, confirm inspection appointments, and respond to qualified leads."
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon="plus"
            onClick={() => navigate({ to: '/dashboard/listings/new' })}
          >
            Create new listing
          </Button>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="home"
          label="Active Listings"
          value={listings.filter((l) => l.status === 'active').length}
          delta="+2 this week"
        />
        <StatCard
          icon="calendar"
          label="Inspection Requests"
          value={inspections.length}
          delta="98% response rate"
        />
        <StatCard
          icon="eye"
          label="30-Day Listing Views"
          value="1,480"
          delta="+24% vs last month"
        />
        <StatCard
          icon="verified"
          label="Trust Score"
          value="4.94 ★"
          delta="ID Verified Lister"
        />
      </div>

      {/* TanStack Table for Listings Management */}
      <SectionCard
        title="Your Published Properties"
        subtitle="Edit details, update availability (Rented/Sold), or preview your listings."
      >
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
      </SectionCard>

      {/* Upcoming Inspections */}
      <SectionCard
        title="Recent Inspection Requests"
        subtitle="Confirm or reschedule physical and virtual tours in one click."
      >
        <div className="space-y-3">
          {inspections.map((insp) => (
            <InspectionCard
              key={insp.id}
              inspection={insp}
              viewerRole="lister"
              onUpdateStatus={(_, status) =>
                dispatch(
                  addToast({
                    title: `Inspection ${status}`,
                    description: 'Seeker notified via SMS & in-app alert.',
                    tone: 'success',
                  }),
                )
              }
            />
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  )
}
