import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Card } from '@/components/cards/Card'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { UseSubmitAgentKycMutation, UseSubmitLandlordKycMutation } from '@/services/mutations'
import { UseGetAgentKycQuery, UseGetLandlordKycQuery } from '@/services/queries'
import type { KycIdType, LandlordProofType } from '@/services/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'
import type { ListingStatus } from '@/types/domain'

function mapVerificationToStatusBadge(status?: string): ListingStatus {
  if (status === 'approved') return 'approved'
  if (status === 'rejected') return 'rejected'
  if (status === 'pending') return 'pending_review'
  return 'draft'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface DocumentUploadBoxProps {
  label: string
  hint: string
  required?: boolean
  file: File | null
  accept?: string
  icon?: IconName
  onFileSelect: (file: File | null) => void
}

function DocumentUploadBox({
  label,
  hint,
  required,
  file,
  accept = 'image/*,.pdf',
  icon = 'upload',
  onFileSelect,
}: DocumentUploadBoxProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    onFileSelect(selected)
    if (selected && selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileSelect(null)
    setPreviewUrl(null)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-ink-900">
          {label} {required ? <span className="text-danger">*</span> : null}
        </label>
        {file ? (
          <span className="text-[11px] font-medium text-success flex items-center gap-1">
            <Icon name="check" size={12} /> Ready
          </span>
        ) : null}
      </div>

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-success/30 bg-success/5 p-3">
          <div className="flex items-center gap-3 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Upload preview"
                className="h-10 w-10 shrink-0 rounded object-cover border border-line"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface border border-line text-ink-700">
                <Icon name="verified" size={18} />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink-900">{file.name}</p>
              <p className="text-[11px] text-ink-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-danger hover:text-danger hover:bg-danger/10 shrink-0"
          >
            <Icon name="trash" size={14} />
            <span className="sr-only sm:not-sr-only sm:ml-1">Remove</span>
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-dashed border-line bg-surface-muted/40 p-5 text-center transition hover:border-brand-500 hover:bg-surface-muted cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-line text-brand-600 shadow-xs">
            <Icon name={icon} size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900">
              Tap to browse or upload document
            </p>
            <p className="text-[11px] text-ink-500 mt-0.5">{hint}</p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}

export default function VerifyView() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isAgent = user?.role === 'agent'
  const isLandlord = user?.role === 'landlord'

  const { agentKycData, agentKycIsLoading } = UseGetAgentKycQuery(isAgent)
  const { landlordKycData, landlordKycIsLoading } = UseGetLandlordKycQuery(isLandlord)

  const { submitAgentKycIsPending, submitAgentKycMutationAsync } = UseSubmitAgentKycMutation()
  const { submitLandlordKycIsPending, submitLandlordKycMutationAsync } =
    UseSubmitLandlordKycMutation()

  const [idType, setIdType] = useState<KycIdType>('nin')
  const [idNumber, setIdNumber] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Abeokuta')
  const [stateName, setStateName] = useState('Ogun')
  const [agencyName, setAgencyName] = useState(user?.agencyName ?? '')
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber ?? '')
  const [proofType, setProofType] = useState<LandlordProofType>('c_of_o')

  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [extraDocFile, setExtraDocFile] = useState<File | null>(null)

  const kycInfo = isLandlord ? landlordKycData?.data : agentKycData?.data
  const isLoading = isLandlord ? landlordKycIsLoading : agentKycIsLoading
  const isSubmitting = submitAgentKycIsPending || submitLandlordKycIsPending

  const isVerified = Boolean(kycInfo?.is_verified)
  const isPendingReview = kycInfo?.verification_status === 'pending'
  const isRejected = kycInfo?.verification_status === 'rejected'

  const badgeTitle = useMemo(() => {
    if (kycInfo?.verification_badge === 'licensed_agent') return 'Licensed Real Estate Agent'
    if (kycInfo?.verification_badge === 'verified_agent') return 'Verified Real Estate Agent'
    if (kycInfo?.verification_badge === 'verified_owner') return 'Verified Property Owner'
    if (kycInfo?.verification_badge === 'verified_landlord') return 'Verified Landlord'
    return isLandlord ? 'Verified Property Owner' : 'Verified Real Estate Agent'
  }, [kycInfo?.verification_badge, isLandlord])

  if (!isAgent && !isLandlord) {
    return (
      <PageContainer narrow className="py-10">
        <EmptyStateCard
          icon="verified"
          title="Verification applies to Agent and Landlord accounts"
          description="Seeker accounts only require email verification. Sign in with an Agent or Landlord account to submit KYC documents."
          actionLabel="Explore homes"
          onAction={() => navigate({ to: '/' })}
        />
      </PageContainer>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idNumber.trim() || !address.trim() || !city.trim() || !stateName.trim()) {
      dispatch(
        addToast({
          title: 'Missing required details',
          description: 'Please fill in your ID number, address, city, and state.',
          tone: 'danger',
        }),
      )
      return
    }

    if (!idDocumentFile || !selfieFile) {
      dispatch(
        addToast({
          title: 'Documents required',
          description: 'Please upload both your Government ID document and a live selfie photo.',
          tone: 'danger',
        }),
      )
      return
    }

    if (isLandlord && !extraDocFile) {
      dispatch(
        addToast({
          title: 'Ownership document required',
          description: 'Please upload your proof of property ownership or utility bill.',
          tone: 'danger',
        }),
      )
      return
    }

    const formData = new FormData()
    formData.append('id_type', idType)
    formData.append('id_number', idNumber.trim())
    formData.append('city', city.trim())
    formData.append('state', stateName.trim())
    formData.append('id_document', idDocumentFile)
    formData.append('selfie', selfieFile)

    try {
      if (isLandlord) {
        formData.append('proof_type', proofType)
        formData.append('residential_address', address.trim())
        if (extraDocFile) {
          formData.append('proof_document', extraDocFile)
        }
        await submitLandlordKycMutationAsync(formData)
      } else {
        formData.append('office_address', address.trim())
        if (agencyName.trim()) {
          formData.append('agency_name', agencyName.trim())
        }
        if (licenseNumber.trim()) {
          formData.append('license_number', licenseNumber.trim())
        }
        if (extraDocFile) {
          formData.append('license_document', extraDocFile)
        }
        await submitAgentKycMutationAsync(formData)
      }
    } catch {
      // Handled by mutation hook
    }
  }

  return (
    <PageContainer narrow className="py-8 space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              navigate({ to: user ? `/profile/${user.id}` : '/' })
            }
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-700 transition hover:bg-surface-muted hover:text-ink-900 cursor-pointer"
          aria-label="Back"
        >
          <Icon name="chevronLeft" size={18} />
        </button>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Trust & Safety
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            {isLandlord
              ? 'Landlord Identity & Ownership Verification'
              : 'Agent KYC & Professional Licensing'}
          </h1>
        </div>
      </div>

      <p className="text-sm text-ink-600">
        Earn the authentic Oruvia verified badge by validating your Government ID and property
        documentation. Verified listings build seeker confidence and receive priority ranking.
      </p>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-6">
          {/* Current KYC Status Card */}
          {isVerified ? (
            <Card variant="elevated" padding="lg" className="border-success/30 bg-success/5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-surface shadow-xs">
                    <Icon name="verified" size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-900">KYC Verification Approved</h3>
                    <p className="text-xs font-medium text-success">
                      Badge: {badgeTitle}
                    </p>
                  </div>
                </div>
                <VerifiedBadge label={badgeTitle} />
              </div>

              <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-4 text-xs text-ink-700 space-y-1.5">
                <p>
                  <span className="font-semibold text-ink-900">Verified ID Type:</span>{' '}
                  <span className="uppercase">{kycInfo?.kyc_submission?.id_type || 'NIN / Passport'}</span>
                </p>
                <p>
                  <span className="font-semibold text-ink-900">Verified Location:</span>{' '}
                  {kycInfo?.kyc_submission?.city || 'Abeokuta'}, {kycInfo?.kyc_submission?.state || 'Ogun'}
                </p>
                <p className="text-[11px] text-ink-500 pt-1 border-t border-line">
                  Your listings now proudly display the verified badge and are prioritized in Nigerian seeker searches.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  Manage Listings in Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => user && navigate({ to: '/profile/$userId', params: { userId: user.id } })}
                >
                  View Public Profile
                </Button>
              </div>
            </Card>
          ) : isPendingReview ? (
            <Card variant="elevated" padding="lg" className="border-warning/40 bg-warning/5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-star/20 text-ink-900 shadow-xs">
                    <Icon name="clock" size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-900">Verification Under Review</h3>
                    <p className="text-xs text-ink-600">
                      Submitted documents are in the moderation queue
                    </p>
                  </div>
                </div>
                <StatusBadge status="pending_review" />
              </div>

              <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-4 text-xs text-ink-700 space-y-1.5">
                <p>
                  <span className="font-semibold text-ink-900">Submitted For:</span>{' '}
                  {isLandlord ? 'Property Ownership & Identity' : 'Agent Licensing & Identity'}
                </p>
                <p>
                  <span className="font-semibold text-ink-900">Turnaround Time:</span> Usually reviewed within 12–24 hours.
                </p>
                <p className="text-[11px] text-ink-500 pt-1 border-t border-line">
                  You will receive an automated email confirmation once our compliance team confirms your credentials.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => user && navigate({ to: '/profile/$userId', params: { userId: user.id } })}
              >
                Return to Profile
              </Button>
            </Card>
          ) : isRejected ? (
            <div className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-danger font-bold text-sm">
                <Icon name="report" size={16} />
                <span>Previous Verification Rejected</span>
              </div>
              <p className="text-xs text-danger-700">
                <span className="font-semibold">Reviewer Note:</span>{' '}
                {kycInfo?.kyc_submission?.rejection_reason || 'Documents were unclear or incomplete.'}
              </p>
              <p className="text-[11px] text-ink-600">
                Please re-upload a clear copy of your credentials and submit again below.
              </p>
            </div>
          ) : null}

          {/* Verification Form (Hidden if already verified) */}
          {!isVerified ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <SectionCard
                title={
                  isRejected
                    ? 'Resubmit Verification Documents'
                    : 'Submit Verification Documents'
                }
                subtitle="All submitted documents are encrypted and reviewed by Oruvia Trust & Safety compliance officers."
                action={<StatusBadge status={mapVerificationToStatusBadge(kycInfo?.verification_status)} />}
                footer={
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon="verified"
                    loading={isSubmitting}
                    disabled={isPendingReview}
                  >
                    {isPendingReview
                      ? 'Verification Pending Review'
                      : 'Submit Documents for Verification'}
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Government ID Type" required>
                    {({ id }) => (
                      <Select
                        id={id}
                        value={idType}
                        onChange={(e) => setIdType(e.target.value as KycIdType)}
                        options={[
                          { value: 'nin', label: 'National Identification Number (NIN)' },
                          { value: 'international_passport', label: 'Nigerian International Passport' },
                          { value: 'drivers_license', label: 'Driver’s License' },
                          { value: 'voters_card', label: 'Voter’s Card (PVC)' },
                        ]}
                      />
                    )}
                  </FormField>

                  <FormField label="ID Number" required hint="e.g. 11-digit NIN or Passport No.">
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder={idType === 'nin' ? '48291038475' : 'Enter ID number'}
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                      />
                    )}
                  </FormField>

                  <FormField
                    label={isLandlord ? 'Residential Address' : 'Office Address'}
                    required
                    className="sm:col-span-2"
                    hint={
                      isLandlord
                        ? 'e.g. Plot 8, Kemta Idi-Aba GRA'
                        : 'e.g. 14 Presidential Boulevard, Ibara'
                    }
                  >
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder="Street and building address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    )}
                  </FormField>

                  <FormField label="City" required>
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder="e.g. Abeokuta"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    )}
                  </FormField>

                  <FormField label="State" required>
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder="e.g. Ogun"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        required
                      />
                    )}
                  </FormField>

                  {isLandlord ? (
                    <FormField
                      label="Ownership / Utility Proof Type"
                      required
                      className="sm:col-span-2"
                      hint="Certificate of Occupancy or Deed qualifies you for the Verified Owner badge."
                    >
                      {({ id }) => (
                        <Select
                          id={id}
                          value={proofType}
                          onChange={(e) => setProofType(e.target.value as LandlordProofType)}
                          options={[
                            { value: 'c_of_o', label: 'Certificate of Occupancy (Verified Owner badge)' },
                            { value: 'deed_of_assignment', label: 'Deed of Assignment (Verified Owner badge)' },
                            { value: 'survey_plan', label: 'Registered Survey Plan (Verified Owner badge)' },
                            { value: 'governors_consent', label: 'Governor’s Consent (Verified Owner badge)' },
                            { value: 'utility_bill', label: 'Recent Utility Bill (Verified Landlord badge)' },
                          ]}
                        />
                      )}
                    </FormField>
                  ) : (
                    <>
                      <FormField
                        label="Agency / Brokerage Name"
                        hint="e.g. Crown Roof Realty Limited"
                      >
                        {({ id }) => (
                          <Input
                            id={id}
                            placeholder="Crown Roof Realty Limited"
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                          />
                        )}
                      </FormField>

                      <FormField
                        label="Real Estate License / CAC Number"
                        hint="e.g. OG-RE-2026-0481"
                      >
                        {({ id }) => (
                          <Input
                            id={id}
                            placeholder="OG-RE-2026-0481"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                          />
                        )}
                      </FormField>
                    </>
                  )}

                  {/* Document Upload Dropzones */}
                  <div className="sm:col-span-2 pt-2 border-t border-line space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700">
                      Required Uploads
                    </h4>

                    <DocumentUploadBox
                      label="1. Government ID Document"
                      hint="Clear image or PDF of NIN slip, Passport data page, Driver's License, or PVC"
                      required
                      file={idDocumentFile}
                      onFileSelect={setIdDocumentFile}
                      icon="verified"
                    />

                    <DocumentUploadBox
                      label="2. Live Selfie Photo"
                      hint="Clear photo of your face holding or next to your ID for liveness match"
                      required
                      accept="image/*"
                      file={selfieFile}
                      onFileSelect={setSelfieFile}
                      icon="camera"
                    />

                    <DocumentUploadBox
                      label={
                        isLandlord
                          ? '3. Proof of Property Ownership or Utility Bill'
                          : '3. CAC / Real Estate License Document (Optional for Licensed Badge)'
                      }
                      hint={
                        isLandlord
                          ? 'C of O, Deed of Assignment, Survey Plan, or Recent Utility Bill (PDF or Image)'
                          : 'CAC certificate or State real estate practice license (PDF or Image)'
                      }
                      required={isLandlord}
                      file={extraDocFile}
                      onFileSelect={setExtraDocFile}
                      icon="upload"
                    />
                  </div>
                </div>
              </SectionCard>
            </form>
          ) : null}
        </div>
      )}
    </PageContainer>
  )
}
