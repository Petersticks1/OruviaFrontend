import { useMutation, useQueryClient } from '@tanstack/react-query'
import { agentsService } from '../index'
import { QUERY_KEYS } from '../queries/agents'
import type {
  AgentLoginPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  RegisterAgentPayload,
  ResendVerificationCodePayload,
  ResetPasswordPayload,
  UpdateAgentProfilePayload,
  VerifyEmailPayload,
} from '../types'
import { getApiErrorMessage } from '../utils'
import { showOruviaToast } from '../../utils/toast'

// ── Register Agent ────────────────────────────────────────────────────────────
export const UseRegisterAgentMutation = () => {
  const {
    isPending: registerAgentIsPending,
    mutate: registerAgentMutation,
    mutateAsync: registerAgentMutationAsync,
  } = useMutation({
    mutationFn: async (payload: RegisterAgentPayload) =>
      await agentsService.registerAgentService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Agent account created! Please verify your email.')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to register agent account.'))
    },
  })

  return {
    registerAgentIsPending,
    registerAgentMutation,
    registerAgentMutationAsync,
  }
}

// ── Verify Agent Email ────────────────────────────────────────────────────────
export const UseVerifyAgentEmailMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: verifyAgentEmailIsPending,
    mutate: verifyAgentEmailMutation,
    mutateAsync: verifyAgentEmailMutationAsync,
  } = useMutation({
    mutationFn: async (payload: VerifyEmailPayload) =>
      await agentsService.verifyAgentEmailService(payload),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Agent email verified successfully!',
      )
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AGENT_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to verify agent email.'))
    },
  })

  return {
    verifyAgentEmailIsPending,
    verifyAgentEmailMutation,
    verifyAgentEmailMutationAsync,
  }
}

// ── Resend Agent Verification Code ────────────────────────────────────────────
export const UseResendAgentVerificationCodeMutation = () => {
  const {
    isPending: resendAgentVerificationCodeIsPending,
    mutate: resendAgentVerificationCodeMutation,
    mutateAsync: resendAgentVerificationCodeMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ResendVerificationCodePayload) =>
      await agentsService.resendAgentVerificationCodeService(payload),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Verification code resent to your email!',
      )
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to resend verification code.'))
    },
  })

  return {
    resendAgentVerificationCodeIsPending,
    resendAgentVerificationCodeMutation,
    resendAgentVerificationCodeMutationAsync,
  }
}

// ── Login Agent ───────────────────────────────────────────────────────────────
export const UseLoginAgentMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: loginAgentIsPending,
    mutate: loginAgentMutation,
    mutateAsync: loginAgentMutationAsync,
  } = useMutation({
    mutationFn: async (payload: AgentLoginPayload) =>
      await agentsService.loginAgentService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Agent logged in successfully!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AGENT_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Invalid agent login credentials.'))
    },
  })

  return {
    loginAgentIsPending,
    loginAgentMutation,
    loginAgentMutationAsync,
  }
}

// ── Forgot Agent Password ─────────────────────────────────────────────────────
export const UseForgotAgentPasswordMutation = () => {
  const {
    isPending: forgotAgentPasswordIsPending,
    mutate: forgotAgentPasswordMutation,
    mutateAsync: forgotAgentPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) =>
      await agentsService.forgotAgentPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Password reset instructions sent to your email.',
      )
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to send password reset code.'))
    },
  })

  return {
    forgotAgentPasswordIsPending,
    forgotAgentPasswordMutation,
    forgotAgentPasswordMutationAsync,
  }
}

// ── Reset Agent Password ──────────────────────────────────────────────────────
export const UseResetAgentPasswordMutation = () => {
  const {
    isPending: resetAgentPasswordIsPending,
    mutate: resetAgentPasswordMutation,
    mutateAsync: resetAgentPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) =>
      await agentsService.resetAgentPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Agent password reset successfully! Please log in.',
      )
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to reset agent password.'))
    },
  })

  return {
    resetAgentPasswordIsPending,
    resetAgentPasswordMutation,
    resetAgentPasswordMutationAsync,
  }
}

// ── Change Agent Password ─────────────────────────────────────────────────────
export const UseChangeAgentPasswordMutation = () => {
  const {
    isPending: changeAgentPasswordIsPending,
    mutate: changeAgentPasswordMutation,
    mutateAsync: changeAgentPasswordMutationAsync,
  } = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) =>
      await agentsService.changeAgentPasswordService(payload),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Agent password updated successfully!',
      )
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to change agent password.'))
    },
  })

  return {
    changeAgentPasswordIsPending,
    changeAgentPasswordMutation,
    changeAgentPasswordMutationAsync,
  }
}

// ── Update Agent Profile (PATCH /agents/me) ───────────────────────────────────
export const UseUpdateAgentMeMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateAgentMeIsPending,
    mutate: updateAgentMeMutation,
    mutateAsync: updateAgentMeMutationAsync,
  } = useMutation({
    mutationFn: async (payload: UpdateAgentProfilePayload) =>
      await agentsService.updateAgentMeService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Agent profile updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AGENT_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to update agent profile.'))
    },
  })

  return {
    updateAgentMeIsPending,
    updateAgentMeMutation,
    updateAgentMeMutationAsync,
  }
}

// ── Submit Agent KYC (POST /agents/kyc) ───────────────────────────────────────
export const UseSubmitAgentKycMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: submitAgentKycIsPending,
    mutate: submitAgentKycMutation,
    mutateAsync: submitAgentKycMutationAsync,
  } = useMutation({
    mutationFn: async (payload: FormData) => await agentsService.submitAgentKycService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Agent KYC documents submitted for review!')
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AGENT_KYC] })
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_AGENT_ME] })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to submit agent KYC documents.'))
    },
  })

  return {
    submitAgentKycIsPending,
    submitAgentKycMutation,
    submitAgentKycMutationAsync,
  }
}
