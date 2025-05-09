import type { PersonalDetails, BusinessDetails, VerificationState } from '@/types/onboarding'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchIndustriesMock(): Promise<string[]> {
  await delay(500)
  return ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education']
}

export async function sendCodeMock(
  simulateError = false
): Promise<{ success: true; code: string }> {
  await delay(500)
  if (simulateError) {
    return Promise.reject(new Error('Failed to send code'))
  }
  return { success: true, code: '123456' }
}

export async function submitOnboardingMock(
  data: {
    personal: PersonalDetails
    business: BusinessDetails
    verification: VerificationState
  },
  simulateError = false
): Promise<{ success: true }> {
  await delay(1000)
  if (simulateError) {
    return Promise.reject(new Error('Submission failed'))
  }
  return { success: true }
}
