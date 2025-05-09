<template>
  <form @submit.prevent="onSubmit" aria-labelledby="step2-title" class="space-y-6">
    <h2 id="step2-title" class="text-2xl font-semibold dark:text-gray-100">
      Business Details
    </h2>

    <!-- Industry -->
    <fieldset class="space-y-2">
      <legend class="sr-only">Industry</legend>

      <label for="industry" class="block font-medium">Industry</label>
      <div v-if="loadingIndustries" class="italic dark:text-gray-400">Loading…</div>
      <div v-else-if="errorIndustries" class="text-red-600" role="alert">{{ errorIndustries }}</div>
      <select
        v-else
        id="industry"
        v-model="data.industry"
        :aria-invalid="!!errors.industry"
        class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select industry</option>
        <option v-for="opt in industries" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <p v-if="errors.industry" class="mt-1 text-red-600" role="alert" aria-live="polite">
        {{ errors.industry }}
      </p>
    </fieldset>

    <!-- Company Size -->
    <fieldset class="space-y-2">
      <legend class="sr-only">Company Size</legend>

      <label for="companySize" class="block font-medium">Company Size</label>
      <select
        id="companySize"
        v-model="data.companySize"
        :aria-invalid="!!errors.companySize"
        class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select size</option>
        <option v-for="size in companySizes" :key="size" :value="size">{{ size }}</option>
      </select>
      <p v-if="errors.companySize" class="mt-1 text-red-600" role="alert" aria-live="polite">
        {{ errors.companySize }}
      </p>
    </fieldset>

    <!-- Logo Upload -->
    <fieldset class="space-y-2">
      <legend class="sr-only">Business Logo</legend>

      <label for="businessLogo" class="block font-medium">Business Logo (JPG/PNG ≤ 2 MB)</label>
      <input
        id="businessLogo"
        type="file"
        accept="image/jpeg,image/png"
        @change="onLogoChange"
        :aria-invalid="!!errors.businessLogo"
        class="w-full"
      />
      <p v-if="errors.businessLogo" class="mt-1 text-red-600" role="alert" aria-live="polite">
        {{ errors.businessLogo }}
      </p>
      <img
        v-if="logoPreview"
        :src="logoPreview"
        alt="Logo preview"
        class="mt-2 w-24 h-24 object-cover rounded border dark:border-gray-600"
      />
    </fieldset>

    <!-- Document Upload -->
    <fieldset class="space-y-2">
      <legend class="sr-only">Business Document</legend>

      <label for="businessDocument" class="block font-medium">Document (PDF ≤ 5 MB)</label>
      <input
        id="businessDocument"
        type="file"
        accept="application/pdf"
        @change="onDocChange"
        :aria-invalid="!!errors.businessDocument"
        class="w-full"
      />
      <p v-if="errors.businessDocument" class="mt-1 text-red-600" role="alert" aria-live="polite">
        {{ errors.businessDocument }}
      </p>
      <p v-if="docName" class="mt-1 text-gray-700 dark:text-gray-300">
        Selected File: {{ docName }}
      </p>
    </fieldset>

    <!-- Navigation -->
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
import { businessDetailsSchema } from '@/schemas/onboarding';
import { useOnboardingStore } from '@/store/onboarding';
import type { BusinessDetails } from '@/types/onboarding';

const props = defineProps<{ initialData?: Partial<BusinessDetails> }>();
const emit = defineEmits<{
  (e: 'complete', payload: BusinessDetails): void;
  (e: 'back'): void;
}>();

const store = useOnboardingStore();
const industries = ref<string[]>([]);
const loadingIndustries = ref(false);
const errorIndustries = ref<string|null>(null);

const data = reactive<Partial<BusinessDetails>>({ ...props.initialData });
const errors = reactive<Record<keyof BusinessDetails, string>>({
  businessName: '',
  industry: '',
  companySize: '',
  businessLogo: '',
  businessDocument: '',
});
const companySizes = Object.values(store.companySizes);
const logoPreview = ref<string|null>(null);
const docName = ref<string|null>(null);
const businessNameRef = ref<HTMLInputElement>();

onMounted(async () => {
  businessNameRef.value?.focus();
  loadingIndustries.value = true;
  try {
    industries.value = await store.fetchIndustries();
  } catch (err: any) {
    errorIndustries.value = err.message || 'Failed to load industries';
  } finally {
    loadingIndustries.value = false;
  }
});

function onLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  data.businessLogo = file as File;
  if (file) {
    if (!['image/jpeg','image/png'].includes(file.type)) {
      errors.businessLogo = 'Logo must be JPG or PNG';
    } else if (file.size > 2 * 1024 * 1024) {
      errors.businessLogo = 'Max size 2 MB';
    } else {
      errors.businessLogo = '';
      logoPreview.value = URL.createObjectURL(file);
    }
  }
}

function onDocChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  data.businessDocument = file as File;
  if (file) {
    if (file.type !== 'application/pdf') {
      errors.businessDocument = 'Document must be PDF';
    } else if (file.size > 5 * 1024 * 1024) {
      errors.businessDocument = 'Max size 5 MB';
    } else {
      errors.businessDocument = '';
      docName.value = file.name;
    }
  }
}

function onSubmit() {
  // reset errors
  Object.keys(errors).forEach(k => (errors[k as keyof BusinessDetails] = ''));

  const result = businessDetailsSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    for (const key in fieldErrors) {
      (errors as any)[key] = fieldErrors[key]?.[0] ?? '';
    }
    return;
  }

  emit('complete', result.data);
}
</script>
