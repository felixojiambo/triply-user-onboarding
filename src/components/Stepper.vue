<template>
  <nav aria-label="Onboarding Steps">
    <!-- Mobile: dropdown -->
    <div class="sm:hidden mb-4">
      <select
        class="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
        :value="current"
        @change="(e) => $emit('navigate', Number(e.target.value))"
      >
        <option v-for="(label, idx) in steps" :key="idx" :value="idx + 1">
          {{ idx + 1 }}. {{ label }}
        </option>
      </select>
    </div>

    <!-- Desktop/Mobile: horizontal stepper -->
    <ol role="list" class="hidden sm:flex justify-between mb-6">
      <li v-for="(label, idx) in steps" :key="idx" class="flex-1">
        <button
          type="button"
          class="w-full text-left px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-current="current === idx + 1 ? 'step' : undefined"
          @click="$emit('navigate', idx + 1)"
        >
          <span class="font-medium">{{ idx + 1 }}.</span>
          <span class="ml-1">{{ label }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  steps: string[];
  current: number;
}>();
const emit = defineEmits<{
  (e: "navigate", step: number): void;
}>();
</script>
