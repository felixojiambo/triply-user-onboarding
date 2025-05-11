<template>
  <div class="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow">
    <form @submit.prevent="onSubmit" aria-labelledby="step1-title" class="space-y-8">
      <h2 id="step1-title" class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        Personal Details
      </h2>

      <!-- Name & Contact Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            id="firstName"
            ref="firstNameRef"
            v-model="data.firstName"
            :aria-invalid="!!errors.firstName"
            placeholder="Enter your first name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <input
            id="lastName"
            v-model="data.lastName"
            :aria-invalid="!!errors.lastName"
            placeholder="Enter your last name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email -->
        <div class="sm:col-span-2">
          <label for="email" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            v-model="data.email"
            :aria-invalid="!!errors.email"
            placeholder="you@example.com"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <!-- Phone -->
        <div class="sm:col-span-2">
          <label for="phone" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            id="phone"
            v-model="data.phone"
            :aria-invalid="!!errors.phone"
            placeholder="+1234567890"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
                   dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <!-- Profile Image Upload -->
      <fieldset class="space-y-4 w-auto">
        <legend class="text-lg font-medium text-gray-700 dark:text-gray-300">
          Profile Image (JPG/PNG ≤ 2 MB)
        </legend>
        <div class="max-w-[180px] space-y-2">
          <input
            id="profileImage"
            type="file"
            accept="image/jpeg,image/png"
            @change="onFileChange"
            :aria-invalid="!!errors.profileImage"
            class="w-full block file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />

          <!-- 🚨 Re-upload prompt -->
          <p
            v-if="showReuploadWarning"
            class="text-yellow-600 dark:text-yellow-400 text-sm"
          >
            Please re-upload your profile image.
          </p>

          <p v-if="errors.profileImage" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.profileImage }}
          </p>

          <!-- Preview image if available -->
          <div v-if="previewUrl" class="logo-preview mt-3">
            <img :src="previewUrl" alt="Profile preview" />
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
import { personalDetailsSchema } from '@/schemas/onboarding'
import type { PersonalDetails } from '@/types/onboarding'

/** Props & emits **/
const props = defineProps<{ initialData?: Partial<PersonalDetails> }>()
const emit = defineEmits<{
  (e: 'complete', payload: PersonalDetails): void
  (e: 'back'): void
}>()

/** Reactive state **/
const data = reactive<Partial<PersonalDetails>>({ ...(props.initialData ?? {}) })
const errors = reactive<Record<keyof PersonalDetails, string>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  profileImage: '',
})
const previewUrl = ref<string | null>(null)
const firstNameRef = ref<HTMLInputElement>()

onMounted(() => {
  firstNameRef.value?.focus()
})

/** File-change handler **/
function onFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  data.profileImage = file as File
  errors.profileImage = ''
  previewUrl.value = null

  if (file) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      errors.profileImage = 'Only JPG or PNG allowed'
    } else if (file.size > 2 * 1024 * 1024) {
      errors.profileImage = 'Max size is 2 MB'
    } else {
      previewUrl.value = URL.createObjectURL(file)
    }
  }
}

/** Submission handler **/
function onSubmit(): void {
  ;(Object.keys(errors) as (keyof PersonalDetails)[]).forEach(key => {
    errors[key] = ''
  })

  const result = personalDetailsSchema.safeParse(data)
  if (!result.success) {
    for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
      if (msgs?.length) errors[field as keyof PersonalDetails] = msgs[0]
    }
    return
  }

  emit('complete', result.data)
}

/** Computed: show re-upload warning if non-File was restored **/
const showReuploadWarning = computed<boolean>(
  () => data.profileImage != null && !(data.profileImage instanceof File)
)
</script>

<style scoped>
/* Full-width for inputs and grids; fieldset auto-sizes */
form > div,
input,
select {
  width: 100%;
}
fieldset {
  width: auto;
}

/* Preview box */
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
