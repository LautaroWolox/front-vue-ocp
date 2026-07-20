<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters otf-filters">
    <div class="fm-filter-grid otf-filter-grid">
      <NroOT :disabled="disableNroOt" />
      <FechaDesde :disabled="disableAdvancedFilters" />
      <FechaHasta :disabled="disableAdvancedFilters" />
      <Contratista :disabled="disableAdvancedFilters" />
      <DescError :disabled="disableAdvancedFilters" />
      <Excluida :disabled="disableAdvancedFilters" />
      <Pais :disabled="disableAdvancedFilters" />
    </div>

    <div class="fm-actions fm-filter-actions otf-filter-actions">
      <FmButton
        class="fm-filter-action-button"
        label="BUSCAR"
        icon="pi-search"
        :disabled="store.loading"
        @click="buscar"
      />
      <FmButton
        class="fm-filter-action-button"
        label="LIMPIAR"
        icon="pi-filter-slash"
        variant="outline"
        :disabled="store.loading"
        @click="limpiar"
      />
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
import DescError from './elementos/DescError.vue'
import Excluida from './elementos/Excluida.vue'
import Pais from './elementos/Pais.vue'

const store = useFallidasCtStore()

const hasValue = (value) => {
  if (value === null || value === undefined) return false
  if (value instanceof Date) return true
  return String(value).trim().length > 0
}

const hasNroOt = computed(() => hasValue(store.filters.nroOT))
const hasAdvancedFilters = computed(() => [
  store.filters.fechaCierreOTDesde,
  store.filters.fechaCierreOTHasta,
  store.filters.contratista,
  store.filters.descripcionError,
  store.filters.excluida,
  store.filters.pais
].some(hasValue))

const disableAdvancedFilters = computed(() => hasNroOt.value)
const disableNroOt = computed(() => !hasNroOt.value && hasAdvancedFilters.value)

const buscar = async () => {
  if (store.loading) return
  await store.setData()
}

const limpiar = () => {
  if (store.loading) return
  store.clearFilters()
}
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

@media (max-width: 900px) {
  .otf-filter-grid > :deep(.fm-field) {
    grid-column: span 6;
  }
}

@media (max-width: 620px) {
  .otf-filter-grid > :deep(.fm-field) {
    grid-column: span 12;
  }
}
</style>
