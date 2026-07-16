<template>
  <div class="fm-field fm-field--span-4 otf-filter-element otf-filter-element--contratista" :class="{ 'otf-filter-element--disabled': disabled }">
    <label for="otf-contratista">Contratista</label>
    <Select
      inputId="otf-contratista"
      :modelValue="modelValue"
      :options="options"
      :disabled="disabled"
      optionLabel="name"
      class="w-full"
      showClear
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import Select from 'primevue/select'

defineProps({
  modelValue: { type: [Object, String, null], default: null },
  options: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.otf-filter-element label {
  white-space: nowrap;
}

.otf-filter-element :deep(.p-select) {
  width: 100%;
}

.otf-filter-element--disabled {
  opacity: .62;
}
</style>
