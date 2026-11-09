import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Card } from '@/components/cards/Card'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Input } from '@/components/ui/Input'
import { useAppDispatch } from '@/store/hooks'
import { DEMO_USERS, switchDemoRole } from '@/store/slices/authSlice'
import { addToast } from '@/store/slices/uiSlice'
import type { UserRole } from '@/types/domain'

export default function AuthView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isSignup = pathname.includes('signup')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [selectedRole, setSelectedRole] = useState<UserRole>('seeker')
  const [emailOrPhone, setEmailOrPhone] = useState('tunde.bakare@oruvia.ng')
  const [otpCode, setOtpCode] = useState('849201')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(switchDemoRole(selectedRole))
    dispatch(
      addToast({
        title: `Welcome to Oruvia, ${DEMO_USERS[selectedRole].name}!`,
        description: `Signed in as ${selectedRole.toUpperCase()}.`,
        tone: 'success',
      }),
    )
    navigate({
      to: selectedRole === 'agent' || selectedRole === 'landlord' ? '/dashboard' : '/',
    })
  }

  return (
    <PageContainer className="py-12 flex justify-center">
      <Card variant="elevated" padding="lg" className="w-full max-w-md space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Oruvia — Your path to a roof
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">
            {isSignup ? 'Create your Oruvia account' : 'Welcome back to Oruvia'}
          </h1>
          <p className="mt-1 text-xs text-ink-500">
            Sign in with email or Nigerian phone OTP as a Seeker, Agent, or Direct Landlord.
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-700">
            Choose your role
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['seeker', 'agent', 'landlord'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`rounded-[var(--radius-sm)] border py-2.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  selectedRole === role
                    ? 'border-ink-900 bg-ink-900 text-surface'
                    : 'border-line bg-surface text-ink-700 hover:border-ink-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email or Nigerian Phone (+234)" required>
            {({ id }) => (
              <Input
                id={id}
                leftIcon="mail"
                autoComplete="username"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            )}
          </FormField>

          <FormField label="6-Digit OTP Code" required hint="Demo OTP pre-filled for instant access">
            {({ id }) => (
              <Input
                id={id}
                autoComplete="one-time-code"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
            )}
          </FormField>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {isSignup ? `Continue as ${selectedRole}` : `Sign in as ${selectedRole}`}
          </Button>
        </form>

        <Divider label="or switch mode" />

        <p className="text-center text-xs text-ink-700">
          {isSignup ? 'Already have an account? ' : 'New to Oruvia? '}
          <Link
            to={isSignup ? '/login' : '/signup'}
            className="font-bold text-brand-600 underline underline-offset-4"
          >
            {isSignup ? 'Log in here' : 'Create an account'}
          </Link>
        </p>
      </Card>
    </PageContainer>
  )
}

