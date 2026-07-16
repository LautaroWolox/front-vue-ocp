<template>
  <div class="fm-field fm-field--span-2 otf-filter-element otf-filter-element--fecha-desde" :class="{ 'otf-filter-element--disabled': disabled }">
    <label for="otf-fecha-desde">Fecha Cierre OT Desde</label>
    <CtDatePicker
      inputId="otf-fecha-desde"
      :modelValue="modelValue"
      :disabled="disabled"
      placeholder="Desde"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import CtDatePicker from '../CtDatePicker.vue'

defineProps({
  modelValue: { type: [Date, String, null], default: null },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.otf-filter-element label {
  white-space: nowrap;
}

.otf-filter-element :deep(.p-datepicker),
.otf-filter-element :deep(.ct-date-picker) {
  width: 100%;
}

.otf-filter-element--disabled {
  opacity: .62;
}

.otf-filter-element--disabled :deep(.ct-date-picker) {
  pointer-events: none;
}
</style>
