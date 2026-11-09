import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SectionCard } from '@/components/cards/SectionCard'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Stepper } from '@/components/ui/Stepper'
import { Textarea } from '@/components/ui/Textarea'
import { AMENITIES_CATALOG, PROPERTY_CATEGORIES } from '@/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setDraftStep, updateListingDraft } from '@/store/slices/listingDraftSlice'
import { addToast } from '@/store/slices/uiSlice'
import type { AmenityKey } from '@/types/domain'

const listingSchema = z.object({
  title: z.string().min(8, 'Title must be at least 8 characters'),
  type: z.enum(['rent', 'sale']),
  category: z.enum([
    'apartment',
    'duplex',
    'bungalow',
    'self-contain',
    'land',
    'office',
    'shop',
  ]),
  price: z.number().min(50_000, 'Price must be at least ₦50,000'),
  location: z.string().min(4, 'Enter neighbourhood and city'),
  beds: z.number().min(0).max(20),
  baths: z.number().min(0).max(20),
  areaSqm: z.number().min(10, 'Area must be at least 10 sqm'),
  description: z.string().min(20, 'Please write a helpful description (at least 20 chars)'),
})

type ListingFormValues = z.infer<typeof listingSchema>

const WIZARD_STEPS = [
  { id: 'basics', label: 'Property Basics', description: 'Title, type & Naira price' },
  { id: 'specs', label: 'Location & Amenities', description: 'Rooms, power & security' },
  { id: 'media', label: 'Photos & Publish', description: '3–10 photos & virtual tour' },
] as const

export default function ListingEditorView() {
  const params = useParams({ strict: false }) as { listingId?: string }
  const isEditing = Boolean(params.listingId)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.listingDraft)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: draft.title || (isEditing ? 'Contemporary 4-Bedroom Detached Duplex with BQ' : ''),
      type: draft.type,
      category: draft.category,
      price: draft.price,
      location: draft.location,
      beds: draft.beds,
      baths: draft.baths,
      areaSqm: draft.areaSqm,
      description:
        draft.description ||
        (isEditing
          ? 'Newly built architectural duplex in serene Ibara GRA, Abeokuta with 10kVA solar inverter.'
          : ''),
    },
  })

  const onSubmit = (values: ListingFormValues) => {
    dispatch(updateListingDraft(values))
    dispatch(
      addToast({
        title: isEditing ? 'Listing updated!' : 'Listing published in under 3 minutes!',
        description: `"${values.title}" is now live with your Oruvia Verified badge.`,
        tone: 'success',
      }),
    )
    navigate({ to: '/dashboard' })
  }

  return (
    <PageContainer narrow className="py-8 space-y-6">
      <SectionHeader
        eyebrow={isEditing ? 'Edit Property' : 'Publish Under 3 Minutes'}
        title={isEditing ? 'Update Listing Details' : 'List a Verified Property on Oruvia'}
        subtitle="Reach serious renters and buyers across Ogun and Lagos with zero middleman friction."
      />

      <Stepper
        steps={WIZARD_STEPS}
        currentStep={draft.step}
        onStepClick={(idx) => dispatch(setDraftStep(idx))}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <SectionCard
          title="1. Property Details & Naira Pricing"
          subtitle="Be transparent about annual rent or total sale price."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Property Title"
              required
              error={errors.title?.message}
              className="sm:col-span-2"
            >
              {({ id, hasError }) => (
                <Input
                  id={id}
                  hasError={hasError}
                  placeholder="e.g. Newly Built 3-Bedroom Flat with Solar Inverter in Ibara GRA"
                  {...register('title')}
                />
              )}
            </FormField>

            <FormField label="Listing Type" required error={errors.type?.message}>
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  options={[
                    { value: 'rent', label: 'For Rent (₦ / year)' },
                    { value: 'sale', label: 'For Sale (₦ total)' },
                  ]}
                  {...register('type')}
                />
              )}
            </FormField>

            <FormField label="Property Category" required error={errors.category?.message}>
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  options={PROPERTY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
                    value: c.id,
                    label: c.label,
                  }))}
                  {...register('category')}
                />
              )}
            </FormField>

            <FormField label="Price (₦ NGN)" required error={errors.price?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('price', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Location / Estate" required error={errors.location?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  leftIcon="location"
                  hasError={hasError}
                  placeholder="Ibara GRA, Abeokuta, Ogun"
                  {...register('location')}
                />
              )}
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          title="2. Rooms, Floor Area & Estate Amenities"
          subtitle="Highlight power backup, borehole water, and gated security."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Bedrooms" error={errors.beds?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('beds', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Bathrooms" error={errors.baths?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('baths', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Size (SQM)" required error={errors.areaSqm?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('areaSqm', { valueAsNumber: true })}
                />
              )}
            </FormField>
          </div>

          <div className="mt-4">
            <FormField
              label="Detailed Description"
              required
              error={errors.description?.message}
            >
              {({ id, hasError }) => (
                <Textarea
                  id={id}
                  hasError={hasError}
                  placeholder="Describe power hours, road accessibility, landlord terms, and nearby landmarks..."
                  {...register('description')}
                />
              )}
            </FormField>
          </div>

          <div className="mt-4">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-700">
              Select Available Amenities
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {(Object.keys(AMENITIES_CATALOG) as AmenityKey[]).map((key) => {
                const item = AMENITIES_CATALOG[key]
                const checked = draft.amenities.includes(key)
                return (
                  <Checkbox
                    key={key}
                    label={item.label}
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? draft.amenities.filter((a) => a !== key)
                        : [...draft.amenities, key]
                      dispatch(updateListingDraft({ amenities: next }))
                    }}
                  />
                )
              })}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="3. Property Photos & Virtual Tour Link"
          subtitle="Listings with at least 3 bright photos and a video tour link get 4× more inspection requests."
          footer={
            <>
              <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" leftIcon="check">
                {isEditing ? 'Save changes' : 'Publish verified listing'}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-3 gap-3">
            {draft.photoUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Upload preview ${idx + 1}`}
                width={240}
                height={160}
                className="aspect-[4/3] w-full rounded-[var(--radius-sm)] object-cover border border-line"
              />
            ))}
          </div>
        </SectionCard>
      </form>
    </PageContainer>
  )
}

