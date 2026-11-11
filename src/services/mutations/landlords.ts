import { useMutation, useQueryClient } from '@tanstack/react-query'
import { landlordsService } from '../index'
import { QUERY_KEYS } from '../queries/landlords'
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LandlordLoginPayload,
  RegisterLandlordPayload,
  ResendVerificationCodePayload,
  ResetPasswordPayload,
  UpdateLandlordProfilePayload,
  VerifyEmailPayload,
} from '../types'
import { showOruviaToast } from '../../utils/toast'

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

// ── Register Landlord ─────────────────────────────────────────────────────────
export const UseRegisterLandlordMutation = () => {
  const {
    isPending: registerLandlordIsPending,
    mutate: registerLandlordMutation,
    mutateAsync: registerLandlordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: RegisterLandlordPayload) =>
      await landlordsService.registerLandlordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Landlord account created! Please verify your email.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to register landlord account.'))
    },
  })

  return {
    registerLandlordIsPending,
    registerLandlordMutation,
    registerLandlordMutationAsync,
  }
}

// ── Verify Landlord Email ─────────────────────────────────────────────────────
export const UseVerifyLandlordEmailMutation = () => {
  const {
    isPending: verifyLandlordEmailIsPending,
    mutate: verifyLandlordEmailMutation,
    mutateAsync: verifyLandlordEmailMutationAsync,
  } = useMutation({
    mutationFn: async (payload: VerifyEmailPayload) =>
      await landlordsService.verifyLandlordEmailService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Landlord email verified successfully!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to verify landlord email.'))
    },
  })

  return {
    verifyLandlordEmailIsPending,
    verifyLandlordEmailMutation,
    verifyLandlordEmailMutationAsync,
  }
}

// ── Resend Landlord Verification Code ─────────────────────────────────────────
export const UseResendLandlordVerificationCodeMutation = () => {
  const {
    isPending: resendLandlordVerificationCodeIsPending,
    mutate: resendLandlordVerificationCodeMutation,
    mutateAsync: resendLandlordVerificationCodeMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ResendVerificationCodePayload) =>
      await landlordsService.resendLandlordVerificationCodeService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Verification code resent to your email!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to resend verification code.'))
    },
  })

  return {
    resendLandlordVerificationCodeIsPending,
    resendLandlordVerificationCodeMutation,
    resendLandlordVerificationCodeMutationAsync,
  }
}

// ── Login Landlord ────────────────────────────────────────────────────────────
export const UseLoginLandlordMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: loginLandlordIsPending,
    mutate: loginLandlordMutation,
    mutateAsync: loginLandlordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: LandlordLoginPayload) =>
      await landlordsService.loginLandlordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Landlord logged in successfully!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_LANDLORD_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Invalid landlord login credentials.'))
    },
  })

  return {
    loginLandlordIsPending,
    loginLandlordMutation,
    loginLandlordMutationAsync,
  }
}

// ── Forgot Landlord Password ──────────────────────────────────────────────────
export const UseForgotLandlordPasswordMutation = () => {
  const {
    isPending: forgotLandlordPasswordIsPending,
    mutate: forgotLandlordPasswordMutation,
    mutateAsync: forgotLandlordPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) =>
      await landlordsService.forgotLandlordPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Password reset instructions sent to your email.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to send password reset code.'))
    },
  })

  return {
    forgotLandlordPasswordIsPending,
    forgotLandlordPasswordMutation,
    forgotLandlordPasswordMutationAsync,
  }
}

// ── Reset Landlord Password ───────────────────────────────────────────────────
export const UseResetLandlordPasswordMutation = () => {
  const {
    isPending: resetLandlordPasswordIsPending,
    mutate: resetLandlordPasswordMutation,
    mutateAsync: resetLandlordPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) =>
      await landlordsService.resetLandlordPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Landlord password reset successfully! Please log in.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to reset landlord password.'))
    },
  })

  return {
    resetLandlordPasswordIsPending,
    resetLandlordPasswordMutation,
    resetLandlordPasswordMutationAsync,
  }
}

// ── Change Landlord Password ──────────────────────────────────────────────────
export const UseChangeLandlordPasswordMutation = () => {
  const {
    isPending: changeLandlordPasswordIsPending,
    mutate: changeLandlordPasswordMutation,
    mutateAsync: changeLandlordPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) =>
      await landlordsService.changeLandlordPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Landlord password updated successfully!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to change landlord password.'))
    },
  })

  return {
    changeLandlordPasswordIsPending,
    changeLandlordPasswordMutation,
    changeLandlordPasswordMutationAsync,
  }
}

// ── Update Landlord Profile (PATCH /landlords/me) ─────────────────────────────
export const UseUpdateLandlordMeMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateLandlordMeIsPending,
    mutate: updateLandlordMeMutation,
    mutateAsync: updateLandlordMeMutationAsync,
  } = useMutation({
    mutationFn: async (payload: UpdateLandlordProfilePayload) =>
      await landlordsService.updateLandlordMeService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Landlord profile updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_LANDLORD_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getErrorMessage(error, 'Failed to update landlord profile.'))
    },
  })

  return {
    updateLandlordMeIsPending,
    updateLandlordMeMutation,
    updateLandlordMeMutationAsync,
  }
}

