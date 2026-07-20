<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--excluida"
    :class="{ 'otf-filter-element--disabled': disabled }"
  >
    <label for="otf-excluida">Excluida</label>
    <Select
      inputId="otf-excluida"
      v-model="excluida"
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
  { label: 'SI', value: 'S' },
  { label: 'NO', value: 'N' }
]

const excluida = computed({
  get: () => store.filters.excluida,
  set: (value) => store.setFilter('excluida', value ?? '')
})
</script>
