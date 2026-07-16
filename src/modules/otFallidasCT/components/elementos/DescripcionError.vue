<template>
  <div class="fm-field fm-field--span-4 otf-filter-element otf-filter-element--descripcion-error" :class="{ 'otf-filter-element--disabled': disabled }">
    <label for="otf-descripcion-error">Descripcion Error</label>
    <InputText
      id="otf-descripcion-error"
      :modelValue="modelValue"
      :disabled="disabled"
      class="w-full"
      type="text"
      autocomplete="off"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'

defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.otf-filter-element label {
  white-space: nowrap;
}

.otf-filter-element :deep(.p-inputtext) {
  width: 100%;
}

.otf-filter-element--disabled {
  opacity: .62;
}
</style>
