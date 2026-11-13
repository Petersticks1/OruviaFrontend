import { authorizedRequest, unauthorizedRequest } from './axios'
import type {
  APISuccessResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LandlordAuthData,
  LandlordKycStatusDto,
  LandlordLoginPayload,
  LandlordProfileDto,
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
  static getKyc = '/landlords/kyc'
  static submitKyc = '/landlords/kyc'

  async registerLandlordService(payload: RegisterLandlordPayload) {
    try {
      return await unauthorizedRequest<RegisterLandlordPayload, APISuccessResponse<LandlordAuthData>>(
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
      return await unauthorizedRequest<
        VerifyEmailPayload,
        APISuccessResponse<{ message?: string; landlord: LandlordProfileDto }>
      >('POST', LandlordsService.verifyEmail, payload)
    } catch (error: unknown) {
      console.error('Error in verifyLandlordEmailService:', error)
      throw error
    }
  }

  async resendLandlordVerificationCodeService(payload: ResendVerificationCodePayload) {
    try {
      return await unauthorizedRequest<
        ResendVerificationCodePayload,
        APISuccessResponse<{ message?: string }>
      >('POST', LandlordsService.resendVerificationCode, payload)
    } catch (error: unknown) {
      console.error('Error in resendLandlordVerificationCodeService:', error)
      throw error
    }
  }

  async loginLandlordService(payload: LandlordLoginPayload) {
    try {
      return await unauthorizedRequest<LandlordLoginPayload, APISuccessResponse<LandlordAuthData>>(
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
      return await unauthorizedRequest<ForgotPasswordPayload, APISuccessResponse<{ message?: string }>>(
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
      return await unauthorizedRequest<ResetPasswordPayload, APISuccessResponse<{ message?: string }>>(
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
      return await authorizedRequest<ChangePasswordPayload, APISuccessResponse<{ message?: string }>>(
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
      return await authorizedRequest<null, APISuccessResponse<LandlordProfileDto>>(
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
      return await authorizedRequest<
        UpdateLandlordProfilePayload,
        APISuccessResponse<LandlordProfileDto>
      >('PATCH', LandlordsService.updateMe, payload)
    } catch (error: unknown) {
      console.error('Error in updateLandlordMeService:', error)
      throw error
    }
  }

  async getLandlordKycService() {
    try {
      return await authorizedRequest<null, APISuccessResponse<LandlordKycStatusDto>>(
        'GET',
        LandlordsService.getKyc,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getLandlordKycService:', error)
      throw error
    }
  }

  async submitLandlordKycService(payload: FormData) {
    try {
      return await authorizedRequest<FormData, APISuccessResponse<LandlordKycStatusDto>>(
        'POST',
        LandlordsService.submitKyc,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in submitLandlordKycService:', error)
      throw error
    }
  }
}
