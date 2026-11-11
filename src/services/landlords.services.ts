import { authorizedRequest, unauthorizedRequest } from './axios'
import type {
  APISuccessResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LandlordLoginPayload,
  RegisterLandlordPayload,
  ResendVerificationCodePayload,
  ResetPasswordPayload,
  UpdateLandlordProfilePayload,
  VerifyEmailPayload,
} from './types'

export class LandlordsService {
  static register = '/landlords/register'
  static verifyEmail = '/landlords/verify-email'
  static resendVerificationCode = '/landlords/resend-verification-code'
  static login = '/landlords/login'
  static forgotPassword = '/landlords/forgot-password'
  static resetPassword = '/landlords/reset-password'
  static changePassword = '/landlords/change-password'
  static getMe = '/landlords/me'
  static updateMe = '/landlords/me'

  async registerLandlordService(payload: RegisterLandlordPayload) {
    try {
      return await unauthorizedRequest<RegisterLandlordPayload, APISuccessResponse>(
        'POST',
        LandlordsService.register,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in registerLandlordService:', error)
      throw error
    }
  }

  async verifyLandlordEmailService(payload: VerifyEmailPayload) {
    try {
      return await unauthorizedRequest<VerifyEmailPayload, APISuccessResponse>(
        'POST',
        LandlordsService.verifyEmail,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in verifyLandlordEmailService:', error)
      throw error
    }
  }

  async resendLandlordVerificationCodeService(payload: ResendVerificationCodePayload) {
    try {
      return await unauthorizedRequest<ResendVerificationCodePayload, APISuccessResponse>(
        'POST',
        LandlordsService.resendVerificationCode,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in resendLandlordVerificationCodeService:', error)
      throw error
    }
  }

  async loginLandlordService(payload: LandlordLoginPayload) {
    try {
      return await unauthorizedRequest<LandlordLoginPayload, APISuccessResponse>(
        'POST',
        LandlordsService.login,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in loginLandlordService:', error)
      throw error
    }
  }

  async forgotLandlordPasswordService(payload: ForgotPasswordPayload) {
    try {
      return await unauthorizedRequest<ForgotPasswordPayload, APISuccessResponse>(
        'POST',
        LandlordsService.forgotPassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in forgotLandlordPasswordService:', error)
      throw error
    }
  }

  async resetLandlordPasswordService(payload: ResetPasswordPayload) {
    try {
      return await unauthorizedRequest<ResetPasswordPayload, APISuccessResponse>(
        'POST',
        LandlordsService.resetPassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in resetLandlordPasswordService:', error)
      throw error
    }
  }

  async changeLandlordPasswordService(payload: ChangePasswordPayload) {
    try {
      return await authorizedRequest<ChangePasswordPayload, APISuccessResponse>(
        'POST',
        LandlordsService.changePassword,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in changeLandlordPasswordService:', error)
      throw error
    }
  }

  async getLandlordMeService() {
    try {
      return await authorizedRequest<null, APISuccessResponse>(
        'GET',
        LandlordsService.getMe,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getLandlordMeService:', error)
      throw error
    }
  }

  async updateLandlordMeService(payload: UpdateLandlordProfilePayload) {
    try {
      return await authorizedRequest<UpdateLandlordProfilePayload, APISuccessResponse>(
        'PATCH',
        LandlordsService.updateMe,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in updateLandlordMeService:', error)
      throw error
    }
  }
}

