import { defineStore } from 'pinia'
import type {
  PersonalDetails,
  BusinessDetails,
  VerificationState,
} from '@/types/onboarding'

// Export the store state shape for use in typings
export interface OnboardingState {
  currentStep: number
  personal: PersonalDetails
  business: BusinessDetails
  verification: VerificationState
  loading: boolean
  errors: Record<string, string>
}

export const useOnboardingStore = defineStore('onboarding', {
  state: (): OnboardingState => ({
    currentStep: 1,
    personal: {} as PersonalDetails,
    business: {} as BusinessDetails,
    verification: {
      emailCode: '',
      isCodeSent: false,
      isVerified: false,
    },
    loading: false,
    errors: {},
  }),
  actions: {
    next() {
      if (this.currentStep < 3) this.currentStep++
    },
    prev() {
      if (this.currentStep > 1) this.currentStep--
    },
    updatePersonal(payload: PersonalDetails) {
      this.personal = payload
    },
    updateBusiness(payload: BusinessDetails) {
      this.business = payload
    },
    updateVerification(payload: VerificationState) {
      this.verification = payload
    },
    reset() {
      this.currentStep = 1
      this.personal = {} as PersonalDetails
      this.business = {} as BusinessDetails
      this.verification = {
        emailCode: '',
        isCodeSent: false,
        isVerified: false,
      }
      this.loading = false
      this.errors = {}
    },
  },
})
