<template>
  <form @submit.prevent="onSubmit" aria-labelledby="step1-title" class="space-y-6">
    <h2 id="step1-title" class="text-2xl font-semibold">Personal Details</h2>

    <!-- Name Fields -->
    <fieldset class="space-y-4">
      <legend class="sr-only">Name</legend>

      <div>
        <label for="firstName" class="block mb-1 font-medium">First Name</label>
        <input
          id="firstName"
          ref="firstNameRef"
          v-model="data.firstName"
          :aria-invalid="!!errors.firstName"
          class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.firstName" class="mt-1 text-red-600" role="alert" aria-live="polite">
          {{ errors.firstName }}
        </p>
      </div>

      <div>
        <label for="lastName" class="block mb-1 font-medium">Last Name</label>
        <input
          id="lastName"
          v-model="data.lastName"
          :aria-invalid="!!errors.lastName"
          class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.lastName" class="mt-1 text-red-600" role="alert" aria-live="polite">
          {{ errors.lastName }}
        </p>
      </div>
    </fieldset>

    <!-- Contact Fields -->
    <fieldset class="space-y-4">
      <legend class="sr-only">Contact</legend>

      <div>
        <label for="email" class="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          v-model="data.email"
          :aria-invalid="!!errors.email"
          class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.email" class="mt-1 text-red-600" role="alert" aria-live="polite">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label for="phone" class="block mb-1 font-medium">Phone</label>
        <input
          id="phone"
          type="tel"
          v-model="data.phone"
          :aria-invalid="!!errors.phone"
          class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.phone" class="mt-1 text-red-600" role="alert" aria-live="polite">
          {{ errors.phone }}
        </p>
      </div>
    </fieldset>

    <!-- Profile Image -->
    <fieldset class="space-y-4">
      <legend class="sr-only">Profile Image</legend>

      <div>
        <label for="profileImage" class="block mb-1 font-medium">Profile Image</label>
        <input
          id="profileImage"
          type="file"
          accept="image/jpeg,image/png"
          @change="onFileChange"
          :aria-invalid="!!errors.profileImage"
          class="w-full"
        />
        <p v-if="errors.profileImage" class="mt-1 text-red-600" role="alert" aria-live="polite">
          {{ errors.profileImage }}
        </p>
      </div>

      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Profile preview"
        class="mt-2 w-24 h-24 object-cover rounded-full border"
      />
    </fieldset>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <button
        type="button"
        @click="emit('back')"
        class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Back
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { personalDetailsSchema } from '@/schemas/onboarding';
import type { PersonalDetails } from '@/types/onboarding';

const props = defineProps<{ initialData?: Partial<PersonalDetails> }>();
const emit = defineEmits<{
  (e: 'complete', payload: PersonalDetails): void;
  (e: 'back'): void;
}>();

const data = reactive<Partial<PersonalDetails>>({ ...props.initialData });
const errors = reactive<Record<keyof PersonalDetails, string>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  profileImage: '',
});
const previewUrl = ref<string | null>(null);
const firstNameRef = ref<HTMLInputElement>();

onMounted(() => {
  firstNameRef.value?.focus();
});

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  data.profileImage = file as File;
  previewUrl.value = file ? URL.createObjectURL(file) : null;
}

function onSubmit() {
  // Reset errors
  Object.keys(errors).forEach(key => (errors[key as keyof PersonalDetails] = ''));

  const result = personalDetailsSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    for (const key in fieldErrors) {
      const msg = fieldErrors[key]?.[0] ?? '';
      (errors as any)[key] = msg;
    }
    return;
  }

  emit('complete', result.data);
}
</script>
