<!-- src/components/Step3VerificationSummary.vue -->
<template>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
      Verification &amp; Summary
    </h2>

    <!-- Email Verification -->
    <fieldset class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <legend class="text-lg font-medium text-gray-700 dark:text-gray-300">
        Email Verification
      </legend>
      <div class="flex items-center space-x-3">
        <input
          v-model="store.verification.emailCode"
          maxlength="6"
          placeholder="123456"
          class="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
        />
        <button
          type="button"
          @click="handleSendCode"
          :disabled="store.loading || store.verification.isCodeSent"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          <span v-if="store.loading && !store.verification.isCodeSent">Sending…</span>
          <span v-else-if="store.verification.isCodeSent">Code Sent</span>
          <span v-else>Send Code</span>
        </button>
      </div>
      <p aria-live="polite" class="text-red-600 text-sm h-5">{{ store.errors.sendCode }}</p>
    </fieldset>

    <!-- Data Summary -->
    <fieldset class="border-t border-gray-300 dark:border-gray-600 pt-6">
      <legend class="sr-only">Summary of Entered Data</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <!-- Personal Details -->
        <div class="space-y-2">
          <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100">Personal Details</h3>
          <ul class="space-y-1 text-gray-700 dark:text-gray-300">
            <li><span class="font-semibold">Name:</span> {{ props.personal.firstName }} {{ props.personal.lastName }}</li>
            <li><span class="font-semibold">Email:</span> {{ props.personal.email }}</li>
            <li><span class="font-semibold">Phone:</span> {{ props.personal.phone }}</li>
            <li v-if="personalImageUrl">
              <span class="font-semibold">Profile Image:</span>
              <div class="profile-preview inline-block ml-2">
                <img :src="personalImageUrl" alt="Profile preview" />
              </div>
            </li>
          </ul>
        </div>

        <!-- Business Details -->
        <div class="space-y-2">
          <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100">Business Details</h3>
          <ul class="space-y-1 text-gray-700 dark:text-gray-300">
            <li><span class="font-semibold">Name:</span> {{ props.business.businessName }}</li>
            <li><span class="font-semibold">Industry:</span> {{ props.business.industry }}</li>
            <li><span class="font-semibold">Size:</span> {{ props.business.companySize }}</li>
            <li v-if="businessLogoUrl">
              <span class="font-semibold">Business Logo:</span>
              <div class="logo-preview inline-block ml-2">
                <img :src="businessLogoUrl" alt="Business logo preview" />
              </div>
            </li>
            <li v-if="props.business.businessDocument">
              <span class="font-semibold">Document:</span> 📄 {{ props.business.businessDocument.name }}
            </li>
          </ul>
        </div>
      </div>
    </fieldset>

    <!-- Submission Error -->
    <p v-if="store.errors.submit" class="text-red-600 text-sm">
      {{ store.errors.submit }}
    </p>

    <!-- Navigation Buttons -->
    <div class="flex justify-between pt-6">
      <button
        type="button"
        @click="emit('back')"
        class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100
               dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        ← Back
      </button>
      <button
        type="submit"
        :disabled="store.loading"
        class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
               disabled:opacity-50"
      >
        <span v-if="store.loading">Submitting…</span>
        <span v-else>Submit</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import type { PersonalDetails, BusinessDetails } from '@/types/onboarding'
import { useOnboardingStore } from '@/store/onboarding'

/** Props & emits */
const props = defineProps<{
  personal: PersonalDetails
  business: BusinessDetails
}>()
const emit = defineEmits<{
  (e: 'complete'): void
  (e: 'back'): void
}>()

const store = useOnboardingStore()

/** Preview URLs */
const personalImageUrl = computed<string | null>(() => {
  const file = props.personal.profileImage
  return file instanceof Blob ? URL.createObjectURL(file) : null
})
const businessLogoUrl = computed<string | null>(() => {
  const file = props.business.businessLogo
  return file instanceof Blob ? URL.createObjectURL(file) : null
})

/** Clean up object URLs */
onBeforeUnmount(() => {
  personalImageUrl.value && URL.revokeObjectURL(personalImageUrl.value)
  businessLogoUrl.value && URL.revokeObjectURL(businessLogoUrl.value)
})

/** Send verification code via store */
async function handleSendCode() {
  store.errors.sendCode = ''
  try {
    await store.sendCode()
  } catch (err) {
    store.errors.sendCode = (err as Error).message
  }
}

/** Final submit: verify and emit completion */
async function onSubmit() {
  store.errors.submit = ''
  try {
    await store.submitOnboarding()
    emit('complete')
  } catch (err) {
    store.errors.submit = (err as Error).message
  }
}
</script>

<style scoped>
/* Full-width for fieldsets and inputs */
form > fieldset,
input,
select {
  width: 100%;
}

/* Profile preview: circular, 120×120px */
.profile-preview {
  width: 120px;
  height: 120px;
  border: 2px solid #CBD5E0;
  border-radius: 9999px;
  overflow: hidden;
}
.profile-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Business logo preview: rectangular, 180×120px */
.logo-preview {
  width: 180px;
  height: 120px;
  border: 2px solid #CBD5E0;
  border-radius: 8px;
  overflow: hidden;
}
.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
