import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
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
import { Skeleton } from '@/components/ui/Skeleton'
import { Stepper } from '@/components/ui/Stepper'
import { Textarea } from '@/components/ui/Textarea'
import { AMENITIES_CATALOG } from '@/lib/constants'
import {
  UseCreateAgentListingMutation,
  UseCreateLandlordListingMutation,
  UseUpdateAgentListingMutation,
  UseUpdateLandlordListingMutation,
  UseUploadAgentListingMediaMutation,
  UseUploadLandlordListingMediaMutation,
} from '@/services/mutations'
import {
  UseGetAgentListingByIdQuery,
  UseGetLandlordListingByIdQuery,
  UseGetLocationsQuery,
  UseGetPropertyTypesQuery,
} from '@/services/queries'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  resetListingDraft,
  setDraftStep,
  updateListingDraft,
} from '@/store/slices/listingDraftSlice'
import { addToast } from '@/store/slices/uiSlice'
import type { AmenityKey } from '@/types/domain'

const listingSchema = z.object({
  title: z.string().min(8, 'Title must be at least 8 characters'),
  classification: z.enum(['rent', 'sale']),
  property_type_id: z.string().min(1, 'Select a property type'),
  state_id: z.string().min(1, 'Select a state'),
  city_id: z.string().min(1, 'Select a city'),
  area: z.string().min(2, 'Enter the neighbourhood or area'),
  address: z.string().min(5, 'Enter the street address or landmark'),
  base_price: z.number().min(1000, 'Price must be greater than ₦1,000'),
  payment_frequency: z.enum(['yearly', 'monthly', 'one_time']),
  agency_fee: z.number().min(0),
  legal_fee: z.number().min(0),
  caution_fee: z.number().min(0),
  service_charge: z.number().min(0),
  bedrooms: z.number().min(0).max(30),
  bathrooms: z.number().min(0).max(30),
  toilets: z.number().min(0).max(30),
  description: z.string().min(20, 'Please write a helpful description (at least 20 chars)'),
  video_tour_url: z.string().optional(),
})

type ListingFormValues = z.infer<typeof listingSchema>

const WIZARD_STEPS = [
  { id: 'basics', label: 'Property Basics', description: 'Title, type & Naira price' },
  { id: 'specs', label: 'Location & Amenities', description: 'Rooms, fees & facilities' },
  { id: 'media', label: 'Photos & Publish', description: 'Upload photos & submit' },
] as const

export default function ListingEditorView() {
  const params = useParams({ strict: false }) as { listingId?: string }
  const editingId = params.listingId ?? ''
  const isEditing = Boolean(editingId)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const draft = useAppSelector((state) => state.listingDraft)
  const isLandlord = user?.role === 'landlord'

  const [images, setImages] = useState<string[]>(draft.images)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(draft.amenities)

  const { locationsData } = UseGetLocationsQuery()
  const { propertyTypesData } = UseGetPropertyTypesQuery()

  const { agentListingDetailData, agentListingDetailIsLoading } = UseGetAgentListingByIdQuery(
    editingId,
    isEditing && !isLandlord,
  )
  const { landlordListingDetailData, landlordListingDetailIsLoading } =
    UseGetLandlordListingByIdQuery(editingId, isEditing && isLandlord)

  const { uploadAgentListingMediaIsPending, uploadAgentListingMediaMutationAsync } =
    UseUploadAgentListingMediaMutation()
  const { uploadLandlordListingMediaIsPending, uploadLandlordListingMediaMutationAsync } =
    UseUploadLandlordListingMediaMutation()

  const { createAgentListingIsPending, createAgentListingMutationAsync } =
    UseCreateAgentListingMutation()
  const { createLandlordListingIsPending, createLandlordListingMutationAsync } =
    UseCreateLandlordListingMutation()
  const { updateAgentListingIsPending, updateAgentListingMutationAsync } =
    UseUpdateAgentListingMutation()
  const { updateLandlordListingIsPending, updateLandlordListingMutationAsync } =
    UseUpdateLandlordListingMutation()

  const states = useMemo(() => locationsData?.data ?? [], [locationsData])
  const propertyTypes = useMemo(() => propertyTypesData?.data ?? [], [propertyTypesData])
  const existingListing = isLandlord
    ? landlordListingDetailData?.data
    : agentListingDetailData?.data

  const isLoadingExisting =
    isEditing && (isLandlord ? landlordListingDetailIsLoading : agentListingDetailIsLoading)
  const isUploadingMedia =
    uploadAgentListingMediaIsPending || uploadLandlordListingMediaIsPending
  const isSubmitting =
    createAgentListingIsPending ||
    createLandlordListingIsPending ||
    updateAgentListingIsPending ||
    updateLandlordListingIsPending

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: draft.title,
      classification: draft.classification,
      property_type_id: draft.propertyTypeId,
      state_id: draft.stateId,
      city_id: draft.cityId,
      area: draft.area,
      address: draft.address,
      base_price: draft.basePrice,
      payment_frequency: draft.paymentFrequency,
      agency_fee: draft.agencyFee,
      legal_fee: draft.legalFee,
      caution_fee: draft.cautionFee,
      service_charge: draft.serviceCharge,
      bedrooms: draft.bedrooms,
      bathrooms: draft.bathrooms,
      toilets: draft.toilets,
      description: draft.description,
      video_tour_url: draft.videoTourUrl,
    },
  })

  useEffect(() => {
    if (!existingListing) return
    reset({
      title: existingListing.title,
      classification: existingListing.classification,
      property_type_id: existingListing.property_type.id,
      state_id: existingListing.state.id,
      city_id: existingListing.city.id,
      area: existingListing.area,
      address: existingListing.address,
      base_price: existingListing.pricing.base_price,
      payment_frequency: existingListing.pricing.payment_frequency,
      agency_fee: existingListing.pricing.agency_fee,
      legal_fee: existingListing.pricing.legal_fee,
      caution_fee: existingListing.pricing.caution_fee,
      service_charge: existingListing.pricing.service_charge,
      bedrooms: existingListing.specifications.bedrooms,
      bathrooms: existingListing.specifications.bathrooms,
      toilets: existingListing.specifications.toilets,
      description: existingListing.description,
      video_tour_url: existingListing.media.video_tour_url ?? '',
    })
    setImages(existingListing.media.images ?? [])
    setSelectedAmenities(existingListing.specifications.amenities ?? [])
  }, [existingListing, reset])

  const selectedStateId = watch('state_id')
  const classification = watch('classification')

  const availableCities = useMemo(() => {
    return states.find((s) => s.id === selectedStateId)?.cities ?? []
  }, [states, selectedStateId])

  useEffect(() => {
    if (classification === 'sale') {
      setValue('payment_frequency', 'one_time')
    } else if (watch('payment_frequency') === 'one_time') {
      setValue('payment_frequency', 'yearly')
    }
  }, [classification, setValue, watch])

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })

    try {
      const response = isLandlord
        ? await uploadLandlordListingMediaMutationAsync(formData)
        : await uploadAgentListingMediaMutationAsync(formData)
      const uploadedUrls = response?.data?.images ?? []
      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls])
      }
      if (response?.data?.video_tour_url || response?.data?.video) {
        setValue('video_tour_url', response.data.video_tour_url || response.data.video || '')
      }
    } catch {
      // Mutation hook notifies via toast
    } finally {
      e.target.value = ''
    }
  }

  const onSubmit = async (values: ListingFormValues) => {
    if (images.length === 0) {
      dispatch(
        addToast({
          title: 'Photos required',
          description: 'Please upload at least one photo before submitting.',
          tone: 'danger',
        }),
      )
      return
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      classification: values.classification,
      property_type_id: values.property_type_id,
      state_id: values.state_id,
      city_id: values.city_id,
      area: values.area.trim(),
      address: values.address.trim(),
      base_price: values.base_price,
      payment_frequency: values.payment_frequency,
      agency_fee: values.agency_fee,
      legal_fee: values.legal_fee,
      caution_fee: values.caution_fee,
      service_charge: values.service_charge,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      toilets: values.toilets,
      amenities: selectedAmenities,
      images,
      video_tour_url: values.video_tour_url?.trim() || undefined,
    }

    try {
      if (isEditing) {
        if (isLandlord) {
          await updateLandlordListingMutationAsync({ id: editingId, payload })
        } else {
          await updateAgentListingMutationAsync({ id: editingId, payload })
        }
      } else if (isLandlord) {
        await createLandlordListingMutationAsync(payload)
      } else {
        await createAgentListingMutationAsync(payload)
      }

      dispatch(resetListingDraft())
      navigate({ to: '/dashboard' })
    } catch {
      // Mutation hook surfaces error message via toast
    }
  }

  if (isLoadingExisting) {
    return (
      <PageContainer narrow className="py-8 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    )
  }

  return (
    <PageContainer narrow className="py-8 space-y-6">
      <SectionHeader
        eyebrow={isEditing ? 'Edit Property' : 'Publish Listing'}
        title={isEditing ? 'Update Listing Details' : 'List a Property on Oruvia'}
        subtitle="Provide accurate pricing breakdown, location details, and verified photos."
      />

      <Stepper
        steps={WIZARD_STEPS}
        currentStep={draft.step}
        onStepClick={(idx) => dispatch(setDraftStep(idx))}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <SectionCard
          title="1. Property Details & Naira Pricing"
          subtitle="Be transparent about base price and ancillary fees."
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
                  placeholder="e.g. Newly Built 3-Bedroom Flat in Lekki Phase 1"
                  {...register('title')}
                />
              )}
            </FormField>

            <FormField label="Listing Type" required error={errors.classification?.message}>
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  options={[
                    { value: 'rent', label: 'For Rent' },
                    { value: 'sale', label: 'For Sale' },
                  ]}
                  {...register('classification')}
                />
              )}
            </FormField>

            <FormField label="Property Type" required error={errors.property_type_id?.message}>
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  options={[
                    { value: '', label: 'Select property type...' },
                    ...propertyTypes.map((pt) => ({
                      value: pt.id,
                      label: pt.name,
                    })),
                  ]}
                  {...register('property_type_id')}
                />
              )}
            </FormField>

            <FormField label="Base Price (₦ NGN)" required error={errors.base_price?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('base_price', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField
              label="Payment Frequency"
              required
              error={errors.payment_frequency?.message}
            >
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  options={
                    classification === 'sale'
                      ? [{ value: 'one_time', label: 'Outright / One-time' }]
                      : [
                          { value: 'yearly', label: 'Yearly' },
                          { value: 'monthly', label: 'Monthly' },
                        ]
                  }
                  {...register('payment_frequency')}
                />
              )}
            </FormField>

            <FormField label="Agency Fee (₦)" error={errors.agency_fee?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('agency_fee', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Legal Fee (₦)" error={errors.legal_fee?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('legal_fee', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Caution Deposit (₦)" error={errors.caution_fee?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('caution_fee', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Service Charge (₦)" error={errors.service_charge?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('service_charge', { valueAsNumber: true })}
                />
              )}
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          title="2. Location, Rooms & Estate Amenities"
          subtitle="Select state, city, neighbourhood, and available amenities."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="State" required error={errors.state_id?.message}>
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  options={[
                    { value: '', label: 'Select state...' },
                    ...states.map((st) => ({ value: st.id, label: st.name })),
                  ]}
                  {...register('state_id', {
                    onChange: () => setValue('city_id', ''),
                  })}
                />
              )}
            </FormField>

            <FormField label="City / Area Group" required error={errors.city_id?.message}>
              {({ id, hasError }) => (
                <Select
                  id={id}
                  hasError={hasError}
                  disabled={!selectedStateId}
                  options={[
                    { value: '', label: 'Select city...' },
                    ...availableCities.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  {...register('city_id')}
                />
              )}
            </FormField>

            <FormField label="Neighbourhood / Estate" required error={errors.area?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  leftIcon="location"
                  hasError={hasError}
                  placeholder="e.g. Ibara GRA"
                  {...register('area')}
                />
              )}
            </FormField>

            <FormField label="Street Address / Landmark" required error={errors.address?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  hasError={hasError}
                  placeholder="e.g. Plot 14, Quarry Road"
                  {...register('address')}
                />
              )}
            </FormField>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Bedrooms" error={errors.bedrooms?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('bedrooms', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Bathrooms" error={errors.bathrooms?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('bathrooms', { valueAsNumber: true })}
                />
              )}
            </FormField>

            <FormField label="Toilets" error={errors.toilets?.message}>
              {({ id, hasError }) => (
                <Input
                  id={id}
                  type="number"
                  hasError={hasError}
                  {...register('toilets', { valueAsNumber: true })}
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
                const checked = selectedAmenities.includes(key)
                return (
                  <Checkbox
                    key={key}
                    label={item.label}
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? selectedAmenities.filter((a) => a !== key)
                        : [...selectedAmenities, key]
                      setSelectedAmenities(next)
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
          subtitle="Upload property images directly and optionally include a virtual video tour URL."
          footer={
            <>
              <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon="check"
                loading={isSubmitting}
                disabled={isUploadingMedia}
              >
                {isEditing ? 'Save changes' : 'Submit listing'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormField label="Upload Photos (JPEG / PNG / WebP)" required>
              {({ id }) => (
                <input
                  id={id}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  disabled={isUploadingMedia}
                  className="block w-full text-xs text-ink-700 file:mr-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-surface hover:file:bg-ink-700"
                />
              )}
            </FormField>

            {isUploadingMedia ? (
              <p className="text-xs font-medium text-brand-600">Uploading media to Oruvia...</p>
            ) : null}

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative overflow-hidden rounded-[var(--radius-sm)] border border-line"
                  >
                    <img
                      src={url}
                      alt={`Upload preview ${idx + 1}`}
                      width={240}
                      height={160}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 rounded bg-ink-900/80 px-2 py-0.5 text-[11px] font-semibold text-surface cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <FormField
              label="Video Tour URL (optional)"
              error={errors.video_tour_url?.message}
            >
              {({ id, hasError }) => (
                <Input
                  id={id}
                  hasError={hasError}
                  placeholder="https://..."
                  {...register('video_tour_url')}
                />
              )}
            </FormField>
          </div>
        </SectionCard>
      </form>
    </PageContainer>
  )
}

