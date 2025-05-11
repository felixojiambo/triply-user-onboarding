<!-- src/components/Step2BusinessDetails.vue -->
<template>
  <div class="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow">
    <form @submit.prevent="onSubmit" aria-labelledby="step2-title" class="space-y-8">
      <h2 id="step2-title" class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        Business Details
      </h2>

      <!-- Business Information Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Business Name -->
        <div class="sm:col-span-2">
          <label for="businessName" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Business Name
          </label>
          <input
            id="businessName"
            ref="businessNameRef"
            v-model="data.businessName"
            :aria-invalid="!!localErrors.businessName"
            placeholder="Enter your business name"
            type="text"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <p v-if="localErrors.businessName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ localErrors.businessName }}
          </p>
        </div>

        <!-- Industry -->
        <div>
          <label for="industry" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Industry
          </label>
          <select
            id="industry"
            v-model="data.industry"
            :disabled="isLoadingIndustries"
            :aria-invalid="!!fetchIndustryError"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          >
            <option value="" disabled>Select an industry</option>
            <option v-for="industry in industries" :key="industry.id" :value="industry.id">
              {{ industry.name }}
            </option>
          </select>
          <p v-if="isLoadingIndustries" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Loading industries…
          </p>
          <p v-else-if="fetchIndustryError" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ fetchIndustryError }}
          </p>
        </div>

        <!-- Company Size -->
        <div>
          <label for="companySize" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Company Size
          </label>
          <select
            id="companySize"
            v-model="data.companySize"
            :aria-invalid="!!localErrors.companySize"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          >
            <option value="" disabled>Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
          <p v-if="localErrors.companySize" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ localErrors.companySize }}
          </p>
        </div>
      </div>

      <!-- Business Logo Upload -->
      <fieldset class="space-y-4">
        <legend class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Business Logo (JPG/PNG ≤ 2 MB)
        </legend>
        <div class="max-w-xs space-y-2">
          <input
            id="businessLogo"
            type="file"
            accept="image/jpeg,image/png"
            @change="onLogoFileChange"
            :aria-invalid="!!localErrors.businessLogo"
            class="w-full block file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          <p v-if="showLogoReuploadWarning" class="text-yellow-600 dark:text-yellow-400 text-sm">
            Please re-upload your business logo.
          </p>
          <p v-if="localErrors.businessLogo" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ localErrors.businessLogo }}
          </p>
          <div v-if="logoPreviewUrl" class="logo-preview mt-3">
            <img :src="logoPreviewUrl" alt="Business logo preview" />
          </div>
        </div>
      </fieldset>

      <!-- Business Document Upload -->
      <fieldset class="space-y-4">
        <legend class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Business Document (PDF ≤ 5 MB)
        </legend>
        <div class="max-w-xs space-y-2">
          <input
            id="businessDocument"
            type="file"
            accept="application/pdf"
            @change="onDocFileChange"
            :aria-invalid="!!localErrors.businessDocument"
            class="w-full block file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          <p v-if="showDocReuploadWarning" class="text-yellow-600 dark:text-yellow-400 text-sm">
            Please re-upload your business document.
          </p>
          <p v-if="localErrors.businessDocument" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ localErrors.businessDocument }}
          </p>
          <p v-if="showDocPreview" class="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span class="mr-2">📄</span>{{ data.businessDocument?.name }}
          </p>
        </div>
      </fieldset>

      <!-- Navigation Buttons -->
      <div class="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          @click="emit('back')"
          :disabled="isLoadingIndustries"
          class="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100
                 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          :disabled="isLoadingIndustries"
          class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { businessDetailsSchema } from '@/schemas/onboarding'
import type { BusinessDetails } from '@/types/onboarding'
import { useOnboardingStore } from '@/store/onboarding'

const props = defineProps<{ initialData?: Partial<BusinessDetails> }>()
const emit = defineEmits<{
  (e: 'complete', payload: BusinessDetails): void
  (e: 'back'): void
}>()

const store = useOnboardingStore()

// Reactive local state
const industries = ref<{ id: string; name: string }[]>([])
const data = reactive<Partial<BusinessDetails>>({ ...(props.initialData ?? {}) })
const localErrors = reactive<Record<keyof BusinessDetails, string>>({
  businessName: '',
  industry: '',
  companySize: '',
  businessLogo: '',
  businessDocument: '',
})
const logoPreviewUrl = ref<string | null>(null)
const businessNameRef = ref<HTMLInputElement>()

// Computed loading & store errors
const isLoadingIndustries = computed(() => store.loading)
const fetchIndustryError   = computed(() => store.errors.industry)

// Fetch industries on mount
onMounted(async () => {
  businessNameRef.value?.focus()
  try {
    // store.fetchIndustries() already toggles store.loading
    const list = await store.fetchIndustries()
    industries.value = list.map(name => ({ id: name, name }))
  } catch {
    // record error in store so computed fetchIndustryError picks it up
    store.$patch({
      errors: { ...store.errors, industry: 'Could not load industries.' }
    })
  }
})

// File handlers
function onLogoFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  data.businessLogo = file
  localErrors.businessLogo = ''
  logoPreviewUrl.value = null

  if (!file) {
    localErrors.businessLogo = 'Please select a logo to upload.'
  } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
    localErrors.businessLogo = 'Only JPG or PNG allowed.'
  } else if (file.size > 2 * 1024 * 1024) {
    localErrors.businessLogo = 'Max size is 2 MB.'
  } else {
    logoPreviewUrl.value = URL.createObjectURL(file)
  }
}

function onDocFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  data.businessDocument = file
  localErrors.businessDocument = ''

  if (!file) {
    localErrors.businessDocument = 'Please select a document to upload.'
  } else if (file.type !== 'application/pdf') {
    localErrors.businessDocument = 'Only PDF allowed.'
  } else if (file.size > 5 * 1024 * 1024) {
    localErrors.businessDocument = 'Max size is 5 MB.'
  }
}

// Form submission
function onSubmit(): void {
  // reset local errors (businessName, companySize, etc)
  (Object.keys(localErrors) as (keyof BusinessDetails)[]).forEach(
    key => (localErrors[key] = '')
  )

  // validate
  const result = businessDetailsSchema.safeParse(data)
  if (!result.success) {
    for (const [field, msgs] of Object.entries(
      result.error.flatten().fieldErrors
    )) {
      if (msgs?.length) {
        localErrors[field as keyof BusinessDetails] = msgs[0]
      }
    }
    return
  }

  emit('complete', result.data)
}

// Re-upload warnings & preview flags
const showLogoReuploadWarning = computed(
  () => data.businessLogo != null && !(data.businessLogo instanceof File)
)
const showDocReuploadWarning = computed(
  () => data.businessDocument != null && !(data.businessDocument instanceof File)
)
const showDocPreview = computed(
  () => data.businessDocument instanceof File
)
</script>

<style scoped>
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
