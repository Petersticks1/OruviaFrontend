import { useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { UseGetAgentKycQuery, UseGetLandlordKycQuery } from '@/services/queries'
import { useAppSelector } from '@/store/hooks'

export interface KycRequiredModalProps {
  open: boolean
  onClose: () => void
  onVerifiedContinue?: () => void
}

export function KycRequiredModal({
  open,
  onClose,
  onVerifiedContinue,
}: KycRequiredModalProps) {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const isAgent = user?.role === 'agent'
  const isLandlord = user?.role === 'landlord'

  const { agentKycData, agentKycIsLoading } = UseGetAgentKycQuery(open && isAgent)
  const { landlordKycData, landlordKycIsLoading } = UseGetLandlordKycQuery(open && isLandlord)

  const kycInfo = isLandlord ? landlordKycData?.data : agentKycData?.data
  const isLoading = isLandlord ? landlordKycIsLoading : agentKycIsLoading

  const isVerified = Boolean(kycInfo?.is_verified ?? user?.verified)
  const status = kycInfo?.verification_status ?? user?.verificationStatus ?? 'unverified'
  const rejectionReason = kycInfo?.kyc_submission?.rejection_reason

  const handleGoToKyc = () => {
    onClose()
    navigate({ to: '/verify' })
  }

  const handleContinueListing = () => {
    onClose()
    if (onVerifiedContinue) {
      onVerifiedContinue()
    } else {
      navigate({ to: '/dashboard/listings/new' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isVerified
          ? 'Account Verified'
          : status === 'pending'
            ? 'KYC Verification Under Review'
            : status === 'rejected'
              ? 'KYC Verification Rejected'
              : 'KYC Verification Required'
      }
      description={
        isVerified
          ? 'Your identity has been verified. You can publish listings on Oruvia.'
          : 'Oruvia requires all Agents and Landlords to complete KYC before listing properties.'
      }
      size="md"
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {isVerified ? 'Cancel' : 'Maybe later'}
          </Button>
          {isVerified ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon="plus"
              onClick={handleContinueListing}
            >
              Continue to List Property
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              rightIcon="arrowRight"
              onClick={handleGoToKyc}
            >
              {status === 'pending'
                ? 'View KYC Status'
                : status === 'rejected'
                  ? 'Resubmit KYC'
                  : 'Continue to KYC'}
            </Button>
          )}
        </div>
      }
    >
      {isLoading && !kycInfo ? (
        <div className="space-y-3 py-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status Banner */}
          <div
            className={cn(
              'flex items-start gap-3.5 rounded-[var(--radius-md)] border p-4',
              isVerified
                ? 'border-success/30 bg-success/5'
                : status === 'pending'
                  ? 'border-warning/40 bg-warning/5'
                  : status === 'rejected'
                    ? 'border-danger/30 bg-danger/5'
                    : 'border-brand-200 bg-brand-50/50',
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-surface',
                isVerified
                  ? 'bg-success'
                  : status === 'pending'
                    ? 'bg-star text-ink-900'
                    : status === 'rejected'
                      ? 'bg-danger'
                      : 'bg-brand-600',
              )}
            >
              <Icon
                name={
                  isVerified
                    ? 'verified'
                    : status === 'pending'
                      ? 'clock'
                      : status === 'rejected'
                        ? 'report'
                        : 'shield'
                }
                size={20}
              />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-ink-900">
                  {isVerified
                    ? 'Verification Approved'
                    : status === 'pending'
                      ? 'Verification In Progress'
                      : status === 'rejected'
                        ? 'Action Required'
                        : 'Verification Not Completed'}
                </p>
                <Badge
                  variant={
                    isVerified
                      ? 'success'
                      : status === 'pending'
                        ? 'warning'
                        : status === 'rejected'
                          ? 'danger'
                          : 'brand'
                  }
                >
                  {isVerified
                    ? 'Verified'
                    : status === 'pending'
                      ? 'Pending Review'
                      : status === 'rejected'
                        ? 'Rejected'
                        : 'Unverified'}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-ink-600">
                {isVerified
                  ? 'Your KYC credentials are approved. Proceed to create and publish your property listing.'
                  : status === 'pending'
                    ? 'Your KYC documents have been submitted and are currently under review by Oruvia Trust & Safety. You can list properties once approved.'
                    : status === 'rejected'
                      ? rejectionReason ||
                        'Your previous KYC submission could not be verified. Please resubmit clear documents.'
                      : 'To protect seekers from unverified listings, only verified Agents and Landlords can list properties on Oruvia.'}
              </p>
            </div>
          </div>

          {/* Checklist for Unverified / Rejected */}
          {!isVerified && status !== 'pending' ? (
            <div className="rounded-[var(--radius-md)] border border-line bg-surface-muted/40 p-4 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-700">
                What you will need for KYC
              </p>
              <ul className="space-y-2 text-xs text-ink-700">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={14} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>
                    Valid Government ID (NIN, International Passport, Driver’s License, or PVC)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={14} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>Clear portrait selfie photo for identity confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={14} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>
                    {isLandlord
                      ? 'Proof of ownership or utility bill (C of O, Deed of Assignment, Survey Plan, or Utility Bill)'
                      : 'Office address and optional agency / CAC license details'}
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  )
}

