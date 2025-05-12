<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
      <!-- Desktop Sidebar -->
      <aside
        class="hidden lg:block p-6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <SidebarStepper :steps="steps" :current="store.currentStep" @navigate="goToStep" />
      </aside>

      <!-- Main Content -->
      <main class="p-6 flex justify-center">
        <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <!-- Header -->
          <div
            class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <button
              @click="onClear"
              class="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Clear &amp; Restart
            </button>
            <!-- Mobile Stepper Dropdown -->
            <div class="lg:hidden">
              <select
                v-model="store.currentStep"
                @change="goToStep($event.target.value)"
                class="px-3 py-2 text-sm border rounded bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="(label, idx) in steps" :key="idx" :value="idx + 1">
                  {{ idx + 1 }}. {{ label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Step Content or Success Panel -->
          <div class="p-6">
            <div class="max-w-md mx-auto space-y-6">
              <!-- Success Panel: only on step 3 after real verification -->
              <div
                v-if="store.currentStep === 3 && store.verification.isVerified"
                class="text-center space-y-2 p-6"
              >
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Onboarding Complete!
                </h2>
                <p class="text-base text-gray-700 dark:text-gray-300">
                  Thanks, {{ store.personal.firstName }}—we’ve received your info.
                </p>
              </div>

              <!-- Active Step Component -->
              <div v-else>
                <component
                  :is="currentComponent"
                  :key="`${store.currentStep}-${resetCounter}`"
                  v-bind="componentProps"
                  @complete="handleComplete"
                  @back="store.prev()"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import SidebarStepper from "./SidebarStepper.vue";
import Step1PersonalDetails from "./Step1PersonalDetails.vue";
import Step2BusinessDetails from "./Step2BusinessDetails.vue";
import Step3VerificationSummary from "./Step3VerificationSummary.vue";
import { useOnboardingStore } from "@/store/onboarding";
import { clearState } from "@/utils/localStorageUtils";

// Counter to force remount of the current step component
const resetCounter = ref(0);

const store = useOnboardingStore();
const steps = ["Personal", "Business", "Verify"];

// Reset verification flags whenever we land on Step 3
watch(
  () => store.currentStep,
  (step) => {
    if (step === 3) {
      store.updateVerification({
        emailCode: "",
        isCodeSent: false,
        isVerified: false,
      });
    }
  },
  { immediate: true }
);

// Determine which component to render
const currentComponent = computed(() => {
  switch (store.currentStep) {
    case 1:
      return Step1PersonalDetails;
    case 2:
      return Step2BusinessDetails;
    default:
      return Step3VerificationSummary;
  }
});

// Props to pass down to each step
const componentProps = computed(() => {
  if (store.currentStep === 1) return { initialData: store.personal };
  if (store.currentStep === 2) return { initialData: store.business };
  return { personal: store.personal, business: store.business };
});

function goToStep(step: number | string) {
  store.currentStep = Number(step);
}

function onClear() {
  if (window.confirm("This will clear all data and restart the onboarding. Continue?")) {
    clearState();
    store.reset();
    // Force Vue to recreate the step component instance
    resetCounter.value++;
    store.currentStep = 1;
  }
}

function handleComplete(payload: any) {
  if (store.currentStep === 1) {
    store.updatePersonal(payload);
    store.next();
  } else if (store.currentStep === 2) {
    store.updateBusiness(payload);
    store.next();
  }
  // On Step 3, the component itself will mark verification as complete
}
</script>

<style scoped>
main,
aside {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}
</style>
