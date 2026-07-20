<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--fecha-hasta"
    :class="{ 'otf-filter-element--disabled': disabled }"
  >
    <label for="otf-fecha-hasta">Fecha hasta</label>
    <CtDatePicker
      v-model="fechaHasta"
      inputId="otf-fecha-hasta"
      placeholder="Hasta"
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

const fechaHasta = computed({
  get: () => store.filters.fechaCierreOTHasta,
  set: (value) => store.setFilter('fechaCierreOTHasta', value ?? null)
})
</script>
