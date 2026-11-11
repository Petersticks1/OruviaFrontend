import { useMutation, useQueryClient } from '@tanstack/react-query'
import { seekersService } from '../index'
import { QUERY_KEYS } from '../queries/seekers'
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  RegisterSeekerPayload,
  ResendVerificationCodePayload,
  ResetPasswordPayload,
  SeekerLoginPayload,
  UpdateSeekerProfilePayload,
  VerifyEmailPayload,
} from '../types'
import { showOruviaToast } from '../../utils/toast'

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

// ── Register Seeker ───────────────────────────────────────────────────────────
export const UseRegisterSeekerMutation = () => {
  const {
    isPending: registerSeekerIsPending,
    mutate: registerSeekerMutation,
    mutateAsync: registerSeekerMutationAsync,
  } = useMutation({
    mutationFn: async (payload: RegisterSeekerPayload) =>
      await seekersService.registerSeekerService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Seeker account created! Please verify your email.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to register seeker account.'))
    },
  })

  return {
    registerSeekerIsPending,
    registerSeekerMutation,
    registerSeekerMutationAsync,
  }
}

// ── Verify Seeker Email ───────────────────────────────────────────────────────
export const UseVerifySeekerEmailMutation = () => {
  const {
    isPending: verifySeekerEmailIsPending,
    mutate: verifySeekerEmailMutation,
    mutateAsync: verifySeekerEmailMutationAsync,
  } = useMutation({
    mutationFn: async (payload: VerifyEmailPayload) =>
      await seekersService.verifySeekerEmailService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Email verified successfully!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to verify email.'))
    },
  })

  return {
    verifySeekerEmailIsPending,
    verifySeekerEmailMutation,
    verifySeekerEmailMutationAsync,
  }
}

// ── Resend Seeker Verification Code ───────────────────────────────────────────
export const UseResendSeekerVerificationCodeMutation = () => {
  const {
    isPending: resendSeekerVerificationCodeIsPending,
    mutate: resendSeekerVerificationCodeMutation,
    mutateAsync: resendSeekerVerificationCodeMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ResendVerificationCodePayload) =>
      await seekersService.resendSeekerVerificationCodeService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Verification code resent to your email!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to resend verification code.'))
    },
  })

  return {
    resendSeekerVerificationCodeIsPending,
    resendSeekerVerificationCodeMutation,
    resendSeekerVerificationCodeMutationAsync,
  }
}

// ── Login Seeker ──────────────────────────────────────────────────────────────
export const UseLoginSeekerMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: loginSeekerIsPending,
    mutate: loginSeekerMutation,
    mutateAsync: loginSeekerMutationAsync,
  } = useMutation({
    mutationFn: async (payload: SeekerLoginPayload) =>
      await seekersService.loginSeekerService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Logged in successfully!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SEEKER_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Invalid login credentials.'))
    },
  })

  return {
    loginSeekerIsPending,
    loginSeekerMutation,
    loginSeekerMutationAsync,
  }
}

// ── Forgot Seeker Password ────────────────────────────────────────────────────
export const UseForgotSeekerPasswordMutation = () => {
  const {
    isPending: forgotSeekerPasswordIsPending,
    mutate: forgotSeekerPasswordMutation,
    mutateAsync: forgotSeekerPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) =>
      await seekersService.forgotSeekerPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Password reset instructions sent to your email.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to send password reset code.'))
    },
  })

  return {
    forgotSeekerPasswordIsPending,
    forgotSeekerPasswordMutation,
    forgotSeekerPasswordMutationAsync,
  }
}

// ── Reset Seeker Password ─────────────────────────────────────────────────────
export const UseResetSeekerPasswordMutation = () => {
  const {
    isPending: resetSeekerPasswordIsPending,
    mutate: resetSeekerPasswordMutation,
    mutateAsync: resetSeekerPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) =>
      await seekersService.resetSeekerPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Password reset successfully! Please log in.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to reset password.'))
    },
  })

  return {
    resetSeekerPasswordIsPending,
    resetSeekerPasswordMutation,
    resetSeekerPasswordMutationAsync,
  }
}

// ── Change Seeker Password ────────────────────────────────────────────────────
export const UseChangeSeekerPasswordMutation = () => {
  const {
    isPending: changeSeekerPasswordIsPending,
    mutate: changeSeekerPasswordMutation,
    mutateAsync: changeSeekerPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) =>
      await seekersService.changeSeekerPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Password updated successfully!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to change password.'))
    },
  })

  return {
    changeSeekerPasswordIsPending,
    changeSeekerPasswordMutation,
    changeSeekerPasswordMutationAsync,
  }
}

// ── Update Seeker Profile (PATCH /seekers/me) ─────────────────────────────────
export const UseUpdateSeekerMeMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateSeekerMeIsPending,
    mutate: updateSeekerMeMutation,
    mutateAsync: updateSeekerMeMutationAsync,
  } = useMutation({
    mutationFn: async (payload: UpdateSeekerProfilePayload) =>
      await seekersService.updateSeekerMeService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Profile updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SEEKER_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to update seeker profile.'))
    },
  })

  return {
    updateSeekerMeIsPending,
    updateSeekerMeMutation,
    updateSeekerMeMutationAsync,
  }
}

