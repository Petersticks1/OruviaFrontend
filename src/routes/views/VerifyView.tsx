import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/cards/Card'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { FormField } from '@/components/shared/FormField'
import { LiveSelfieCapture } from '@/components/shared/LiveSelfieCapture'
import { PageContainer } from '@/components/shared/PageContainer'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
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

const ID_TYPE_LABELS: Record<string, string> = {
  nin: 'National Identification Number (NIN)',
  international_passport: 'Nigerian International Passport',
  drivers_license: 'Driver’s License',
  voters_card: 'Voter’s Card (PVC)',
}

const PROOF_TYPE_LABELS: Record<string, string> = {
  c_of_o: 'Certificate of Occupancy (C of O)',
  deed_of_assignment: 'Deed of Assignment',
  survey_plan: 'Registered Survey Plan',
  governors_consent: 'Governor’s Consent',
  utility_bill: 'Recent Utility Bill',
}

const QUALIFIED_BADGE_LABELS: Record<string, string> = {
  licensed_agent: 'Licensed Real Estate Agent',
  verified_agent: 'Verified Real Estate Agent',
  verified_owner: 'Verified Property Owner',
  verified_landlord: 'Verified Landlord',
}

function isPdfUrl(url?: string | null): boolean {
  return Boolean(url && /\.pdf(\?|$)/i.test(url))
}

function formatSubmittedDate(iso?: string | null): string {
  if (!iso) return 'Just now'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

interface SubmittedDocumentCardProps {
  title: string
  url: string
  onPreview: (title: string, url: string, isPdf: boolean) => void
}

function SubmittedDocumentCard({ title, url, onPreview }: SubmittedDocumentCardProps) {
  const pdf = isPdfUrl(url)

  return (
    <div className="flex flex-col justify-between gap-3 rounded-[var(--radius-sm)] border border-line bg-surface p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-ink-900">{title}</p>
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-600">
          {pdf ? 'PDF' : 'Image'}
        </span>
      </div>

      {pdf ? (
        <button
          type="button"
          onClick={() => onPreview(title, url, true)}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-line bg-surface-muted/40 text-ink-600 transition hover:border-brand-500 hover:bg-surface-muted cursor-pointer"
        >
          <Icon name="verified" size={28} className="text-brand-600" />
          <span className="text-[11px] font-medium">Click to preview PDF</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onPreview(title, url, false)}
          className="group relative h-32 w-full overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface-muted cursor-pointer"
        >
          <img
            src={url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-ink-900/0 text-xs font-semibold text-surface opacity-0 transition group-hover:bg-ink-900/40 group-hover:opacity-100">
            Click to preview
          </span>
        </button>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon="eye"
          onClick={() => onPreview(title, url, pdf)}
        >
          Preview
        </Button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink-800 transition hover:bg-surface-muted"
        >
          Open {pdf ? 'PDF' : 'Original'}
          <Icon name="chevronRight" size={14} />
        </a>
      </div>
    </div>
  )
}

interface DocumentUploadBoxProps {
  label: string
  hint: string
  required?: boolean
  file: File | null
  accept?: string
  icon?: IconName
  onFileSelect: (file: File | null) => void
  onPreview?: (title: string, url: string, isPdf: boolean) => void
}

function DocumentUploadBox({
  label,
  hint,
  required,
  file,
  accept = 'image/*,.pdf',
  icon = 'upload',
  onFileSelect,
  onPreview,
}: DocumentUploadBoxProps) {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  const isPdf = Boolean(
    file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')),
  )

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    onFileSelect(selected)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileSelect(null)
  }

  const handleOpenPreview = () => {
    if (objectUrl && onPreview) {
      onPreview(label, objectUrl, isPdf)
    }
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-success/30 bg-success/5 p-3">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
          >
            {objectUrl && !isPdf ? (
              <img
                src={objectUrl}
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
          </button>
          <div className="flex items-center gap-1.5 shrink-0">
            {onPreview && objectUrl ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon="eye"
                onClick={handleOpenPreview}
              >
                Preview
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <Icon name="trash" size={14} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Remove</span>
            </Button>
          </div>
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
  const [previewDoc, setPreviewDoc] = useState<{
    title: string
    url: string
    isPdf: boolean
  } | null>(null)

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nativeForm = new FormData(e.currentTarget)
    const resolvedIdNumber = (idNumber || String(nativeForm.get('id_number') ?? '')).trim()
    const resolvedAddress = (address || String(nativeForm.get('address') ?? '')).trim()
    const resolvedCity = (city || String(nativeForm.get('city') ?? 'Abeokuta')).trim()
    const resolvedState = (stateName || String(nativeForm.get('state') ?? 'Ogun')).trim()

    const missingFields: string[] = []
    if (!resolvedIdNumber) missingFields.push('ID number')
    if (!resolvedAddress) missingFields.push(isLandlord ? 'residential address' : 'office address')
    if (!resolvedCity) missingFields.push('city')
    if (!resolvedState) missingFields.push('state')

    if (missingFields.length > 0) {
      dispatch(
        addToast({
          title: 'Missing required details',
          description: `Please fill in your ${missingFields.join(', ')}.`,
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
    formData.append('id_number', resolvedIdNumber)
    formData.append('city', resolvedCity)
    formData.append('state', resolvedState)
    formData.append('id_document', idDocumentFile)
    formData.append('selfie', selfieFile)

    try {
      if (isLandlord) {
        formData.append('proof_type', proofType)
        formData.append('residential_address', resolvedAddress)
        if (extraDocFile) {
          formData.append('proof_document', extraDocFile)
        }
        await submitLandlordKycMutationAsync(formData)
      } else {
        formData.append('office_address', resolvedAddress)
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
            <div className="space-y-6">
              <Card variant="elevated" padding="lg" className="border-warning/40 bg-warning/5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-star/20 text-ink-900 shadow-xs">
                      <Icon name="clock" size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-ink-900">Verification Under Review</h3>
                      <p className="text-xs text-ink-600">
                        Your KYC documents have been submitted and are in the compliance review queue.
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
                    <span className="font-semibold text-ink-900">Submitted At:</span>{' '}
                    {formatSubmittedDate(kycInfo?.kyc_submission?.submitted_at)}
                  </p>
                  <p>
                    <span className="font-semibold text-ink-900">Turnaround Time:</span> Usually reviewed within 12–24 hours.
                  </p>
                  <p className="text-[11px] text-ink-500 pt-1 border-t border-line">
                    You will receive an email confirmation once our compliance team confirms your credentials.
                  </p>
                </div>
              </Card>

              {kycInfo?.kyc_submission ? (
                <SectionCard
                  title="Submitted KYC Details & Documents"
                  subtitle="Review the information and documents currently under verification."
                  action={<StatusBadge status="pending_review" />}
                  footer={
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate({ to: '/dashboard' })}
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          user && navigate({ to: '/profile/$userId', params: { userId: user.id } })
                        }
                      >
                        Return to Profile
                      </Button>
                    </div>
                  }
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                          Government ID Type
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          {ID_TYPE_LABELS[kycInfo.kyc_submission.id_type] ??
                            kycInfo.kyc_submission.id_type}
                        </p>
                      </div>

                      <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                          ID Number
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          {kycInfo.kyc_submission.id_number}
                        </p>
                      </div>

                      <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3 sm:col-span-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                          {isLandlord ? 'Residential Address' : 'Office Address'}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          {'office_address' in kycInfo.kyc_submission
                            ? kycInfo.kyc_submission.office_address
                            : kycInfo.kyc_submission.residential_address}
                        </p>
                      </div>

                      <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                          City & State
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          {kycInfo.kyc_submission.city}, {kycInfo.kyc_submission.state}
                        </p>
                      </div>

                      <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                          Qualified Badge
                        </p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          {QUALIFIED_BADGE_LABELS[kycInfo.kyc_submission.qualified_badge] ??
                            kycInfo.kyc_submission.qualified_badge}
                        </p>
                      </div>

                      {'agency_name' in kycInfo.kyc_submission &&
                      kycInfo.kyc_submission.agency_name ? (
                        <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                            Agency / Brokerage Name
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink-900">
                            {kycInfo.kyc_submission.agency_name}
                          </p>
                        </div>
                      ) : null}

                      {'license_number' in kycInfo.kyc_submission &&
                      kycInfo.kyc_submission.license_number ? (
                        <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                            License / CAC Number
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink-900">
                            {kycInfo.kyc_submission.license_number}
                          </p>
                        </div>
                      ) : null}

                      {'proof_type' in kycInfo.kyc_submission &&
                      kycInfo.kyc_submission.proof_type ? (
                        <div className="rounded-[var(--radius-sm)] border border-line bg-surface-muted/40 p-3 sm:col-span-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                            Ownership / Utility Proof Type
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink-900">
                            {PROOF_TYPE_LABELS[kycInfo.kyc_submission.proof_type] ??
                              kycInfo.kyc_submission.proof_type}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-3 border-t border-line pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700">
                        Uploaded Documents
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SubmittedDocumentCard
                          title="1. Government ID"
                          url={kycInfo.kyc_submission.id_document_url}
                          onPreview={(title, url, isPdf) => setPreviewDoc({ title, url, isPdf })}
                        />
                        <SubmittedDocumentCard
                          title="2. Live Selfie"
                          url={kycInfo.kyc_submission.selfie_url}
                          onPreview={(title, url, isPdf) => setPreviewDoc({ title, url, isPdf })}
                        />
                        {'license_document_url' in kycInfo.kyc_submission &&
                        kycInfo.kyc_submission.license_document_url ? (
                          <SubmittedDocumentCard
                            title="3. License / CAC Document"
                            url={kycInfo.kyc_submission.license_document_url}
                            onPreview={(title, url, isPdf) => setPreviewDoc({ title, url, isPdf })}
                          />
                        ) : null}
                        {'proof_document_url' in kycInfo.kyc_submission &&
                        kycInfo.kyc_submission.proof_document_url ? (
                          <SubmittedDocumentCard
                            title="3. Ownership / Utility Proof"
                            url={kycInfo.kyc_submission.proof_document_url}
                            onPreview={(title, url, isPdf) => setPreviewDoc({ title, url, isPdf })}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              ) : null}
            </div>
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

          {/* Verification Form (Hidden if already verified or pending review) */}
          {!isVerified && !isPendingReview ? (
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
                        name="id_number"
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
                        name="address"
                        placeholder="Street and building address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    )}
                  </FormField>

                  <FormField label="City" required>
                    {({ id }) => (
                      <Select
                        id={id}
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        options={[{ value: 'Abeokuta', label: 'Abeokuta' }]}
                      />
                    )}
                  </FormField>

                  <FormField label="State" required>
                    {({ id }) => (
                      <Select
                        id={id}
                        name="state"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        options={[{ value: 'Ogun', label: 'Ogun State' }]}
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
                      onPreview={(title, url, isPdf) => setPreviewDoc({ title, url, isPdf })}
                      icon="verified"
                    />

                    <LiveSelfieCapture
                      label="2. Live Selfie Photo"
                      hint="Use your camera to take a clear selfie of your face holding or next to your ID"
                      required
                      file={selfieFile}
                      onFileSelect={setSelfieFile}
                      onPreview={(title, url) => setPreviewDoc({ title, url, isPdf: false })}
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
                      onPreview={(title, url, isPdf) => setPreviewDoc({ title, url, isPdf })}
                      icon="upload"
                    />
                  </div>
                </div>
              </SectionCard>
            </form>
          ) : null}
        </div>
      )}

      <Modal
        open={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title ?? 'Document Preview'}
        size="xl"
      >
        {previewDoc ? (
          <div className="flex flex-col items-center gap-4">
            {previewDoc.isPdf ? (
              <iframe
                src={previewDoc.url}
                title={previewDoc.title}
                className="h-[70vh] w-full rounded-[var(--radius-sm)] border border-line bg-surface"
              />
            ) : (
              <img
                src={previewDoc.url}
                alt={previewDoc.title}
                className="max-h-[70vh] w-full rounded-[var(--radius-sm)] object-contain bg-surface-muted"
              />
            )}
            <a
              href={previewDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Open original in new tab
            </a>
          </div>
        ) : null}
      </Modal>
    </PageContainer>
  )
}
