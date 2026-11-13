import { useState } from 'react'
import { EmptyStateCard } from '@/components/cards/EmptyStateCard'
import { SectionCard } from '@/components/cards/SectionCard'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
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

export default function VerifyView() {
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
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [agencyName, setAgencyName] = useState(user?.agencyName ?? '')
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber ?? '')
  const [proofType, setProofType] = useState<LandlordProofType>('utility_bill')

  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [extraDocFile, setExtraDocFile] = useState<File | null>(null)

  if (!isAgent && !isLandlord) {
    return (
      <PageContainer narrow className="py-10">
        <EmptyStateCard
          icon="verified"
          title="Verification applies to Agent and Landlord accounts"
          description="Seeker accounts only require email verification. Sign in with an Agent or Landlord account to submit KYC documents."
        />
      </PageContainer>
    )
  }

  const kycInfo = isLandlord ? landlordKycData?.data : agentKycData?.data
  const isLoading = isLandlord ? landlordKycIsLoading : agentKycIsLoading
  const isSubmitting = submitAgentKycIsPending || submitLandlordKycIsPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idNumber.trim() || !address.trim() || !city.trim() || !stateName.trim()) {
      dispatch(
        addToast({
          title: 'Missing required details',
          description: 'Fill in your ID number, street address, city, and state.',
          tone: 'danger',
        }),
      )
      return
    }

    if (!idDocumentFile || !selfieFile || (isLandlord && !extraDocFile)) {
      dispatch(
        addToast({
          title: 'Documents required',
          description: isLandlord
            ? 'Upload your Government ID, clear selfie, and proof of property ownership or utility bill.'
            : 'Upload both your Government ID and a clear selfie photo.',
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
      <SectionHeader
        eyebrow="Trust & Safety"
        title={isLandlord ? 'Landlord Identity & Ownership Verification' : 'Agent KYC Verification'}
        subtitle="Earn an Oruvia verification badge by verifying your Government ID and supporting credentials."
        action={kycInfo?.is_verified ? <VerifiedBadge /> : undefined}
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard
            title="Submit Verification Documents"
            subtitle={
              kycInfo?.verification_badge
                ? `Current badge: ${kycInfo.verification_badge.replace(/_/g, ' ')}`
                : 'Your documents are reviewed by Oruvia Trust & Safety moderators.'
            }
            action={<StatusBadge status={mapVerificationToStatusBadge(kycInfo?.verification_status)} />}
            footer={
              <Button
                type="submit"
                variant="primary"
                leftIcon="verified"
                loading={isSubmitting}
                disabled={kycInfo?.verification_status === 'pending'}
              >
                {kycInfo?.verification_status === 'pending'
                  ? 'Verification Pending Review'
                  : 'Submit for verification'}
              </Button>
            }
          >
            {kycInfo?.kyc_submission?.rejection_reason ? (
              <div className="mb-4 rounded-[var(--radius-sm)] border border-danger-600/30 bg-danger-600/10 p-3 text-xs text-danger-700">
                <span className="font-bold">Previous submission note: </span>
                {kycInfo.kyc_submission.rejection_reason}
              </div>
            ) : null}

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

              <FormField label="ID Number" required>
                {({ id }) => (
                  <Input
                    id={id}
                    placeholder="Enter ID number"
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
              >
                {({ id }) => (
                  <Input
                    id={id}
                    placeholder="Street address"
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
                <FormField label="Ownership / Utility Proof Type" required className="sm:col-span-2">
                  {({ id }) => (
                    <Select
                      id={id}
                      value={proofType}
                      onChange={(e) => setProofType(e.target.value as LandlordProofType)}
                      options={[
                        { value: 'utility_bill', label: 'Recent Utility Bill (Verified Landlord)' },
                        { value: 'c_of_o', label: 'Certificate of Occupancy (Verified Owner)' },
                        { value: 'deed_of_assignment', label: 'Deed of Assignment (Verified Owner)' },
                        { value: 'survey_plan', label: 'Registered Survey Plan (Verified Owner)' },
                        { value: 'governors_consent', label: 'Governor’s Consent (Verified Owner)' },
                      ]}
                    />
                  )}
                </FormField>
              ) : (
                <>
                  <FormField label="Agency Name">
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder="Optional agency / brokerage name"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                      />
                    )}
                  </FormField>

                  <FormField label="Practice / CAC License Number">
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder="Optional registration number"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    )}
                  </FormField>
                </>
              )}

              <FormField label="Government ID Document (Image or PDF)" required>
                {({ id }) => (
                  <input
                    id={id}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setIdDocumentFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-xs text-ink-700 file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-ink-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-surface"
                    required
                  />
                )}
              </FormField>

              <FormField label="Clear Selfie / Portrait Photo" required>
                {({ id }) => (
                  <input
                    id={id}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-xs text-ink-700 file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-ink-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-surface"
                    required
                  />
                )}
              </FormField>

              <FormField
                label={
                  isLandlord
                    ? 'Proof of Ownership / Utility Bill Document'
                    : 'CAC / Real Estate License Document (optional, for Licensed Agent badge)'
                }
                required={isLandlord}
                className="sm:col-span-2"
              >
                {({ id }) => (
                  <input
                    id={id}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setExtraDocFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-xs text-ink-700 file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-ink-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-surface"
                    required={isLandlord}
                  />
                )}
              </FormField>
            </div>
          </SectionCard>
        </form>
      )}
    </PageContainer>
  )
}

