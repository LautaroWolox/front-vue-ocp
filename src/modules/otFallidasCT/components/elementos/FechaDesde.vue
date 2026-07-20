<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--fecha-desde"
    :class="{ 'otf-filter-element--disabled': disabled }"
  >
    <label for="otf-fecha-desde">Fecha desde</label>
    <CtDatePicker
      v-model="fechaDesde"
      inputId="otf-fecha-desde"
      placeholder="Desde"
      :disabled="disabled"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFallidasCtStore } from '../../store/CtFallidaStore'
import CtDatePicker from '../CtDatePicker.vue'
import './filter-element.css'

defineProps({
  disabled: { type: Boolean, default: false }
})

const store = useFallidasCtStore()

const fechaDesde = computed({
  get: () => store.filters.fechaCierreOTDesde,
  set: (value) => store.setFilter('fechaCierreOTDesde', value ?? null)
})
</script>
