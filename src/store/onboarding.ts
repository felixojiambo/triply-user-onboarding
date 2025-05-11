import { defineStore } from "pinia";
import { fetchIndustriesMock, sendCodeMock, submitOnboardingMock } from "@/api/mockApi";
import type { PersonalDetails, BusinessDetails, VerificationState } from "@/types/onboarding";

export interface OnboardingState {
  currentStep: number;
  personal: PersonalDetails;
  business: BusinessDetails;
  verification: VerificationState;
  loading: boolean;
  errors: Record<string, string>;
}

export const useOnboardingStore = defineStore("onboarding", {
  state: (): OnboardingState => ({
    currentStep: 1,
    personal: {} as PersonalDetails,
    business: {} as BusinessDetails,
    verification: {
      emailCode: "",
      isCodeSent: false,
      isVerified: false,
    },
    loading: false,
    errors: {},
  }),

  actions: {
    next() {
      if (this.currentStep < 3) this.currentStep++;
    },

    prev() {
      if (this.currentStep > 1) this.currentStep--;
    },

    updatePersonal(payload: PersonalDetails) {
      this.personal = payload;
    },

    updateBusiness(payload: BusinessDetails) {
      this.business = payload;
    },

    updateVerification(payload: VerificationState) {
      this.verification = payload;
    },

    reset() {
      this.currentStep = 1;
      this.personal = {} as PersonalDetails;
      this.business = {} as BusinessDetails;
      this.verification = {
        emailCode: "",
        isCodeSent: false,
        isVerified: false,
      };
      this.loading = false;
      this.errors = {};
    },

    /** Fetch industries via direct mock */
    async fetchIndustries(): Promise<string[]> {
      this.loading = true;
      try {
        return await fetchIndustriesMock();
      } finally {
        this.loading = false;
      }
    },

    /** Send verification code via mock */
    async sendCode(simulateError = false): Promise<string> {
      this.loading = true;
      try {
        const { code } = await sendCodeMock(simulateError);
        this.verification.isCodeSent = true;
        return code;
      } finally {
        this.loading = false;
      }
    },

    /** Submit all onboarding data via mock */
    async submitOnboarding(simulateError = false): Promise<void> {
      this.loading = true;
      try {
        await submitOnboardingMock(
          {
            personal: this.personal,
            business: this.business,
            verification: this.verification,
          },
          simulateError
        );
        this.verification.isVerified = true;
      } finally {
        this.loading = false;
      }
    },
  },
});
