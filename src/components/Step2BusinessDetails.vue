<template>
  <form @submit.prevent="onSubmit" aria-labelledby="step2-title">
    <h2 id="step2-title" class="text-xl font-semibold mb-4">Business Details</h2>

    <fieldset class="mb-4">
      <legend class="sr-only">Business Info</legend>

      <label for="businessName" class="block">Business Name</label>
      <input
        id="businessName"
        v-model="data.businessName"
        :aria-invalid="!!errors.businessName"
        required
        class="w-full"
      />
      <div
        v-if="errors.businessName"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.businessName }}
      </div>

      <label for="industry" class="block mt-4">Industry</label>
      <select
        id="industry"
        v-model="data.industry"
        :aria-invalid="!!errors.industry"
        required
        class="w-full"
      >
        <option value="" disabled>Select industry</option>
        <option v-for="opt in industries" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
      <div
        v-if="errors.industry"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.industry }}
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend class="sr-only">Company Size & Files</legend>

      <label for="companySize" class="block">Company Size</label>
      <select
        id="companySize"
        v-model="data.companySize"
        :aria-invalid="!!errors.companySize"
        required
        class="w-full"
      >
        <option value="" disabled>Select size</option>
        <option v-for="size in companySizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <div
        v-if="errors.companySize"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.companySize }}
      </div>

      <label for="businessLogo" class="block mt-4">Business Logo</label>
      <input
        id="businessLogo"
        type="file"
        accept="image/jpeg,image/png"
        @change="onLogoChange"
        :aria-invalid="!!errors.businessLogo"
        class="w-full"
      />
      <div
        v-if="errors.businessLogo"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.businessLogo }}
      </div>

      <label for="businessDocument" class="block mt-4">Business Document (PDF)</label>
      <input
        id="businessDocument"
        type="file"
        accept="application/pdf"
        @change="onDocChange"
        :aria-invalid="!!errors.businessDocument"
        class="w-full"
      />
      <div
        v-if="errors.businessDocument"
        class="text-red-600 mt-1"
        role="alert"
        aria-live="polite"
      >
        {{ errors.businessDocument }}
      </div>
    </fieldset>

    <button type="button" @click="emit('back')" class="mr-2">Back</button>
    <button type="submit">Next</button>
  </form>
</template>

<script setup lang="ts">
import type { BusinessDetails } from '@/types/onboarding';
import { reactive, ref, onMounted } from 'vue';
import { useOnboardingStore } from '@/store/onboarding';

const props = defineProps<{
  initialData?: Partial<BusinessDetails>;
}>();

const emit = defineEmits<{
  (e: 'complete', payload: BusinessDetails): void;
  (e: 'back'): void;
}>();

const store = useOnboardingStore();
const industries = ref<string[]>([]);
const companySizes = Object.values(store.companySizes);

const data = reactive<Partial<BusinessDetails>>({ ...props.initialData });
const errors = reactive<Partial<Record<keyof BusinessDetails, string>>>({});

onMounted(async () => {
  industries.value = await store.fetchIndustries();
});

function validate(): boolean {
  Object.assign(errors, {});
  if (!data.businessName) errors.businessName = 'Business name is required';
  if (!data.industry) errors.industry = 'Industry is required';
  if (!data.companySize) errors.companySize = 'Company size is required';
  if (!data.businessLogo) errors.businessLogo = 'Logo is required';
  if (!data.businessDocument) errors.businessDocument = 'Document is required';
  return Object.keys(errors).length === 0;
}

function onLogoChange(e: Event) {
  data.businessLogo = (e.target as HTMLInputElement).files?.[0] as File;
}

function onDocChange(e: Event) {
  data.businessDocument = (e.target as HTMLInputElement).files?.[0] as File;
}

function onSubmit() {
  if (validate()) {
    emit('complete', data as BusinessDetails);
  }
}
</script>
