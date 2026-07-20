<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--pais"
    :class="{ 'otf-filter-element--disabled': disabled }"
  >
    <label for="otf-pais">País</label>
    <Select
      inputId="otf-pais"
      v-model="pais"
      :options="options"
      optionLabel="label"
      optionValue="value"
      :disabled="disabled"
      class="w-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import { useFallidasCtStore } from '../../store/CtFallidaStore'
import './filter-element.css'

defineProps({
  disabled: { type: Boolean, default: false }
})

const store = useFallidasCtStore()

const options = [
  { label: '', value: '' },
  { label: 'ARG', value: 'ARG' },
  { label: 'UY', value: 'UY' },
  { label: 'PY', value: 'PY' }
]

const pais = computed({
  get: () => store.filters.pais,
  set: (value) => store.setFilter('pais', value ?? '')
})
</script>
