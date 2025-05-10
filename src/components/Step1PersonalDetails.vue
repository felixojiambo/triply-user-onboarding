<template>
  <form @submit.prevent="onSubmit" aria-labelledby="step1-title">
    <h2 id="step1-title" class="text-xl font-semibold mb-4">Personal Details</h2>

    <fieldset class="mb-4">
      <legend class="sr-only">Name</legend>

      <label for="firstName" class="block">First Name</label>
      <input
        id="firstName"
        v-model="data.firstName"
        :aria-invalid="!!errors.firstName"
        required
        class="w-full"
      />
      <div
        v-if="errors.firstName"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.firstName }}
      </div>

      <label for="lastName" class="block mt-4">Last Name</label>
      <input
        id="lastName"
        v-model="data.lastName"
        :aria-invalid="!!errors.lastName"
        required
        class="w-full"
      />
      <div
        v-if="errors.lastName"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.lastName }}
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend class="sr-only">Contact</legend>

      <label for="email" class="block">Email</label>
      <input
        id="email"
        type="email"
        v-model="data.email"
        :aria-invalid="!!errors.email"
        required
        class="w-full"
      />
      <div
        v-if="errors.email"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.email }}
      </div>

      <label for="phone" class="block mt-4">Phone</label>
      <input
        id="phone"
        type="tel"
        v-model="data.phone"
        :aria-invalid="!!errors.phone"
        required
        class="w-full"
      />
      <div
        v-if="errors.phone"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.phone }}
      </div>
    </fieldset>

    <fieldset class="mb-6">
      <legend class="sr-only">Profile Image</legend>

      <label for="profileImage" class="block">Profile Image</label>
      <input
        id="profileImage"
        type="file"
        accept="image/jpeg,image/png"
        @change="onFileChange"
        :aria-invalid="!!errors.profileImage"
        class="w-full"
      />
      <div
        v-if="errors.profileImage"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.profileImage }}
      </div>
    </fieldset>

    <button type="button" @click="emit('back')" class="mr-2">Back</button>
    <button type="submit">Next</button>
  </form>
</template>

<script setup lang="ts">
import type { PersonalDetails } from '@/types/onboarding';
import { reactive, ref } from 'vue';

const props = defineProps<{
  initialData?: Partial<PersonalDetails>;
}>();

const emit = defineEmits<{
  (e: 'complete', payload: PersonalDetails): void;
  (e: 'back'): void;
}>();

const data = reactive<Partial<PersonalDetails>>({ ...props.initialData });
const errors = reactive<Partial<Record<keyof PersonalDetails, string>>>({});

// simple on-the-fly validation example
function validate(): boolean {
  Object.assign(errors, {});
  if (!data.firstName) errors.firstName = 'First name is required';
  if (!data.lastName) errors.lastName = 'Last name is required';
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    errors.email = 'Valid email is required';
  if (!data.phone || !/^\+?\d{7,15}$/.test(data.phone))
    errors.phone = 'Valid phone is required';
  if (!data.profileImage) errors.profileImage = 'Profile image is required';
  return Object.keys(errors).length === 0;
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  data.profileImage = file as File;
}

function onSubmit() {
  if (validate()) {
    emit('complete', data as PersonalDetails);
  }
}
</script>
