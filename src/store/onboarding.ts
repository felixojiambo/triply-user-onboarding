import { defineStore } from 'pinia'
import type {
  PersonalDetails,
  BusinessDetails,
  VerificationState,
} from '@/types/onboarding'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    currentStep: 1 as number,
    personal: {} as PersonalDetails,
    business: {} as BusinessDetails,
    verification: {
      emailCode: '',
      isCodeSent: false,
      isVerified: false,
    } as VerificationState,
    loading: false as boolean,
    errors: {} as Record<string, string>,
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
