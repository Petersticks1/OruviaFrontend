import { useState } from 'react'
import { SectionCard } from '@/components/cards/SectionCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAppDispatch } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'

export default function VerifyView() {
  const dispatch = useAppDispatch()
  const [idType, setIdType] = useState('nin')
  const [idNumber, setIdNumber] = useState('48192039481')
  const [submitted, setSubmitted] = useState(false)

  return (
    <PageContainer narrow className="py-8 space-y-6">
      <SectionHeader
        eyebrow="Trust & Safety"
        title="Agent & Landlord Identity Verification"
        subtitle="Earn the teal Oruvia Verified badge by verifying your Government ID and property title."
        action={<VerifiedBadge />}
      />

      <SectionCard
        title="Submit Verification Documents"
        subtitle="Verified listers receive 3.4× more inspection requests from seekers."
        action={<StatusBadge status={submitted ? 'pending_review' : 'verified'} />}
        footer={
          <Button
            variant="primary"
            leftIcon="verified"
            onClick={() => {
              setSubmitted(true)
              dispatch(
                addToast({
                  title: 'Verification documents submitted',
                  description: 'Oruvia Trust & Safety will confirm your ID within 1 hour.',
                  tone: 'success',
                }),
              )
            }}
          >
            Submit for verification
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-700">
              Government ID Type
            </label>
            <Select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              options={[
                { value: 'nin', label: 'National Identification Number (NIN)' },
                { value: 'passport', label: 'Nigerian International Passport' },
                { value: 'drivers_license', label: 'FRSC Driver’s License' },
                { value: 'esvarbon', label: 'ESVARBON / NIA Practice License' },
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-700">
              ID / Registration Number
            </label>
            <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  )
}

