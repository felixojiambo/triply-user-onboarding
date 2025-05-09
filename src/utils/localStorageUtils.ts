import type { OnboardingState } from '@/store/onboarding'

const STORAGE_KEY = 'onboarding:onboarding'

export function saveState(state: OnboardingState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function loadState(): OnboardingState | null {
  const json = localStorage.getItem(STORAGE_KEY)
  if (!json) return null
  try {
    return JSON.parse(json) as OnboardingState
  } catch {
    clearState()
    return null
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}
