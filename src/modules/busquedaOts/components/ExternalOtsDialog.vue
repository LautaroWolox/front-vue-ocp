<template>
  <Dialog
    :visible="visible"
    header="Órdenes de Trabajo Externas"
    maximizable
    :modal="false"
    :draggable="true"
    :closable="true"
    :blockScroll="false"
    appendTo="body"
    :style="{ width: 'min(1120px, 94vw)' }"
    :breakpoints="{ '1199px': '94vw', '760px': '98vw' }"
    class="fm-dialog external-ots-dialog"
    @update:visible="onVisibleChange"
  >
    <FmGridShell class="external-ots-grid-shell">
      <DataTable
        id="tabla-ots-externas"
        ref="dt"
        class="fm-pass-grid external-ots-grid"
        :value="rows"
        dataKey="id"
        tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
        scrollable
        scrollHeight="flex"
        removableSort
        sortMode="multiple"
        paginator
        :first="first"
        :rows="pageSize"
        :rowsPerPageOptions="[10, 20, 50, 100, 500]"
        paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Página {currentPage} de {totalPages}"
        :resizableColumns="true"
        columnResizeMode="expand"
        showGridlines
        @page="onPage"
      >
        <template #paginatorstart>
          <FmGridActions
            size="large"
            :show-delete="false"
            :show-refresh="false"
            @export="exportarExcel"
          />
        </template>

        <template #paginatorend>
          <span class="fm-grid-counter">
            Mostrando {{ displayStart }} - {{ displayEnd }} de {{ rows.length }}
          </span>
        </template>

        <template #empty>
          <div class="fm-grid-empty external-ots-empty">No hay resultados</div>
        </template>

        <Column
          v-for="col in externalColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="true"
          :exportable="true"
          :style="columnStyle(col)"
          :headerStyle="columnStyle(col)"
          :bodyStyle="columnStyle(col)"
        >
          <template #body="{ data }">
            <span class="fm-cell-text external-ots-cell" :title="String(data[col.field] ?? '')">
              {{ data[col.field] ?? '' }}
            </span>
          </template>
        </Column>
      </DataTable>
    </FmGridShell>

    <template #footer>
      <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useExcelExport } from '@/composables/useExportExcel'

const props = defineProps({
  visible: { type: Boolean, default: false },
  rows: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible'])
const dt = ref()
const first = ref(0)
const pageSize = ref(10)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const externalColumns = [
  { field: 'nroOt', header: 'Nro de OT', width: '130px', minWidth: '110px' },
  { field: 'nroOtSfs', header: 'Nro OT SFS', width: '130px', minWidth: '110px' },
  { field: 'statusOtWfx', header: 'Status OT WFX', width: '140px', minWidth: '120px' },
  { field: 'fechaUltimaModificacion', header: 'Fecha Última Modificación', width: '180px', minWidth: '150px' },
  { field: 'nroTech', header: 'Nro Tech', width: '120px', minWidth: '100px' },
  { field: 'nombreTech', header: 'Nombre del Tech', width: '170px', minWidth: '140px' },
  { field: 'codigoSolucion', header: 'Código de Solución', width: '160px', minWidth: '130px' },
  { field: 'ubicacionOt', header: 'Ubicación de la OT', width: '180px', minWidth: '150px' }
]

const displayStart = computed(() => props.rows.length ? first.value + 1 : 0)
const displayEnd = computed(() => Math.min(first.value + pageSize.value, props.rows.length))

const columnStyle = (col) => ({
  width: col.width,
  minWidth: col.minWidth,
  maxWidth: 'none'
})

watch(() => props.visible, (visible) => {
  if (visible) first.value = 0
})

const onPage = (event) => {
  first.value = event.first
  pageSize.value = event.rows
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  const fields = externalColumns.map((column) => column.field)

  exportToExcel({
    rows: parsed.rows,
    fields,
    columns: externalColumns,
    filename: 'Ordenes_Trabajo_Externas.xlsx',
    columnTypes: {},
    groupField: null
  })
}

const cerrar = () => {
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}
</script>

<style>
.external-ots-dialog {
  display: flex !important;
  flex-direction: column !important;
  max-height: calc(100vh - 90px) !important;
  overflow: hidden !important;
  border-radius: 12px !important;
  box-shadow: 0 18px 52px rgba(15, 38, 54, 0.24) !important;
}

.external-ots-dialog .p-dialog-header {
  flex: 0 0 auto !important;
  min-height: 56px !important;
  padding: 10px 14px !important;
  background: #ffffff !important;
  border-bottom: 1px solid #dce6eb !important;
}

.external-ots-dialog .p-dialog-title {
  color: #263746 !important;
  font-size: 20px !important;
  font-weight: 500 !important;
}

.external-ots-dialog .p-dialog-header-actions {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
}

.external-ots-dialog .p-dialog-maximize-button,
.external-ots-dialog .p-dialog-close-button {
  width: 32px !important;
  min-width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: #526773 !important;
  box-shadow: none !important;
}

.external-ots-dialog .p-dialog-maximize-button:hover,
.external-ots-dialog .p-dialog-maximize-button:focus-visible {
  background: #e9f7f8 !important;
  color: #008fa1 !important;
}

.external-ots-dialog .p-dialog-close-button:hover,
.external-ots-dialog .p-dialog-close-button:focus-visible {
  background: #fff0f0 !important;
  color: #d83b3b !important;
}

.external-ots-dialog .p-dialog-content {
  flex: 1 1 auto !important;
  min-height: 430px !important;
  height: 430px;
  display: flex !important;
  flex-direction: column !important;
  padding: 14px 14px 8px !important;
  overflow: hidden !important;
  background: #ffffff !important;
}

.external-ots-dialog .p-dialog-footer {
  flex: 0 0 auto !important;
  padding: 12px 16px 14px !important;
  background: #ffffff !important;
  border-top: 1px solid #dce6eb !important;
}

.external-ots-dialog.p-dialog-maximized {
  position: fixed !important;
  top: 54px !important;
  left: 12px !important;
  right: auto !important;
  bottom: auto !important;
  width: calc(100vw - 24px) !important;
  height: calc(100vh - 66px) !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  transform: none !important;
  border-radius: 12px !important;
}

.external-ots-dialog.p-dialog-maximized .p-dialog-content {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  height: auto !important;
}

.external-ots-grid-shell {
  flex: 1 1 auto;
  height: 100% !important;
  min-height: 0 !important;
  overflow: hidden;
  border-left-width: 2px !important;
  border-left-style: solid !important;
  border-left-color: #00a9bd !important;
}

#tabla-ots-externas.fm-pass-grid,
#tabla-ots-externas.p-datatable {
  height: 100% !important;
  min-height: 0 !important;
  display: flex;
  flex-direction: column;
  border-left-width: 2px !important;
  border-left-style: solid !important;
  border-left-color: #00a9bd !important;
}

.external-ots-grid .p-datatable-table-container,
.external-ots-grid .p-datatable-wrapper {
  flex: 1 1 auto;
  min-height: 0;
}

.external-ots-grid .p-paginator {
  flex: 0 0 auto;
}

.external-ots-grid .p-datatable-table {
  table-layout: fixed !important;
}

.external-ots-grid .p-datatable-thead > tr > th,
.external-ots-grid .p-datatable-tbody > tr > td {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.external-ots-empty {
  min-height: 220px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  color: #6a7f8b;
  font-size: 14px;
}

.external-ots-dialog.p-dialog-maximized .external-ots-empty {
  min-height: calc(100vh - 330px);
}

.external-ots-cell {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

@media (max-width: 760px) {
  .external-ots-dialog.p-dialog-maximized {
    top: 46px !important;
    left: 6px !important;
    width: calc(100vw - 12px) !important;
    height: calc(100vh - 52px) !important;
  }
}
</style>
