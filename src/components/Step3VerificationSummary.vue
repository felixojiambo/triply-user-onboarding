<template>
  <form @submit.prevent="onSubmit" aria-labelledby="step3-title">
    <h2 id="step3-title" class="text-xl font-semibold mb-4">
      Verification & Summary
    </h2>

    <fieldset>
      <legend class="sr-only">Email Verification</legend>

      <label for="emailCode" class="block">Verification Code</label>
      <input
        id="emailCode"
        v-model="code"
        :aria-invalid="!!error"
        maxlength="6"
        class="w-32"
      />
      <button type="button" @click="sendCode" class="ml-2">Send Code</button>
      <div
        v-if="error"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ error }}
      </div>
    </fieldset>

    <fieldset class="mt-6">
      <legend class="sr-only">Summary of Entered Data</legend>
      <!-- render summaries of personal & business props here -->
    </fieldset>

    <button type="button" @click="emit('back')" class="mr-2">Back</button>
    <button type="submit" :disabled="submitting">
      <span v-if="submitting">Submitting…</span>
      <span v-else>Submit</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import type {
  PersonalDetails,
  BusinessDetails,
} from '@/types/onboarding';
import { ref, reactive } from 'vue';

const props = defineProps<{
  personal: PersonalDetails;
  business: BusinessDetails;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
  (e: 'back'): void;
}>();

const code = ref('');
const error = ref<string | null>(null);
const submitting = ref(false);

function sendCode() {
  // simulate API call…
  error.value = null;
  // handle toggled success/failure…
}

function validateCode(): boolean {
  if (!/^\d{6}$/.test(code.value)) {
    error.value = 'Enter a 6-digit code';
    return false;
  }
  return true;
}

function onSubmit() {
  if (!validateCode()) return;
  submitting.value = true;
  // simulate final submission, then:
  emit('complete');
}
</script>
