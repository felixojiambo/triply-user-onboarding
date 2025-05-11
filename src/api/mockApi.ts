import type { PersonalDetails, BusinessDetails, VerificationState } from "@/types/onboarding";

/**
 * Utility: pause for a given number of milliseconds.
 */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch list of industries (mock).
 * @returns Array of industry names after 500ms.
 */
export async function fetchIndustriesMock(): Promise<string[]> {
  await delay(500);
  return ["Technology", "Finance", "Healthcare", "Retail", "Education"];
}

/**
 * Simulate sending an email verification code.
 * @param simulateError If true, rejects with an error.
 * @returns Object containing success flag and 6-digit code.
 */
export async function sendCodeMock(
  simulateError = false
): Promise<{ success: true; code: string }> {
  await delay(500);
  if (simulateError) {
    return Promise.reject(new Error("Failed to send code"));
  }
  return { success: true, code: "123456" };
}

/**
 * Simulate final onboarding submission.
 * @param data Aggregated personal, business, and verification state.
 * @param simulateError If true, rejects with an error.
 * @returns Object containing success flag.
 */
export async function submitOnboardingMock(
  data: {
    personal: PersonalDetails;
    business: BusinessDetails;
    verification: VerificationState;
  },
  simulateError = false
): Promise<{ success: true }> {
  await delay(1000);
  if (simulateError) {
    return Promise.reject(new Error("Submission failed"));
  }
  return { success: true };
}
