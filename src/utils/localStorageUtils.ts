import type { OnboardingState } from "@/store/onboarding";

const STORAGE_KEY = "onboarding:onboarding";

function stripFileFields(state: OnboardingState): OnboardingState {
  return {
    ...state,
    personal: {
      ...state.personal,
      profileImage: undefined as unknown as File, // intentionally nullified
    },
    business: {
      ...state.business,
      businessLogo: undefined as unknown as File,
      businessDocument: undefined as unknown as File,
    },
  };
}

export function saveState(state: OnboardingState): void {
  const safeState = stripFileFields(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
}

export function loadState(): OnboardingState | null {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json) as OnboardingState;
  } catch {
    clearState();
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
