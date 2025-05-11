// src/composables/useEmailVerification.ts
import { ref, onBeforeUnmount } from "vue";
import { z } from "zod";
import verificationService from "@/services/verificationService";

export function useEmailVerification(email: string) {
  const code = ref("");
  const error = ref<string | null>(null);
  const codeSent = ref(false);
  const sending = ref(false);
  const verifying = ref(false);
  const countdown = ref(0);
  let timer: number | null = null;

  const codeSchema = z.string().length(6, "Code must be exactly 6 digits");

  async function sendCode() {
    if (sending.value) return;
    sending.value = true;
    error.value = null;

    try {
      await verificationService.sendCode(email);
      codeSent.value = true;
      countdown.value = 30;
      timer = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else if (timer) {
          clearInterval(timer);
          timer = null;
          codeSent.value = false;
        }
      }, 1000);
    } catch {
      error.value = "Failed to send code. Please try again.";
    } finally {
      sending.value = false;
    }
  }

  async function verifyCode(): Promise<boolean> {
    error.value = null;
    const parsed = codeSchema.safeParse(code.value);
    if (!parsed.success) {
      error.value = parsed.error.errors[0].message;
      return false;
    }

    verifying.value = true;
    try {
      const result = await verificationService.verifyCode(code.value);
      if (!result) {
        error.value = "Verification failed.";
      }
      return result;
    } catch {
      error.value = "Verification error. Retry later.";
      return false;
    } finally {
      verifying.value = false;
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });

  return {
    code,
    error,
    codeSent,
    sending,
    verifying,
    countdown,
    sendCode,
    verifyCode,
  };
}
