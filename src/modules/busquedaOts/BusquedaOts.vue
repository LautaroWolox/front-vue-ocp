<template>
  <div class="fm-screen fm-screen--pad busqueda-ots-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion busqueda-ots-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>LISTA DE ORDENES DE TRABAJO A BUSCAR</AccordionHeader>
        <AccordionContent>
          <div class="fm-panel-content fm-panel-content--accent busqueda-ots-filter-panel">
            <Textarea
              v-model="store.otsText"
              class="fm-input busqueda-ots-textarea"
              autoResize
              rows="7"
              placeholder="ESCRIBA LAS OTS SEPARADAS POR COMA"
            />

            <div class="fm-actions busqueda-ots-actions">
              <FmButton
                class="busqueda-ots-action-button busqueda-ots-action-button--buscar"
                label="BUSCAR"
                icon="pi-search"
                :loading="store.loading"
                :disabled="store.loading"
                @click="buscar"
              />
              <FmButton
                class="busqueda-ots-action-button busqueda-ots-action-button--limpiar"
                label="LIMPIAR"
                icon="pi-bars"
                variant="outline"
                :disabled="store.loading"
                @click="limpiar"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader>DATOS DE LAS ORDENES DE TRABAJO</AccordionHeader>
        <AccordionContent>
          <FmGridShell
            :loading="gridLoading"
            :loading-title="gridLoadingTitle"
            :loading-message="gridLoadingMessage"
          >
            <DataTable
              id="tabla-busqueda-ots"
              ref="dt"
              class="fm-pass-grid busqueda-ots-grid"
              :value="store.rows"
              dataKey="id"
              tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
              scrollable
              scrollHeight="430px"
              removableSort
              sortMode="multiple"
              filterDisplay="row"
              v-model:filters="filters"
              paginator
              :rows="10"
              :rowsPerPageOptions="[10, 20, 50, 100]"
              paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Página {currentPage} de {totalPages}"
              :resizableColumns="true"
              columnResizeMode="expand"
              showGridlines
            >
              <template #paginatorstart>
                <FmGridActions
                  :show-delete="false"
                  :show-refresh="false"
                  @export="exportarExcel"
                />
              </template>

              <template #paginatorend>
                <span class="fm-grid-counter">Mostrando {{ store.rows.length ? 1 : 0 }} - {{ Math.min(10, store.rows.length) }} de {{ store.rows.length }}</span>
              </template>

              <template #empty>
                <div class="fm-grid-empty">No hay resultados</div>
              </template>

              <Column
                v-for="col in visibleColumns"
                :key="col.field"
                :field="col.field"
                :sortField="col.field"
                :filterField="col.field"
                :header="col.header"
                :sortable="col.sort !== false"
                :filter="col.filter !== false"
                :showFilterMenu="false"
                :exportable="col.exportable"
                :style="columnStyle(col)"
                :headerStyle="columnStyle(col)"
                :bodyStyle="columnStyle(col)"
              >
                <template #filter="{ filterModel, filterCallback }">
                  <div v-if="col.filter !== false" class="fm-filter-cell busqueda-ots-filter-cell">
                    <span class="fm-filter-prefix">~</span>
                    <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                    <span class="fm-filter-more">...</span>
                  </div>
                </template>

                <template #body="{ data }">
                  <span class="fm-cell-text busqueda-ots-cell-text" :title="String(data[col.field] ?? '')">
                    {{ data[col.field] ?? '' }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'
import { useExcelExport } from '@/composables/useExportExcel'
import { useBusquedaOtsStore } from './store/busquedaOtsStore'
import { busquedaOtsColumns } from './columns/busquedaOtsColumns'

const store = useBusquedaOtsStore()
const dt = ref()
const activePanels = ref(['0', '1'])
const columns = ref(busquedaOtsColumns)
const initialLoading = ref(true)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const visibleColumns = computed(() => columns.value.filter((col) => !col.hidden))
const filters = ref(Object.fromEntries(visibleColumns.value.map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])))
const gridLoading = computed(() => initialLoading.value || store.loading)
const gridLoadingTitle = computed(() => store.loading ? 'Buscando OTs' : 'Cargando búsqueda de OTs')
const gridLoadingMessage = computed(() => store.loading ? 'Consultando datos de las órdenes de trabajo' : 'Preparando la grilla')

const columnStyle = (col) => ({
  width: col.width || '120px',
  minWidth: col.minWidth || '58px',
  maxWidth: 'none'
})

onMounted(() => {
  window.setTimeout(() => {
    initialLoading.value = false
  }, 850)
})

const buscar = async () => {
  await store.search()
}

const limpiar = () => {
  store.clear()
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  const fields = parsed.fields.filter((field) => {
    const col = columns.value.find((column) => column.field === field)
    return col && col.exportable !== false
  })

  exportToExcel({
    rows: parsed.rows,
    fields,
    columns: columns.value,
    filename: 'Busqueda_OTs.xlsx',
    columnTypes: {},
    groupField: null
  })
}
</script>

<style scoped>
.busqueda-ots-page {
  width: 100%;
}

.busqueda-ots-page :deep(.busqueda-ots-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.busqueda-ots-page :deep(.p-accordionpanel + .p-accordionpanel) {
  margin-top: 4px !important;
}

.busqueda-ots-filter-panel {
  min-height: 230px;
}

.busqueda-ots-textarea,
.busqueda-ots-filter-panel :deep(.p-textarea) {
  width: 100% !important;
  min-height: 160px !important;
  resize: vertical !important;
  font-size: 12px !important;
}

.busqueda-ots-actions {
  justify-content: center !important;
  margin-top: 16px !important;
  gap: 10px !important;
}

.busqueda-ots-actions :deep(.p-button.busqueda-ots-action-button),
.busqueda-ots-actions :deep(.fm-action-button.busqueda-ots-action-button) {
  min-width: 104px !important;
  height: 30px !important;
  min-height: 30px !important;
  padding: 0 14px !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  gap: 8px !important;
}

.busqueda-ots-actions :deep(.p-button.busqueda-ots-action-button .p-button-icon),
.busqueda-ots-actions :deep(.p-button.busqueda-ots-action-button .pi) {
  font-size: 17px !important;
  line-height: 17px !important;
}

.busqueda-ots-actions :deep(.p-button.busqueda-ots-action-button--limpiar) {
  min-width: 116px !important;
}

.busqueda-ots-grid :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.busqueda-ots-grid :deep(.p-datatable-thead > tr > th),
.busqueda-ots-grid :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.busqueda-ots-grid :deep(.p-column-header-content) {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: visible !important;
}

.busqueda-ots-grid :deep(.p-column-title) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.busqueda-ots-grid :deep(.p-sortable-column-icon),
.busqueda-ots-grid :deep(.p-column-resizer) {
  flex: 0 0 auto !important;
  min-width: 12px !important;
  overflow: visible !important;
}

.busqueda-ots-filter-cell,
.busqueda-ots-filter-cell :deep(.p-inputtext),
.busqueda-ots-grid :deep(.fm-filter-cell),
.busqueda-ots-grid :deep(.fm-column-filter) {
  min-width: 0 !important;
  width: 100% !important;
}

.busqueda-ots-cell-text {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
</style>
