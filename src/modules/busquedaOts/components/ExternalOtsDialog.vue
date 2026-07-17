<template>
  <Teleport to="body">
    <section
      v-if="visible"
      ref="windowRef"
      class="external-ots-window"
      :class="{ 'external-ots-window--maximized': maximized }"
      :style="windowStyle"
      role="dialog"
      aria-modal="false"
      aria-labelledby="external-ots-window-title"
    >
      <header
        class="external-ots-window__header"
        :class="{ 'external-ots-window__header--draggable': !maximized }"
        @pointerdown="startDrag"
      >
        <h2 id="external-ots-window-title">Órdenes de Trabajo Externas</h2>

        <div class="external-ots-window__actions" @pointerdown.stop>
          <button
            type="button"
            class="external-ots-window__action"
            :title="maximized ? 'Restaurar tamaño' : 'Maximizar'"
            :aria-label="maximized ? 'Restaurar tamaño' : 'Maximizar'"
            @click.stop="toggleMaximized"
          >
            <i :class="maximized ? 'pi pi-clone' : 'pi pi-window-maximize'" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="external-ots-window__action external-ots-window__action--close"
            title="Cerrar"
            aria-label="Cerrar"
            @click.stop="cerrar"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <main class="external-ots-window__content">
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
      </main>

      <footer class="external-ots-window__footer">
        <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
      </footer>
    </section>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useExcelExport } from '@/composables/useExportExcel'

const props = defineProps({
  visible: { type: Boolean, default: false },
  rows: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible'])
const windowRef = ref()
const dt = ref()
const first = ref(0)
const pageSize = ref(10)
const maximized = ref(false)
const windowX = ref(null)
const windowY = ref(null)
const dragState = ref(null)
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

const windowStyle = computed(() => {
  if (maximized.value) {
    return {
      top: '82px',
      left: '40px',
      width: 'calc(100vw - 80px)',
      height: 'calc(100vh - 122px)',
      transform: 'none'
    }
  }

  if (Number.isFinite(windowX.value) && Number.isFinite(windowY.value)) {
    return {
      top: `${windowY.value}px`,
      left: `${windowX.value}px`,
      width: 'min(1040px, 90vw)',
      height: 'min(570px, calc(100vh - 140px))',
      transform: 'none'
    }
  }

  return {
    top: '92px',
    left: '50%',
    width: 'min(1040px, 90vw)',
    height: 'min(570px, calc(100vh - 140px))',
    transform: 'translateX(-50%)'
  }
})

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
    windowX.value = null
    windowY.value = null
  } else {
    stopDrag()
  }
})

const onPage = (event) => {
  first.value = event.first
  pageSize.value = event.rows
}

const startDrag = (event) => {
  if (maximized.value || event.button !== 0 || !windowRef.value) return

  const rect = windowRef.value.getBoundingClientRect()
  windowX.value = rect.left
  windowY.value = rect.top
  dragState.value = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    width: rect.width,
    height: rect.height
  }

  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', stopDrag, { once: true })
  event.preventDefault()
}

const onDrag = (event) => {
  if (!dragState.value) return

  const minTop = 48
  const maxLeft = Math.max(4, window.innerWidth - dragState.value.width - 4)
  const maxTop = Math.max(minTop, window.innerHeight - 58)

  windowX.value = Math.min(Math.max(4, event.clientX - dragState.value.offsetX), maxLeft)
  windowY.value = Math.min(Math.max(minTop, event.clientY - dragState.value.offsetY), maxTop)
}

function stopDrag() {
  dragState.value = null
  window.removeEventListener('pointermove', onDrag)
}

const toggleMaximized = () => {
  stopDrag()
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
  stopDrag()
  maximized.value = false
  emit('update:visible', false)
}

onBeforeUnmount(stopDrag)
</script>

<style>
.external-ots-window {
  position: fixed;
  z-index: 1600;
  display: flex;
  flex-direction: column;
  min-width: 560px;
  min-height: 400px;
  overflow: hidden;
  color: #263746;
  background: #ffffff;
  border: 1px solid #d7e1e7;
  border-radius: 12px;
  box-shadow: 0 22px 60px rgba(15, 38, 54, 0.28);
}

.external-ots-window--maximized {
  min-width: 0;
  min-height: 0;
}

.external-ots-window__header {
  flex: 0 0 52px;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 0 12px 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #dce6eb;
  user-select: none;
}

.external-ots-window__header--draggable {
  cursor: move;
}

.external-ots-window__header h2 {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: #263746;
  font-size: 18px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.external-ots-window__actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.external-ots-window__action {
  width: 28px;
  min-width: 28px;
  height: 28px;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 6px;
  color: #526773;
  background: transparent;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.external-ots-window__action .pi {
  width: 16px;
  height: 16px;
  font-size: 16px;
  line-height: 16px;
}

.external-ots-window__action:hover,
.external-ots-window__action:focus-visible {
  color: #008fa1;
  background: #e9f7f8;
}

.external-ots-window__action--close:hover,
.external-ots-window__action--close:focus-visible {
  color: #d83b3b;
  background: #fff0f0;
}

.external-ots-window__content {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 6px;
  overflow: hidden;
  background: #ffffff;
}

.external-ots-window__footer {
  flex: 0 0 58px;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 14px 10px;
  background: #ffffff;
  border-top: 1px solid #dce6eb;
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
  min-height: 180px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  color: #6a7f8b;
  font-size: 13px;
}

.external-ots-window--maximized .external-ots-empty {
  min-height: calc(100vh - 390px);
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
  .external-ots-window {
    top: 58px !important;
    left: 10px !important;
    width: calc(100vw - 20px) !important;
    height: calc(100vh - 74px) !important;
    min-width: 0;
    transform: none !important;
  }

  .external-ots-window__header h2 {
    font-size: 16px;
  }
}
</style>
