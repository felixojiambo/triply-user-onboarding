<template>
  <div class="lg:grid lg:grid-cols-[200px_1fr] lg:gap-6">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block p-4 border-r dark:border-gray-700">
      <SidebarStepper
        :steps="['Personal','Business','Verify']"
        :current="store.currentStep"
        @navigate="goToStep"
      />
    </aside>

    <!-- Main Content -->
    <div class="p-4 max-w-lg mx-auto space-y-4">
      <!-- Clear & Restart Control -->
      <button
        @click="onClear"
        class="text-sm text-red-600 hover:underline"
      >
        Clear &amp; Restart
      </button>

      <!-- Horizontal Stepper (mobile + tablet) -->
      <Stepper
        :steps="['Personal','Business','Verify']"
        :current="store.currentStep"
        @navigate="goToStep"
      />

      <!-- Dynamic Step Component -->
      <component
        :is="currentComponent"
        :initialData="initialData"
        @complete="handleComplete"
        @back="store.prev()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Step1 from './Step1PersonalDetails.vue'
import Step2 from './Step2BusinessDetails.vue'
import Step3 from './Step3VerificationSummary.vue'
import { useOnboardingStore } from '@/store/onboarding'
import { clearState } from '@/utils/localStorageUtils'
import Stepper from './Stepper.vue'
import SidebarStepper from './SidebarStepper.vue'

// Pinia store instance
const store = useOnboardingStore()

// Dynamic component resolution based on current step
const currentComponent = computed(() => {
  switch (store.currentStep) {
    case 1:
      return Step1
    case 2:
      return Step2
    default:
      return Step3
  }
})

// Provide initial data to each step
const initialData = computed(() => {
  if (store.currentStep === 1) return store.personal
  if (store.currentStep === 2) return store.business
  return {}
})

// Navigation logic for stepper buttons
function goToStep(step: number) {
  store.currentStep = step
}

// Handle the form submission from each step
function handleComplete(payload: any) {
  if (store.currentStep === 1) {
    store.updatePersonal(payload)
    store.next()
  } else if (store.currentStep === 2) {
    store.updateBusiness(payload)
    store.next()
  } else {
    store.updateVerification(payload)
    // Final submission happens in Step 3
  }
}

// Clear & Restart handler
function onClear() {
  if (
    window.confirm(
      'This will clear all data and restart the onboarding. Continue?'
    )
  ) {
    clearState()
    store.reset()
  }
}
</script>
