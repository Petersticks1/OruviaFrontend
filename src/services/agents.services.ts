import { authorizedRequest, unauthorizedRequest } from './axios'
import type {
  AgentLoginPayload,
  APISuccessResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  RegisterAgentPayload,
  ResendVerificationCodePayload,
  ResetPasswordPayload,
  UpdateAgentProfilePayload,
  VerifyEmailPayload,
} from './types'

export class AgentsService {
  static register = '/agents/register'
  static verifyEmail = '/agents/verify-email'
  static resendVerificationCode = '/agents/resend-verification-code'
  static login = '/agents/login'
  static forgotPassword = '/agents/forgot-password'
  static resetPassword = '/agents/reset-password'
  static changePassword = '/agents/change-password'
  static getMe = '/agents/me'
  static updateMe = '/agents/me'

  async registerAgentService(payload: RegisterAgentPayload) {
    try {
      return await unauthorizedRequest<RegisterAgentPayload, APISuccessResponse>(
        'POST',
        AgentsService.register,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in registerAgentService:', error)
      throw error
    }
  }

  async verifyAgentEmailService(payload: VerifyEmailPayload) {
    try {
      return await unauthorizedRequest<VerifyEmailPayload, APISuccessResponse>(
        'POST',
        AgentsService.verifyEmail,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in verifyAgentEmailService:', error)
      throw error
    }
  }

  async resendAgentVerificationCodeService(payload: ResendVerificationCodePayload) {
    try {
      return await unauthorizedRequest<ResendVerificationCodePayload, APISuccessResponse>(
        'POST',
        AgentsService.resendVerificationCode,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in resendAgentVerificationCodeService:', error)
      throw error
    }
  }

  async loginAgentService(payload: AgentLoginPayload) {
    try {
      return await unauthorizedRequest<AgentLoginPayload, APISuccessResponse>(
        'POST',
        AgentsService.login,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in loginAgentService:', error)
      throw error
    }
  }

  async forgotAgentPasswordService(payload: ForgotPasswordPayload) {
    try {
      return await unauthorizedRequest<ForgotPasswordPayload, APISuccessResponse>(
        'POST',
        AgentsService.forgotPassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in forgotAgentPasswordService:', error)
      throw error
    }
  }

  async resetAgentPasswordService(payload: ResetPasswordPayload) {
    try {
      return await unauthorizedRequest<ResetPasswordPayload, APISuccessResponse>(
        'POST',
        AgentsService.resetPassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in resetAgentPasswordService:', error)
      throw error
    }
  }

  async changeAgentPasswordService(payload: ChangePasswordPayload) {
    try {
      return await authorizedRequest<ChangePasswordPayload, APISuccessResponse>(
        'POST',
        AgentsService.changePassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in changeAgentPasswordService:', error)
      throw error
    }
  }

  async getAgentMeService() {
    try {
      return await authorizedRequest<null, APISuccessResponse>(
        'GET',
        AgentsService.getMe,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getAgentMeService:', error)
      throw error
    }
  }

  async updateAgentMeService(payload: UpdateAgentProfilePayload) {
    try {
      return await authorizedRequest<UpdateAgentProfilePayload, APISuccessResponse>(
        'PATCH',
        AgentsService.updateMe,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in updateAgentMeService:', error)
      throw error
    }
  }
}

