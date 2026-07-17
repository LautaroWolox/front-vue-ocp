<template>
  <Dialog
    :visible="visible"
    modal
    header="Órdenes de Trabajo Externas"
    :draggable="false"
    :style="{ width: 'min(1120px, 96vw)' }"
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
        scrollHeight="430px"
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
          <div class="fm-grid-empty">No hay resultados</div>
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

<style scoped>
.external-ots-dialog :deep(.p-dialog-content) {
  padding: 14px 14px 8px !important;
  overflow: hidden !important;
}

.external-ots-dialog :deep(.p-dialog-footer) {
  padding: 12px 16px 14px !important;
}

.external-ots-grid-shell {
  border-left-width: 2px !important;
  border-left-style: solid !important;
  border-left-color: #00a9bd !important;
}

:deep(#tabla-ots-externas.fm-pass-grid),
:deep(#tabla-ots-externas.p-datatable) {
  border-left-width: 2px !important;
  border-left-style: solid !important;
  border-left-color: #00a9bd !important;
}

.external-ots-grid :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.external-ots-grid :deep(.p-datatable-thead > tr > th),
.external-ots-grid :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
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
  .external-ots-dialog :deep(.p-dialog) {
    width: 98vw !important;
  }
}
</style>
