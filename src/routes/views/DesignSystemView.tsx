import { useState } from 'react'
import {
  Card,
  EmptyStateCard,
  EmptyStateCardSkeleton,
  InspectionCard,
  InspectionCardSkeleton,
  ListerCard,
  ListerCardSkeleton,
  NotificationItem,
  NotificationItemSkeleton,
  PricingSummaryCard,
  PricingSummaryCardSkeleton,
  PropertyCard,
  PropertyCardSkeleton,
  ReviewCard,
  ReviewCardSkeleton,
  SectionCard,
  SectionCardSkeleton,
  StatCard,
  StatCardSkeleton,
  ThreadCard,
  ThreadCardSkeleton,
} from '@/components/cards'
import {
  ConfirmDialog,
  FilterChip,
  FormField,
  PageContainer,
  PriceTag,
  RatingSummary,
  ResponsiveSheet,
  SectionHeader,
  StatusBadge,
  VerifiedBadge,
} from '@/components/shared'
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Counter,
  Divider,
  FieldError,
  Icon,
  ICON_REGISTRY,
  IconButton,
  type IconName,
  Input,
  Label,
  LoadMore,
  Modal,
  Radio,
  RangeSlider,
  Rating,
  Select,
  Skeleton,
  Stepper,
  Switch,
  Tabs,
  Textarea,
  Tooltip,
} from '@/components/ui'
import { formatCompactNaira } from '@/lib/formatters'
import { useAppDispatch } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'
import type { Inspection, Listing, Notification, Review, Thread, UserProfile } from '@/types/domain'

const FIXTURE_LISTER: UserProfile = {
  id: 'ds-lister-1',
  name: 'Engr. Babatunde Kuti',
  email: 'kuti@oruvia.ng',
  phone: '+234 803 000 1122',
  role: 'landlord',
  verified: true,
  bio: 'Direct landlord of solar-powered residential apartments in Ibara Housing Estate, Abeokuta.',
  rating: 4.95,
  reviewCount: 31,
  responseRate: 99,
  responseTime: 'within 15 mins',
  joinedAt: '2024-03-01T00:00:00Z',
  listingsCount: 6,
}

const FIXTURE_LISTING: Listing = {
  id: 'ds-listing-1',
  title: 'Solar-Powered 3-Bedroom Terrace Duplex in Ibara GRA',
  type: 'rent',
  category: 'duplex',
  price: 2_800_000,
  pricePeriod: 'year',
  serviceCharge: 300_000,
  cautionFee: 200_000,
  agencyFeePercent: 0,
  location: 'Ibara Housing Estate GRA, Abeokuta, Ogun',
  neighbourhood: 'Ibara GRA',
  city: 'Abeokuta',
  state: 'Ogun',
  lat: 7.1475,
  lng: 3.3619,
  beds: 3,
  baths: 4,
  areaSqm: 240,
  description: 'Modern 3-bedroom terrace duplex with 24/7 solar inverter, treated borehole water, and gated security.',
  amenities: ['solar_inverter', 'borehole_water', 'gated_security', 'parking'],
  images: [
    {
      id: 'ds-img-1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      alt: 'Duplex exterior',
    },
    {
      id: 'ds-img-2',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      alt: 'Duplex lounge',
    },
  ],
  videoTourUrl: 'https://meet.google.com/oruvia-demo',
  verified: true,
  status: 'active',
  rating: 4.95,
  reviewCount: 31,
  createdAt: '2026-11-05T10:00:00Z',
  lister: FIXTURE_LISTER,
}

const FIXTURE_INSPECTION: Inspection = {
  id: 'ds-insp-1',
  listingId: 'ds-listing-1',
  listingTitle: FIXTURE_LISTING.title,
  listingImage: FIXTURE_LISTING.images[0]?.url ?? '',
  listingLocation: FIXTURE_LISTING.location,
  seekerId: 'ds-seeker-1',
  seekerName: 'Funke Akindele',
  seekerPhone: '+234 805 111 2233',
  listerId: FIXTURE_LISTER.id,
  listerName: FIXTURE_LISTER.name,
  listerRole: 'landlord',
  dateTime: '2026-11-18T11:00:00Z',
  mode: 'virtual',
  status: 'pending',
  note: 'Requesting live video inspection of the solar inverter battery bank.',
  createdAt: '2026-11-09T08:00:00Z',
}

const FIXTURE_THREAD: Thread = {
  id: 'ds-thr-1',
  listingId: 'ds-listing-1',
  listingTitle: FIXTURE_LISTING.title,
  listingImage: FIXTURE_LISTING.images[0]?.url ?? '',
  listingPrice: FIXTURE_LISTING.price,
  listingType: 'rent',
  participantId: FIXTURE_LISTER.id,
  participantName: FIXTURE_LISTER.name,
  participantRole: 'landlord',
  participantVerified: true,
  participantPhone: '+2348030001122',
  lastMessage: 'Saturday 11:00 AM works great for the inspection.',
  lastMessageAt: '2026-11-09T12:00:00Z',
  unreadCount: 2,
  messages: [],
}

const FIXTURE_REVIEW: Review = {
  id: 'ds-rev-1',
  reviewerId: 'ds-seeker-1',
  reviewerName: 'Yinka Odumakin',
  reviewerRole: 'seeker',
  targetUserId: FIXTURE_LISTER.id,
  listingTitle: FIXTURE_LISTING.title,
  rating: 5,
  comment: 'Direct landlord with zero inflated fees. Confirmed our virtual inspection in 10 minutes.',
  createdAt: '2026-11-02T10:00:00Z',
}

const FIXTURE_NOTIFICATION: Notification = {
  id: 'ds-notif-1',
  type: 'inspection_confirmed',
  title: 'Inspection Request Confirmed',
  body: 'Engr. Babatunde Kuti accepted your virtual tour request.',
  createdAt: '2026-11-09T11:30:00Z',
  read: false,
}

export default function DesignSystemView() {
  const dispatch = useAppDispatch()
  const [viewportMode, setViewportMode] = useState<'1280' | '375'>('1280')
  const [showSkeletons, setShowSkeletons] = useState(false)
  const [switchVal, setSwitchVal] = useState(true)
  const [counterVal, setCounterVal] = useState(3)
  const [rangeVal, setRangeVal] = useState<[number, number]>([1_500_000, 45_000_000])
  const [ratingVal, setRatingVal] = useState(5)
  const [tabId, setTabId] = useState('primitives')
  const [modalOpen, setModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        eyebrow="Oruvia Design System"
        title="Component Library & Token Showcase"
        subtitle="Airbnb-inspired Nigerian proptech UI system built on strict @theme tokens, offline Iconify registry, and 3 composable layers."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewportMode === '1280' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewportMode('1280')}
            >
              1280px Desktop
            </Button>
            <Button
              variant={viewportMode === '375' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewportMode('375')}
            >
              375px Mobile Preview
            </Button>
            <Button
              variant={showSkeletons ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowSkeletons((prev) => !prev)}
            >
              {showSkeletons ? 'Showing Skeletons' : 'Toggle Skeletons'}
            </Button>
          </div>
        }
      />

      <div
        className={
          viewportMode === '375'
            ? 'mx-auto max-w-[375px] rounded-[var(--radius-lg)] border-2 border-ink-900 p-4 shadow-[var(--shadow-sheet)] space-y-8 transition-all'
            : 'space-y-8 transition-all'
        }
      >
        <Tabs
          items={[
            { id: 'primitives', label: '1. UI Primitives' },
            { id: 'cards', label: '2. Card Layer & Skeletons' },
            { id: 'shared', label: '3. Shared Blocks & Icons' },
          ]}
          activeId={tabId}
          onChange={setTabId}
        />

        {/* 1. PRIMITIVES */}
        <SectionCard
          title="Layer 1: UI Primitives (src/components/ui)"
          subtitle="Buttons, Inputs, Selects, Toggles, Range Sliders, Steppers, Overlays, Badges, Avatars"
        >
          <div className="space-y-6">
            <div>
              <Label className="mb-2">Buttons (Variants & Sizes)</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon="search">
                  Primary Brand CTA
                </Button>
                <Button variant="secondary" leftIcon="calendar">
                  Secondary Outline
                </Button>
                <Button variant="outline" rightIcon="chevronRight">
                  Default Outline
                </Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="link">Underlined Link</Button>
                <Button variant="destructive" leftIcon="trash">
                  Destructive
                </Button>
                <Button variant="primary" size="sm" loading>
                  Loading
                </Button>
                <IconButton icon="heart" aria-label="Favourite" variant="surface" />
                <IconButton icon="share" aria-label="Share" variant="outline" />
              </div>
            </div>

            <Divider label="Form Controls & States" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label="Default Input" required hint="With left icon">
                {({ id }) => (
                  <Input id={id} leftIcon="location" defaultValue="Ibara GRA, Abeokuta" />
                )}
              </FormField>
              <FormField label="Error State Input" error="Please enter a valid Nigerian phone number">
                {({ id, hasError }) => (
                  <Input id={id} hasError={hasError} defaultValue="+234 000" />
                )}
              </FormField>
              <FormField label="Select Dropdown">
                {({ id }) => (
                  <Select
                    id={id}
                    options={[
                      { value: 'rent', label: 'For Rent (Annual)' },
                      { value: 'sale', label: 'For Sale (Outright)' },
                    ]}
                  />
                )}
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RangeSlider
                min={0}
                max={100_000_000}
                step={500_000}
                value={rangeVal}
                onChange={setRangeVal}
                formatLabel={formatCompactNaira}
              />
              <div className="space-y-3">
                <Counter
                  label="Bedrooms"
                  subtitle="Interactive +/- stepper"
                  value={counterVal}
                  onChange={setCounterVal}
                />
                <Switch
                  label="Oruvia Verified Only"
                  description="Native HTML switch attribute with Brand styling"
                  checked={switchVal}
                  onCheckedChange={setSwitchVal}
                />
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Checkbox label="24/7 Power" defaultChecked />
                  <Radio name="ds-radio" label="Physical Tour" defaultChecked />
                  <Radio name="ds-radio" label="Virtual Tour" />
                </div>
              </div>
            </div>

            <Divider label="Badges, Avatars, Ratings, Stepper & Overlays" />

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="brand">Brand Tint</Badge>
              <Badge variant="verified" icon="verified">
                Verified
              </Badge>
              <Badge variant="success" icon="check">
                Confirmed
              </Badge>
              <Badge variant="warning" icon="clock">
                Pending
              </Badge>
              <Badge variant="danger" icon="close">
                Declined
              </Badge>
              <Avatar name="Chief Folake Adeyemi" verified size="md" />
              <Avatar name="Tunde Bakare" size="sm" />
              <Rating value={ratingVal} onChange={setRatingVal} />
              <Tooltip content="ID verified by Oruvia">
                <span className="text-xs font-semibold underline cursor-help">
                  Hover for Tooltip
                </span>
              </Tooltip>
            </div>

            <Stepper
              steps={[
                { id: '1', label: 'Property Basics' },
                { id: '2', label: 'Amenities & Map' },
                { id: '3', label: 'Photos & Publish' },
              ]}
              currentStep={1}
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                Open Native Dialog Modal
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
                Open Responsive Sheet
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  dispatch(
                    addToast({
                      title: 'Design System Toast',
                      description: 'Triggered via Redux uiSlice.',
                      tone: 'success',
                    }),
                  )
                }
              >
                Trigger Toast
              </Button>
            </div>
          </div>
        </SectionCard>

        {/* 2. CARDS & SKELETONS */}
        <SectionCard
          title="Layer 2: Domain Cards & Skeleton Counterparts (src/components/cards)"
          subtitle="Toggle 'Toggle Skeletons' in the header above to inspect loading states vs populated states."
        >
          {showSkeletons ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <PropertyCardSkeleton />
                <PropertyCardSkeleton variant="compact" />
                <StatCardSkeleton />
              </div>
              <PropertyCardSkeleton variant="horizontal" />
              <InspectionCardSkeleton />
              <ThreadCardSkeleton />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ReviewCardSkeleton />
                <NotificationItemSkeleton />
              </div>
              <ListerCardSkeleton />
              <PricingSummaryCardSkeleton />
              <EmptyStateCardSkeleton />
              <SectionCardSkeleton />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <PropertyCard listing={FIXTURE_LISTING} isSaved />
                <div className="space-y-4">
                  <PropertyCard listing={FIXTURE_LISTING} variant="compact" />
                  <StatCard
                    icon="verified"
                    label="Verified Inquiries"
                    value="48"
                    delta="+18% this week"
                  />
                </div>
                <ReviewCard review={FIXTURE_REVIEW} />
              </div>

              <PropertyCard listing={FIXTURE_LISTING} variant="horizontal" />

              <InspectionCard inspection={FIXTURE_INSPECTION} viewerRole="lister" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ThreadCard thread={FIXTURE_THREAD} active />
                <NotificationItem notification={FIXTURE_NOTIFICATION} />
              </div>

              <ListerCard lister={FIXTURE_LISTER} />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <PricingSummaryCard listing={FIXTURE_LISTING} className="static" />
                <EmptyStateCard
                  icon="search"
                  title="Empty State Card"
                  description="Displayed when a search or filter returns zero matching properties."
                  actionLabel="Reset filters"
                  onAction={() => {}}
                />
              </div>
            </div>
          )}
        </SectionCard>

        {/* 3. SHARED BLOCKS & OFFLINE ICON REGISTRY */}
        <SectionCard
          title="Layer 3: Shared Composed Blocks & Offline Iconify Registry"
          subtitle="FilterChip, PriceTag, VerifiedBadge, StatusBadge (central map), RatingSummary, and all bundled icons."
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <FilterChip label="Ibara GRA" icon="location" active count={4} />
              <FilterChip label="24/7 Power" icon="power" />
              <PriceTag amount={3_500_000} period="year" size="md" />
              <PriceTag amount={38_000_000} period="total" compact size="md" />
              <VerifiedBadge />
              <StatusBadge status="active" />
              <StatusBadge status="confirmed" />
              <StatusBadge status="pending" />
              <StatusBadge status="rescheduled" />
              <StatusBadge status="declined" />
              <RatingSummary rating={4.95} reviewCount={31} />
            </div>

            <Divider label="Offline Pre-Bundled Icon Registry (src/components/ui/icons.ts)" />

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-9">
              {(Object.keys(ICON_REGISTRY) as IconName[]).map((name) => (
                <div
                  key={name}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-line p-2.5 text-center"
                >
                  <Icon name={name} size={20} className="text-ink-900" />
                  <span className="truncate w-full text-[11px] font-medium text-ink-500">
                    {name}
                  </span>
                </div>
              ))}
            </div>

            <Textarea placeholder="Sample Textarea primitive..." rows={2} />
            <FieldError message="Sample FieldError message component" />
            <Skeleton className="h-6 w-48" />
            <LoadMore hasMore shownCount={8} totalCount={24} onLoadMore={() => {}} />
            <Card variant="outlined" padding="sm">
              <p className="text-xs text-ink-500">Base polymorphic Card primitive</p>
            </Card>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Native HTML Dialog Modal"
        description="Uses showModal() and top-layer backdrop with overscroll-behavior: contain."
      >
        <p className="text-sm text-ink-700">
          Press Esc or click outside the dialog to dismiss.
        </p>
      </Modal>

      <ResponsiveSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Responsive Sheet"
        description="Renders a Modal on desktop and a slide-up BottomSheet on mobile (<768px)."
      >
        <p className="text-sm text-ink-700">
          Resize your browser below 768px to see this transform into a mobile bottom sheet.
        </p>
      </ResponsiveSheet>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Confirm Action"
        description="Are you sure you want to mark this property as rented?"
      />
    </PageContainer>
  )
}

