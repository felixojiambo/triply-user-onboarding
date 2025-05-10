// src/store/onboarding.ts
import { defineStore } from 'pinia'
import type {
  PersonalDetails,
  BusinessDetails,
  VerificationState,
} from '@/types/onboarding'
import {
  fetchIndustriesMock,
  sendCodeMock,
  submitOnboardingMock,
} from '@/api/mockApi'

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
    next(): void {
      if (this.currentStep < 3) this.currentStep++
    },

    prev(): void {
      if (this.currentStep > 1) this.currentStep--
    },

    updatePersonal(payload: PersonalDetails): void {
      this.personal = payload
    },

    updateBusiness(payload: BusinessDetails): void {
      this.business = payload
    },

    updateVerification(payload: VerificationState): void {
      this.verification = payload
    },

    reset(): void {
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

    /** 
     * Retrieves industry options via mock API.
     */
    async fetchIndustries(): Promise<string[]> {
      this.loading = true
      try {
        return await fetchIndustriesMock()
      } finally {
        this.loading = false
      }
    },

    /**
     * Sends a verification code (mocked).
     * @param simulateError - whether to simulate a failure.
     */
    async sendCode(simulateError = false): Promise<string> {
      this.loading = true
      try {
        const { code } = await sendCodeMock(simulateError)
        this.verification.isCodeSent = true
        return code
      } finally {
        this.loading = false
      }
    },

    /**
     * Submits full onboarding payload (mocked).
     * @param simulateError - whether to simulate a failure.
     */
    async submitOnboarding(
      simulateError = false
    ): Promise<void> {
      this.loading = true
      try {
        await submitOnboardingMock(
          {
            personal: this.personal,
            business: this.business,
            verification: this.verification,
          },
          simulateError
        )
        this.verification.isVerified = true
      } finally {
        this.loading = false
      }
    },
  },
})

// import { defineStore } from 'pinia'
// import type {
//   PersonalDetails,
//   BusinessDetails,
//   VerificationState,
// } from '@/types/onboarding'

// // Export the store state shape for use in typings
// export interface OnboardingState {
//   currentStep: number
//   personal: PersonalDetails
//   business: BusinessDetails
//   verification: VerificationState
//   loading: boolean
//   errors: Record<string, string>
// }

// export const useOnboardingStore = defineStore('onboarding', {
//   state: (): OnboardingState => ({
//     currentStep: 1,
//     personal: {} as PersonalDetails,
//     business: {} as BusinessDetails,
//     verification: {
//       emailCode: '',
//       isCodeSent: false,
//       isVerified: false,
//     },
//     loading: false,
//     errors: {},
//   }),
//   actions: {
//     next() {
//       if (this.currentStep < 3) this.currentStep++
//     },
//     prev() {
//       if (this.currentStep > 1) this.currentStep--
//     },
//     updatePersonal(payload: PersonalDetails) {
//       this.personal = payload
//     },
//     updateBusiness(payload: BusinessDetails) {
//       this.business = payload
//     },
//     updateVerification(payload: VerificationState) {
//       this.verification = payload
//     },
//     reset() {
//       this.currentStep = 1
//       this.personal = {} as PersonalDetails
//       this.business = {} as BusinessDetails
//       this.verification = {
//         emailCode: '',
//         isCodeSent: false,
//         isVerified: false,
//       }
//       this.loading = false
//       this.errors = {}
//     },

//     /**
//      * Fetch industries from the mock API via MSW.
//      */
//     async fetchIndustries(): Promise<string[]> {
//       this.loading = true
//       try {
//         const res = await fetch('/api/industries')
        
//         if (!res.ok) {
//           throw new Error(`Failed to load industries (${res.status})`)
//         }
//         const json = await res.json()
//         return (json.industries as string[]) || []
//       } finally {
//         this.loading = false
//       }
//     },
//   },
// })
