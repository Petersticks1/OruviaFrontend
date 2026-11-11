import { authorizedRequest, unauthorizedRequest } from './axios'
import type {
  APISuccessResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  RegisterSeekerPayload,
  ResendVerificationCodePayload,
  ResetPasswordPayload,
  SeekerLoginPayload,
  UpdateSeekerProfilePayload,
  VerifyEmailPayload,
} from './types'

export class SeekersService {
  static register = '/seekers/register'
  static verifyEmail = '/seekers/verify-email'
  static resendVerificationCode = '/seekers/resend-verification-code'
  static login = '/seekers/login'
  static forgotPassword = '/seekers/forgot-password'
  static resetPassword = '/seekers/reset-password'
  static changePassword = '/seekers/change-password'
  static getMe = '/seekers/me'
  static updateMe = '/seekers/me'

  async registerSeekerService(payload: RegisterSeekerPayload) {
    try {
      return await unauthorizedRequest<RegisterSeekerPayload, APISuccessResponse>(
        'POST',
        SeekersService.register,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in registerSeekerService:', error)
      throw error
    }
  }

  async verifySeekerEmailService(payload: VerifyEmailPayload) {
    try {
      return await unauthorizedRequest<VerifyEmailPayload, APISuccessResponse>(
        'POST',
        SeekersService.verifyEmail,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in verifySeekerEmailService:', error)
      throw error
    }
  }

  async resendSeekerVerificationCodeService(payload: ResendVerificationCodePayload) {
    try {
      return await unauthorizedRequest<ResendVerificationCodePayload, APISuccessResponse>(
        'POST',
        SeekersService.resendVerificationCode,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in resendSeekerVerificationCodeService:', error)
      throw error
    }
  }

  async loginSeekerService(payload: SeekerLoginPayload) {
    try {
      return await unauthorizedRequest<SeekerLoginPayload, APISuccessResponse>(
        'POST',
        SeekersService.login,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in loginSeekerService:', error)
      throw error
    }
  }

  async forgotSeekerPasswordService(payload: ForgotPasswordPayload) {
    try {
      return await unauthorizedRequest<ForgotPasswordPayload, APISuccessResponse>(
        'POST',
        SeekersService.forgotPassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in forgotSeekerPasswordService:', error)
      throw error
    }
  }

  async resetSeekerPasswordService(payload: ResetPasswordPayload) {
    try {
      return await unauthorizedRequest<ResetPasswordPayload, APISuccessResponse>(
        'POST',
        SeekersService.resetPassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in resetSeekerPasswordService:', error)
      throw error
    }
  }

  async changeSeekerPasswordService(payload: ChangePasswordPayload) {
    try {
      return await authorizedRequest<ChangePasswordPayload, APISuccessResponse>(
        'POST',
        SeekersService.changePassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in changeSeekerPasswordService:', error)
      throw error
    }
  }

  async getSeekerMeService() {
    try {
      return await authorizedRequest<null, APISuccessResponse>(
        'GET',
        SeekersService.getMe,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getSeekerMeService:', error)
      throw error
    }
  }

  async updateSeekerMeService(payload: UpdateSeekerProfilePayload) {
    try {
      return await authorizedRequest<UpdateSeekerProfilePayload, APISuccessResponse>(
        'PATCH',
        SeekersService.updateMe,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in updateSeekerMeService:', error)
      throw error
    }
  }
}

