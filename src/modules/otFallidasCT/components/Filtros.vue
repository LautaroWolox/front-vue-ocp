<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters otf-filters">
    <div class="fm-filter-grid otf-filter-grid">
      <NroOT v-model="store.filters.nroOt" :disabled="disableNroOt" />
      <FechaDesde v-model="store.filters.fechaDesde" :disabled="disableAdvancedFilters" />
      <FechaHasta v-model="store.filters.fechaHasta" :disabled="disableAdvancedFilters" />
      <Contratista v-model="store.filters.contratista" :options="store.contratistas" :disabled="disableAdvancedFilters" />
      <DescripcionError v-model="store.filters.descripcionError" :disabled="disableAdvancedFilters" />
      <Excluida v-model="store.filters.excluida" :options="store.excluidas" :disabled="disableAdvancedFilters" />
      <Pais v-model="store.filters.pais" :options="store.paises" :disabled="disableAdvancedFilters" />
    </div>

    <div class="fm-actions fm-filter-actions otf-filter-actions">
      <FmButton class="fm-filter-action-button" label="BUSCAR" icon="pi-search" :disabled="store.loading" @click="buscar" />
      <FmButton class="fm-filter-action-button" label="LIMPIAR" icon="pi-filter-slash" variant="outline" @click="limpiar" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import NroOT from './elementos/NroOT.vue'
import FechaDesde from './elementos/FechaDesde.vue'
import FechaHasta from './elementos/FechaHasta.vue'
import Contratista from './elementos/Contratista.vue'
import DescripcionError from './elementos/DescripcionError.vue'
import Excluida from './elementos/Excluida.vue'
import Pais from './elementos/Pais.vue'

const store = useFallidasCtStore()

const hasValue = (value) => {
  if (value === null || value === undefined) return false
  if (value instanceof Date) return true
  if (typeof value === 'object') return Boolean(value.code || value.name)
  return String(value).trim().length > 0
}

const hasNroOt = computed(() => hasValue(store.filters.nroOt))
const hasAdvancedFilters = computed(() => [
  store.filters.fechaDesde,
  store.filters.fechaHasta,
  store.filters.contratista,
  store.filters.descripcionError,
  store.filters.excluida,
  store.filters.pais
].some(hasValue))

const disableAdvancedFilters = computed(() => hasNroOt.value)
const disableNroOt = computed(() => !hasNroOt.value && hasAdvancedFilters.value)

const limpiar = () => store.clearFilters()
const buscar = async () => store.search()
</script>

<style scoped>
.otf-filters {
  width: 100%;
}

.otf-filter-grid {
  align-items: end;
}

.otf-filter-actions {
  margin-top: 14px !important;
}

.otf-filter-actions :deep(.p-button),
.otf-filter-actions :deep(.fm-action-button) {
  min-width: 104px;
}

.otf-filters :deep(.otf-filter-element--disabled) {
  opacity: 1 !important;
}

.otf-filters :deep(.otf-filter-element--disabled label) {
  color: #52616c !important;
}

.otf-filters :deep(.otf-filter-element--disabled .p-inputtext),
.otf-filters :deep(.otf-filter-element--disabled .p-select),
.otf-filters :deep(.otf-filter-element--disabled .ct-date-button) {
  background: #d5dde3 !important;
  background-color: #d5dde3 !important;
  border-color: #9eacb7 !important;
  color: #53636f !important;
  cursor: not-allowed !important;
}

.otf-filters :deep(.otf-filter-element--disabled .p-inputtext::placeholder),
.otf-filters :deep(.otf-filter-element--disabled .ct-date-button span),
.otf-filters :deep(.otf-filter-element--disabled .p-select-label) {
  color: #53636f !important;
}

.otf-filters :deep(.otf-filter-element--disabled .p-select-dropdown),
.otf-filters :deep(.otf-filter-element--disabled .ct-date-button svg) {
  color: #53636f !important;
  stroke: #53636f !important;
}
</style>
