import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card } from '@/components/cards/Card'
import { FormField } from '@/components/shared/FormField'
import { PageContainer } from '@/components/shared/PageContainer'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Input } from '@/components/ui/Input'
import { mapProfileDtoToDomain } from '@/features/listings/api/mappers'
import {
  UseForgotAgentPasswordMutation,
  UseForgotLandlordPasswordMutation,
  UseForgotSeekerPasswordMutation,
  UseLoginAgentMutation,
  UseLoginLandlordMutation,
  UseLoginSeekerMutation,
  UseRegisterAgentMutation,
  UseRegisterLandlordMutation,
  UseRegisterSeekerMutation,
  UseResendAgentVerificationCodeMutation,
  UseResendLandlordVerificationCodeMutation,
  UseResendSeekerVerificationCodeMutation,
  UseResetAgentPasswordMutation,
  UseResetLandlordPasswordMutation,
  UseResetSeekerPasswordMutation,
  UseVerifyAgentEmailMutation,
  UseVerifyLandlordEmailMutation,
  UseVerifySeekerEmailMutation,
} from '@/services/mutations'
import { useAppDispatch } from '@/store/hooks'
import { setSession } from '@/store/slices/authSlice'
import { addToast } from '@/store/slices/uiSlice'

type AccountRole = 'seeker' | 'agent' | 'landlord'
type AuthMode = 'login' | 'signup' | 'verify-email' | 'forgot-password' | 'reset-password'

export default function AuthView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isSignupPath = pathname.includes('signup')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [mode, setMode] = useState<AuthMode>(isSignupPath ? 'signup' : 'login')
  const [selectedRole, setSelectedRole] = useState<AccountRole>('seeker')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [agencyOrCompany, setAgencyOrCompany] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [bio, setBio] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    setMode(isSignupPath ? 'signup' : 'login')
  }, [isSignupPath])

  const { loginSeekerIsPending, loginSeekerMutationAsync } = UseLoginSeekerMutation()
  const { loginAgentIsPending, loginAgentMutationAsync } = UseLoginAgentMutation()
  const { loginLandlordIsPending, loginLandlordMutationAsync } = UseLoginLandlordMutation()

  const { registerSeekerIsPending, registerSeekerMutationAsync } = UseRegisterSeekerMutation()
  const { registerAgentIsPending, registerAgentMutationAsync } = UseRegisterAgentMutation()
  const { registerLandlordIsPending, registerLandlordMutationAsync } =
    UseRegisterLandlordMutation()

  const { verifySeekerEmailIsPending, verifySeekerEmailMutationAsync } =
    UseVerifySeekerEmailMutation()
  const { verifyAgentEmailIsPending, verifyAgentEmailMutationAsync } =
    UseVerifyAgentEmailMutation()
  const { verifyLandlordEmailIsPending, verifyLandlordEmailMutationAsync } =
    UseVerifyLandlordEmailMutation()

  const { resendSeekerVerificationCodeIsPending, resendSeekerVerificationCodeMutationAsync } =
    UseResendSeekerVerificationCodeMutation()
  const { resendAgentVerificationCodeIsPending, resendAgentVerificationCodeMutationAsync } =
    UseResendAgentVerificationCodeMutation()
  const { resendLandlordVerificationCodeIsPending, resendLandlordVerificationCodeMutationAsync } =
    UseResendLandlordVerificationCodeMutation()

  const { forgotSeekerPasswordIsPending, forgotSeekerPasswordMutationAsync } =
    UseForgotSeekerPasswordMutation()
  const { forgotAgentPasswordIsPending, forgotAgentPasswordMutationAsync } =
    UseForgotAgentPasswordMutation()
  const { forgotLandlordPasswordIsPending, forgotLandlordPasswordMutationAsync } =
    UseForgotLandlordPasswordMutation()

  const { resetSeekerPasswordIsPending, resetSeekerPasswordMutationAsync } =
    UseResetSeekerPasswordMutation()
  const { resetAgentPasswordIsPending, resetAgentPasswordMutationAsync } =
    UseResetAgentPasswordMutation()
  const { resetLandlordPasswordIsPending, resetLandlordPasswordMutationAsync } =
    UseResetLandlordPasswordMutation()

  const isSubmitting =
    loginSeekerIsPending ||
    loginAgentIsPending ||
    loginLandlordIsPending ||
    registerSeekerIsPending ||
    registerAgentIsPending ||
    registerLandlordIsPending ||
    verifySeekerEmailIsPending ||
    verifyAgentEmailIsPending ||
    verifyLandlordEmailIsPending ||
    forgotSeekerPasswordIsPending ||
    forgotAgentPasswordIsPending ||
    forgotLandlordPasswordIsPending ||
    resetSeekerPasswordIsPending ||
    resetAgentPasswordIsPending ||
    resetLandlordPasswordIsPending

  const isResending =
    resendSeekerVerificationCodeIsPending ||
    resendAgentVerificationCodeIsPending ||
    resendLandlordVerificationCodeIsPending

  const completeAuthNavigation = (role: AccountRole) => {
    navigate({
      to: role === 'agent' || role === 'landlord' ? '/dashboard' : '/',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (mode === 'login') {
        const credentials = { email: email.trim(), password }
        if (selectedRole === 'seeker') {
          const res = await loginSeekerMutationAsync(credentials)
          const user = mapProfileDtoToDomain(res.data.seeker)
          dispatch(setSession({ token: res.data.access_token, user }))
        } else if (selectedRole === 'agent') {
          const res = await loginAgentMutationAsync(credentials)
          const user = mapProfileDtoToDomain(res.data.agent)
          dispatch(setSession({ token: res.data.access_token, user }))
        } else {
          const res = await loginLandlordMutationAsync(credentials)
          const user = mapProfileDtoToDomain(res.data.landlord)
          dispatch(setSession({ token: res.data.access_token, user }))
        }
        completeAuthNavigation(selectedRole)
        return
      }

      if (mode === 'signup') {
        const trimmedEmail = email.trim()
        const trimmedName = fullName.trim()
        const trimmedPhone = phone.trim() || undefined
        let isVerified = false

        if (selectedRole === 'seeker') {
          const res = await registerSeekerMutationAsync({
            full_name: trimmedName,
            email: trimmedEmail,
            password,
            phone: trimmedPhone,
            preferred_location: preferredLocation.trim() || undefined,
          })
          const user = mapProfileDtoToDomain(res.data.seeker)
          dispatch(setSession({ token: res.data.access_token, user }))
          isVerified = res.data.seeker.is_email_verified
        } else if (selectedRole === 'agent') {
          const res = await registerAgentMutationAsync({
            full_name: trimmedName,
            email: trimmedEmail,
            password,
            phone: trimmedPhone,
            whatsapp_number: whatsappNumber.trim() || undefined,
            agency_name: agencyOrCompany.trim() || undefined,
            license_number: licenseNumber.trim() || undefined,
            bio: bio.trim() || undefined,
          })
          const user = mapProfileDtoToDomain(res.data.agent)
          dispatch(setSession({ token: res.data.access_token, user }))
          isVerified = res.data.agent.is_email_verified
        } else {
          const res = await registerLandlordMutationAsync({
            full_name: trimmedName,
            email: trimmedEmail,
            password,
            phone: trimmedPhone,
            whatsapp_number: whatsappNumber.trim() || undefined,
            company_name: agencyOrCompany.trim() || undefined,
            bio: bio.trim() || undefined,
          })
          const user = mapProfileDtoToDomain(res.data.landlord)
          dispatch(setSession({ token: res.data.access_token, user }))
          isVerified = res.data.landlord.is_email_verified
        }

        if (!isVerified) {
          setMode('verify-email')
          dispatch(
            addToast({
              title: 'Verify your email address',
              description: `Enter the verification code sent to ${trimmedEmail}.`,
              tone: 'info',
            }),
          )
        } else {
          completeAuthNavigation(selectedRole)
        }
        return
      }

      if (mode === 'verify-email') {
        const payload = { email: email.trim(), code: verificationCode.trim() }
        if (selectedRole === 'seeker') {
          await verifySeekerEmailMutationAsync(payload)
        } else if (selectedRole === 'agent') {
          await verifyAgentEmailMutationAsync(payload)
        } else {
          await verifyLandlordEmailMutationAsync(payload)
        }
        completeAuthNavigation(selectedRole)
        return
      }

      if (mode === 'forgot-password') {
        const payload = { email: email.trim() }
        if (selectedRole === 'seeker') {
          await forgotSeekerPasswordMutationAsync(payload)
        } else if (selectedRole === 'agent') {
          await forgotAgentPasswordMutationAsync(payload)
        } else {
          await forgotLandlordPasswordMutationAsync(payload)
        }
        setMode('reset-password')
        return
      }

      if (mode === 'reset-password') {
        const payload = {
          email: email.trim(),
          code: verificationCode.trim(),
          new_password: newPassword,
        }
        if (selectedRole === 'seeker') {
          await resetSeekerPasswordMutationAsync(payload)
        } else if (selectedRole === 'agent') {
          await resetAgentPasswordMutationAsync(payload)
        } else {
          await resetLandlordPasswordMutationAsync(payload)
        }
        setPassword('')
        setNewPassword('')
        setVerificationCode('')
        setMode('login')
      }
    } catch {
      // Mutation hooks surface backend validation errors via toast notifications
    }
  }

  const handleResendCode = async () => {
    if (!email.trim()) return
    try {
      const payload = { email: email.trim() }
      if (selectedRole === 'seeker') {
        await resendSeekerVerificationCodeMutationAsync(payload)
      } else if (selectedRole === 'agent') {
        await resendAgentVerificationCodeMutationAsync(payload)
      } else {
        await resendLandlordVerificationCodeMutationAsync(payload)
      }
    } catch {
      // Handled by mutation hook
    }
  }

  const headingByMode: Record<AuthMode, string> = {
    login: 'Welcome back to Oruvia',
    signup: 'Create your Oruvia account',
    'verify-email': 'Verify your email',
    'forgot-password': 'Reset your password',
    'reset-password': 'Enter new password',
  }

  const subtitleByMode: Record<AuthMode, string> = {
    login: 'Sign in with your registered email and password as a Seeker, Agent, or Landlord.',
    signup: 'Register an account to save homes, schedule inspections, or publish listings.',
    'verify-email': 'Enter the verification code sent to your email address.',
    'forgot-password': 'We will send a password reset code to your account email.',
    'reset-password': 'Enter the reset code from your email and choose a new password.',
  }

  return (
    <PageContainer className="py-12 flex justify-center">
      <Card variant="elevated" padding="lg" className="w-full max-w-md space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Oruvia — Your path to a roof
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">{headingByMode[mode]}</h1>
          <p className="mt-1 text-xs text-ink-500">{subtitleByMode[mode]}</p>
        </div>

        {/* Role Selector */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-700">
            Account type
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['seeker', 'agent', 'landlord'] as AccountRole[]).map((role) => (
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
          {mode === 'signup' ? (
            <FormField label="Full Name" required>
              {({ id }) => (
                <Input
                  id={id}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
            </FormField>
          ) : null}

          <FormField label="Email Address" required>
            {({ id }) => (
              <Input
                id={id}
                type="email"
                leftIcon="mail"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
          </FormField>

          {mode === 'signup' ? (
            <>
              <FormField label="Phone Number">
                {({ id }) => (
                  <Input
                    id={id}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                )}
              </FormField>

              {selectedRole === 'seeker' ? (
                <FormField label="Preferred Location">
                  {({ id }) => (
                    <Input
                      id={id}
                      placeholder="e.g. Abeokuta, Ogun"
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                    />
                  )}
                </FormField>
              ) : null}

              {selectedRole === 'agent' || selectedRole === 'landlord' ? (
                <>
                  <FormField label="WhatsApp Number">
                    {({ id }) => (
                      <Input
                        id={id}
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                      />
                    )}
                  </FormField>

                  <FormField
                    label={selectedRole === 'agent' ? 'Agency Name' : 'Company Name'}
                  >
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder={
                          selectedRole === 'agent'
                            ? 'e.g. Bakare Realty'
                            : 'e.g. Nwosu Estates'
                        }
                        value={agencyOrCompany}
                        onChange={(e) => setAgencyOrCompany(e.target.value)}
                      />
                    )}
                  </FormField>

                  {selectedRole === 'agent' ? (
                    <FormField label="Practice License Number (optional)">
                      {({ id }) => (
                        <Input
                          id={id}
                          placeholder="e.g. OG-AG-2026-019"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                        />
                      )}
                    </FormField>
                  ) : null}

                  <FormField label="Bio / Summary">
                    {({ id }) => (
                      <Input
                        id={id}
                        placeholder={
                          selectedRole === 'agent'
                            ? 'e.g. Licensed residential agent in Ogun State.'
                            : 'e.g. Direct property owner across Abeokuta.'
                        }
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    )}
                  </FormField>
                </>
              ) : null}
            </>
          ) : null}

          {mode === 'login' || mode === 'signup' ? (
            <FormField label="Password" required>
              {({ id }) => (
                <Input
                  id={id}
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              )}
            </FormField>
          ) : null}

          {mode === 'verify-email' || mode === 'reset-password' ? (
            <FormField label="Verification Code" required>
              {({ id }) => (
                <Input
                  id={id}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  placeholder="Enter code from email"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              )}
            </FormField>
          ) : null}

          {mode === 'reset-password' ? (
            <FormField label="New Password" required>
              {({ id }) => (
                <Input
                  id={id}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              )}
            </FormField>
          ) : null}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
            {mode === 'login' && `Sign in as ${selectedRole}`}
            {mode === 'signup' && `Create ${selectedRole} account`}
            {mode === 'verify-email' && 'Verify Email'}
            {mode === 'forgot-password' && 'Send Reset Code'}
            {mode === 'reset-password' && 'Update Password'}
          </Button>
        </form>

        {mode === 'login' ? (
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="font-semibold text-ink-700 hover:text-ink-900 underline cursor-pointer"
            >
              Forgot password?
            </button>
            <button
              type="button"
              onClick={() => setMode('verify-email')}
              className="font-semibold text-ink-700 hover:text-ink-900 underline cursor-pointer"
            >
              Verify email code
            </button>
          </div>
        ) : null}

        {mode === 'verify-email' ? (
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || !email.trim()}
              className="font-semibold text-brand-600 underline disabled:opacity-50 cursor-pointer"
            >
              {isResending ? 'Sending code...' : 'Resend verification code'}
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="font-semibold text-ink-700 underline cursor-pointer"
            >
              Back to log in
            </button>
          </div>
        ) : null}

        {mode === 'forgot-password' || mode === 'reset-password' ? (
          <div className="text-center text-xs">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="font-semibold text-ink-700 underline cursor-pointer"
            >
              Back to log in
            </button>
          </div>
        ) : null}

        <Divider label="or switch mode" />

        <p className="text-center text-xs text-ink-700">
          {mode === 'signup' ? 'Already have an account? ' : 'New to Oruvia? '}
          <Link
            to={mode === 'signup' ? '/login' : '/signup'}
            className="font-bold text-brand-600 underline underline-offset-4"
          >
            {mode === 'signup' ? 'Log in here' : 'Create an account'}
          </Link>
        </p>
      </Card>
    </PageContainer>
  )
}

