<template>
  <nav aria-label="Onboarding Steps" class="space-y-2">
    <ol role="list" class="space-y-1">
      <li v-for="(label, idx) in steps" :key="idx">
        <button
          type="button"
          class="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-current="current === idx + 1 ? 'step' : undefined"
          :aria-label="`${idx + 1}. ${label}`"
          @click="$emit('navigate', idx + 1)"
        >
          <span class="font-bold">{{ idx + 1 }}.</span>
          <span class="ml-2">{{ label }}</span>
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
