<template>
  <Dialog
    :key="maximized ? 'external-ots-maximized' : 'external-ots-normal'"
    :visible="visible"
    :modal="false"
    :draggable="!maximized"
    :closable="false"
    :blockScroll="false"
    appendTo="body"
    :style="dialogStyle"
    :contentStyle="dialogContentStyle"
    :class="[
      'fm-dialog',
      'external-ots-dialog',
      { 'external-ots-dialog--maximized': maximized }
    ]"
    @update:visible="onVisibleChange"
  >
    <template #header>
      <div class="external-ots-window-header">
        <span class="external-ots-window-title">Órdenes de Trabajo Externas</span>

        <div class="external-ots-window-actions" @mousedown.stop>
          <Button
            :icon="maximized ? 'pi pi-clone' : 'pi pi-window-maximize'"
            text
            rounded
            class="external-ots-window-action"
            :title="maximized ? 'Restaurar tamaño' : 'Maximizar'"
            :aria-label="maximized ? 'Restaurar tamaño' : 'Maximizar'"
            @click.stop="toggleMaximized"
          />
          <Button
            icon="pi pi-times"
            text
            rounded
            class="external-ots-window-action external-ots-window-action--close"
            title="Cerrar"
            aria-label="Cerrar"
            @click.stop="cerrar"
          />
        </div>
      </div>
    </template>

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
          <span class="external-ots-empty-placeholder">No hay resultados</span>
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

      <div v-if="!rows.length" class="external-ots-empty-overlay" aria-live="polite">
        <div class="external-ots-empty-card">
          <i class="pi pi-inbox" aria-hidden="true"></i>
          <strong>No hay resultados</strong>
          <span>No se encontraron órdenes de trabajo externas.</span>
        </div>
      </div>
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
const maximized = ref(false)
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

const dialogStyle = computed(() => {
  if (maximized.value) {
    return {
      position: 'fixed',
      top: '58px',
      left: '50%',
      width: 'calc(100vw - 48px)',
      height: 'calc(100vh - 82px)',
      maxWidth: 'none',
      maxHeight: 'none',
      margin: '0',
      transform: 'translateX(-50%)',
      zIndex: 1200
    }
  }

  return {
    width: 'min(1120px, 94vw)',
    maxWidth: '94vw'
  }
})

const dialogContentStyle = computed(() => ({
  height: maximized.value ? 'calc(100vh - 206px)' : '430px',
  padding: '14px 14px 8px',
  overflow: 'hidden'
}))

const displayStart = computed(() => props.rows.length ? first.value + 1 : 0)
const displayEnd = computed(() => Math.min(first.value + pageSize.value, props.rows.length))

const columnStyle = (col) => ({
  width: col.width,
  minWidth: col.minWidth,
  maxWidth: 'none'
})

watch(() => props.visible, (visible) => {
  if (visible) {
    first.value = 0
    maximized.value = false
  }
})

const onPage = (event) => {
  first.value = event.first
  pageSize.value = event.rows
}

const toggleMaximized = () => {
  maximized.value = !maximized.value
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
  maximized.value = false
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}
</script>

<style>
.external-ots-dialog {
  overflow: hidden !important;
  border-radius: 12px !important;
  box-shadow: 0 18px 52px rgba(15, 38, 54, 0.24) !important;
}

.external-ots-dialog .p-dialog-header {
  flex: 0 0 auto !important;
  min-height: 58px !important;
  padding: 10px 14px !important;
  cursor: move;
  user-select: none;
  background: #ffffff !important;
  border-bottom: 1px solid #dce6eb !important;
  position: relative;
  z-index: 3;
}

.external-ots-dialog--maximized .p-dialog-header {
  cursor: default;
}

.external-ots-window-header {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.external-ots-window-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #263746;
  font-size: 20px;
  font-weight: 500;
}

.external-ots-window-actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.external-ots-window-actions .p-button.external-ots-window-action {
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

.external-ots-window-actions .p-button.external-ots-window-action:hover,
.external-ots-window-actions .p-button.external-ots-window-action:focus-visible {
  background: #e9f7f8 !important;
  color: #008fa1 !important;
  box-shadow: none !important;
}

.external-ots-window-actions .p-button.external-ots-window-action--close:hover,
.external-ots-window-actions .p-button.external-ots-window-action--close:focus-visible {
  background: #fff0f0 !important;
  color: #d83b3b !important;
}

.external-ots-dialog .p-dialog-content {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  background: #ffffff !important;
}

.external-ots-dialog .p-dialog-footer {
  flex: 0 0 auto !important;
  min-height: 68px !important;
  padding: 12px 16px 14px !important;
  background: #ffffff !important;
  border-top: 1px solid #dce6eb !important;
  position: relative;
  z-index: 3;
}

.external-ots-grid-shell {
  position: relative;
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
  position: relative;
  z-index: 2;
}

.external-ots-grid .p-datatable-table {
  table-layout: fixed !important;
}

.external-ots-grid .p-datatable-thead > tr > th,
.external-ots-grid .p-datatable-tbody > tr > td {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.external-ots-empty-placeholder {
  visibility: hidden;
}

.external-ots-empty-overlay {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 54px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  background: rgba(231, 249, 252, 0.88);
}

.external-ots-empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 22px 30px;
  border-radius: 14px;
  color: #57717e;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(0, 169, 189, 0.14);
  box-shadow: 0 12px 28px rgba(20, 59, 75, 0.08);
}

.external-ots-empty-card .pi {
  color: #00a9bd;
  font-size: 28px;
}

.external-ots-empty-card strong {
  color: #304b59;
  font-size: 15px;
}

.external-ots-empty-card span {
  color: #708690;
  font-size: 12px;
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
  .external-ots-dialog {
    max-width: calc(100vw - 12px) !important;
  }

  .external-ots-dialog--maximized {
    top: 48px !important;
    width: calc(100vw - 12px) !important;
    height: calc(100vh - 60px) !important;
  }

  .external-ots-window-title {
    font-size: 17px;
  }
}
</style>
