<template>
  <div class="max-w-lg mx-auto p-4">
    <Stepper
      :steps="['Personal','Business','Verify']"
      :current="store.currentStep"
      @navigate="goToStep"
    />

    <component
      :is="currentComponent"
      :initialData="initialData"
      @complete="handleComplete"
      @back="store.prev()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Step1 from './Step1PersonalDetails.vue'
import Step2 from './Step2BusinessDetails.vue'
import Step3 from './Step3VerificationSummary.vue'
import { useOnboardingStore } from '@/store/onboarding'
import Stepper from './Stepper.vue'

const store = useOnboardingStore()

const currentComponent = computed(() => {
  switch (store.currentStep) {
    case 1: return Step1
    case 2: return Step2
    default: return Step3
  }
})

const initialData = computed(() => {
  if (store.currentStep === 1) return store.personal
  if (store.currentStep === 2) return store.business
  return {}
})

function goToStep(step: number) {
  store.currentStep = step
}

function handleComplete(payload: any) {
  if (store.currentStep === 1) {
    store.updatePersonal(payload)
    store.next()
  } else if (store.currentStep === 2) {
    store.updateBusiness(payload)
    store.next()
  } else {
    store.updateVerification(payload)
    // next will submit in Phase 7
  }
}
</script>
