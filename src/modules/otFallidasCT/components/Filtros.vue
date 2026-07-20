<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters otf-filters">
    <div class="fm-filter-grid otf-filter-grid">
      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableNroOt }">
        <label for="otf-nro-ot">Nro. OT</label>
        <InputText id="otf-nro-ot" v-model="store.filters.nroOT" :disabled="disableNroOt" class="w-full" autocomplete="off" />
      </div>

      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableAdvancedFilters }">
        <label for="otf-fecha-desde">Fecha desde</label>
        <DatePicker id="otf-fecha-desde" v-model="store.filters.fechaCierreOTDesde" :disabled="disableAdvancedFilters" dateFormat="dd/mm/yy" :manualInput="false" showIcon showButtonBar class="w-full" />
      </div>

      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableAdvancedFilters }">
        <label for="otf-fecha-hasta">Fecha hasta</label>
        <DatePicker id="otf-fecha-hasta" v-model="store.filters.fechaCierreOTHasta" :disabled="disableAdvancedFilters" dateFormat="dd/mm/yy" :manualInput="false" showIcon showButtonBar class="w-full" />
      </div>

      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableAdvancedFilters }">
        <label for="otf-contratista">Contratista</label>
        <Select
          id="otf-contratista"
          v-model="contratistaSelected"
          :options="contratistaOptions"
          optionLabel="nombre"
          :loading="commonStatus.contratistas === 'loading'"
          :disabled="disableAdvancedFilters || commonStatus.contratistas === 'loading'"
          class="w-full"
        />
      </div>

      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableAdvancedFilters }">
        <label for="otf-error">Descripción error</label>
        <InputText id="otf-error" v-model="store.filters.descripcionError" :disabled="disableAdvancedFilters" class="w-full" autocomplete="off" />
      </div>

      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableAdvancedFilters }">
        <label for="otf-excluida">Excluida</label>
        <Select id="otf-excluida" v-model="store.filters.excluida" :options="excluidaOptions" optionLabel="label" optionValue="value" :disabled="disableAdvancedFilters" class="w-full" />
      </div>

      <div class="fm-field fm-field--span-3" :class="{ 'otf-filter-element--disabled': disableAdvancedFilters }">
        <label for="otf-pais">País</label>
        <Select id="otf-pais" v-model="store.filters.pais" :options="paisOptions" optionLabel="label" optionValue="value" :disabled="disableAdvancedFilters" class="w-full" />
      </div>
    </div>

    <div class="fm-actions fm-filter-actions otf-filter-actions">
      <FmButton class="fm-filter-action-button" label="BUSCAR" icon="pi-search" :disabled="store.loading" @click="buscar" />
      <FmButton class="fm-filter-action-button" label="LIMPIAR" icon="pi-filter-slash" variant="outline" :disabled="store.loading" @click="limpiar" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import { useCommonCtStore } from '@/store/commonCt'

const store = useFallidasCtStore()
const commonCT = useCommonCtStore()
const { contratistas, status: commonStatus } = storeToRefs(commonCT)

const contratistaOptions = computed(() => [
  { empresaId: 0, codigo: '', nombre: '', tipo: 'Contratista', activo: 'S' },
  ...(contratistas.value ?? [])
])

const contratistaSelected = computed({
  get: () => contratistaOptions.value.find((item) => item.codigo === store.filters.contratista) ?? contratistaOptions.value[0],
  set: (value) => store.setFilter('contratista', value?.codigo ?? '')
})

const excluidaOptions = [
  { label: '', value: '' },
  { label: 'SI', value: 'S' },
  { label: 'NO', value: 'N' }
]

const paisOptions = [
  { label: '', value: '' },
  { label: 'ARG', value: 'ARG' },
  { label: 'UY', value: 'UY' },
  { label: 'PY', value: 'PY' }
]

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

onMounted(() => commonCT.setContratistas())
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

.otf-filter-element--disabled {
  opacity: 1 !important;
}

.otf-filter-element--disabled label {
  color: #52616c !important;
}

.otf-filter-element--disabled :deep(.p-inputtext),
.otf-filter-element--disabled :deep(.p-select),
.otf-filter-element--disabled :deep(.p-datepicker-input) {
  background: #d5dde3 !important;
  border-color: #9eacb7 !important;
  color: #53636f !important;
  cursor: not-allowed !important;
}

@media (max-width: 900px) {
  .otf-filter-grid > .fm-field {
    grid-column: span 6;
  }
}

@media (max-width: 620px) {
  .otf-filter-grid > .fm-field {
    grid-column: span 12;
  }
}
</style>
