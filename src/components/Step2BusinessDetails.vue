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
            :aria-invalid="!!errors.businessName"
            placeholder="Enter your business name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <p v-if="errors.businessName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.businessName }}
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
            :aria-invalid="!!errors.industry"
            :disabled="isLoadingIndustries"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          >
            <option value="" disabled>Select an industry</option>
            <option v-for="industry in industries" :key="industry.id" :value="industry.id">
              {{ industry.name }}
            </option>
          </select>
          <p v-if="isLoadingIndustries" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Loading industries...
          </p>
          <p v-else-if="errors.industry" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.industry }}
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
            :aria-invalid="!!errors.companySize"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          >
            <option value="" disabled>Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <!-- corrected to match enum '500+' -->
            <option value="500+">500+ employees</option>
          </select>
          <p v-if="errors.companySize" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.companySize }}
          </p>
        </div>
      </div>

      <!-- Business Logo Upload -->
      <fieldset class="space-y-4">
        <legend class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Business Logo (JPG/PNG ≤ 2 MB)
        </legend>
        <div class="max-w-xs">
          <input
            id="businessLogo"
            type="file"
            accept="image/jpeg,image/png"
            @change="onLogoFileChange"
            :aria-invalid="!!errors.businessLogo"
            class="w-full block file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          <p v-if="errors.businessLogo" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.businessLogo }}
          </p>
          <div v-if="logoPreviewUrl" class="logo-preview mt-3">
            <img :src="logoPreviewUrl" alt="Business logo preview" />
          </div>
        </div>
      </fieldset>

      <!-- Document Upload -->
      <fieldset class="space-y-4">
        <legend class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Business Document (PDF ≤ 5 MB)
        </legend>
        <div class="max-w-xs">
          <input
            id="businessDocument"
            type="file"
            accept="application/pdf"
            @change="onDocFileChange"
            :aria-invalid="!!errors.businessDocument"
            class="w-full block file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          <p v-if="errors.businessDocument" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.businessDocument }}
          </p>
          <div v-if="data.businessDocument" class="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span class="mr-2">📄</span>
            {{ data.businessDocument.name }}
          </div>
        </div>
      </fieldset>

      <!-- Navigation Buttons -->
      <div class="flex justify-end space-x-4 pt-6">
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
          class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

// 1. Props & emits at top level
const props = defineProps<{ initialData?: Partial<BusinessDetails> }>()
const emit = defineEmits<{
  (e: 'complete', payload: BusinessDetails): void
  (e: 'back'): void
}>()

const store = useOnboardingStore()

// 2. Reactive local state
const industries = ref<{ id: string; name: string }[]>([])
const isLoadingIndustries = computed(() => store.loading)
const data = reactive<Partial<BusinessDetails>>({ ...(props.initialData ?? {}) })
const errors = reactive<Record<keyof BusinessDetails, string>>({
  businessName: '',
  industry: '',
  companySize: '',
  businessLogo: '',
  businessDocument: '',
})
const logoPreviewUrl = ref<string | null>(null)
const businessNameRef = ref<HTMLInputElement>()

// 3. Fetch industries on mount
onMounted(async () => {
  businessNameRef.value?.focus()
  try {
    const list = await store.fetchIndustries()
    industries.value = list.map(name => ({ id: name, name }))
  } catch {
    errors.industry = 'Could not load industries.'
  }
})

// 4. File handlers
function onLogoFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  data.businessLogo = file
  errors.businessLogo = ''
  logoPreviewUrl.value = null

  if (!file) {
    errors.businessLogo = 'Please select a logo to upload.'
    return
  }
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    errors.businessLogo = 'Invalid file type. Only JPG or PNG allowed.'
  } else if (file.size > 2 * 1024 * 1024) {
    errors.businessLogo = 'Maximum size is 2 MB.'
  } else {
    logoPreviewUrl.value = URL.createObjectURL(file)
  }
}

function onDocFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  data.businessDocument = file
  errors.businessDocument = ''

  if (!file) {
    errors.businessDocument = 'Please select a document to upload.'
    return
  }
  if (file.type !== 'application/pdf') {
    errors.businessDocument = 'Invalid file type. Only PDF allowed.'
  } else if (file.size > 5 * 1024 * 1024) {
    errors.businessDocument = 'Maximum size is 5 MB.'
  }
}

// 5. Form submit: validate with Zod, then emit
function onSubmit(): void {
  (Object.keys(errors) as (keyof BusinessDetails)[]).forEach(key => {
    errors[key] = ''
  })

  const result = businessDetailsSchema.safeParse(data)
  if (!result.success) {
    for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
      if (msgs?.length) {
        errors[field as keyof BusinessDetails] = msgs[0]
      }
    }
    return
  }

  emit('complete', result.data)
}
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
