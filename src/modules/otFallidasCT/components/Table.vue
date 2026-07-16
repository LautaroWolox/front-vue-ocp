<template>
  <FmGridShell
    class="otf-grid-shell"
    :loading="store.loading"
    loading-title="Procesando OTs"
    loading-message="Consultando datos y preparando la grilla"
  >
    <DataTable
      id="tabla"
      ref="dt"
      class="fm-pass-grid"
      :value="store.rows"
      dataKey="id"
      tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
      scrollable
      scrollHeight="430px"
      :rowClass="rowClass"
      :resizableColumns="true"
      columnResizeMode="expand"
      removableSort
      sortMode="multiple"
      filterDisplay="row"
      v-model:filters="filters"
      v-model:selection="selectedRows"
      selectionMode="multiple"
      :isDataSelectable="isRowSelectable"
      :selectAll="allSelectableSelected"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100, 500]"
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Pagina {currentPage} de {totalPages}"
      showGridlines
      @row-click="onRowClick"
      @select-all-change="onSelectAllChange"
    >
      <template #paginatorstart>
        <FmGridActions size="large" @export="exportarExcel" @delete="excluir" @refresh="reprocesar" />
      </template>

      <template #paginatorend>
        <span class="fm-grid-counter">Mostrando {{ store.rows.length ? 1 : 0 }} - {{ Math.min(10, store.rows.length) }} de {{ store.rows.length }}</span>
      </template>

      <template #empty>
        <div class="fm-grid-empty">No hay resultados</div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem; min-width: 3rem" bodyStyle="width: 3rem; min-width: 3rem" />

      <Column
        v-for="col in cols"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sort !== false"
        :filter="col.filter !== false"
        :filterField="col.field"
        :showFilterMenu="false"
        :hidden="col.hidden"
        :exportable="col.exportable"
        :style="columnStyle(col)"
        :headerStyle="columnStyle(col)"
        :bodyStyle="columnStyle(col)"
      >
        <template #filter="{ filterModel, filterCallback }">
          <div v-if="col.filter !== false" class="fm-filter-cell">
            <span class="fm-filter-prefix">~</span>
            <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
            <span class="fm-filter-more">...</span>
          </div>
        </template>
        <template #body="{ data }">
          <button v-if="isActionColumnVisible(col, data)" :class="col.buttonClass" type="button" :title="col.title" :aria-label="col.ariaLabel" @click.stop="runColumnAction(col, data)"><i :class="col.icon"></i></button>
          <span v-else-if="col.type !== 'action'" class="fm-cell-text">{{ data[col.field] ?? '' }}</span>
        </template>
      </Column>
    </DataTable>

    <FmTypingLoader
      v-if="showReprocesoLoader"
      overlay
      variant="grid"
      title="Cargando aviso"
      message="Preparando el mensaje"
    />

    <ExcluirDialog v-model:visible="showExcluir" :selected-rows="selectedRows" />
    <IncluirDialog v-model:visible="showIncluir" :row="includeRow" />
    <NotaDialog v-model:visible="showNota" :row="noteRow" />
    <ReprocesoDialog
      v-model:visible="showReprocesoDialog"
      :type="reprocesoDialog.type"
      :title="reprocesoDialog.title"
      :message="reprocesoDialog.message"
    />
  </FmGridShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'
import { columns } from './columns'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import ExcluirDialog from './ExcluirDialog.vue'
import IncluirDialog from './IncluirDialog.vue'
import NotaDialog from './NotaDialog.vue'
import ReprocesoDialog from './ReprocesoDialog.vue'
import { useExcelExport } from '@/composables/useExportExcel'

const store = useFallidasCtStore()
const cols = ref(columns)
const dt = ref()
const showExcluir = ref(false)
const showIncluir = ref(false)
const showNota = ref(false)
const showReprocesoLoader = ref(false)
const showReprocesoDialog = ref(false)
const includeRow = ref(null)
const noteRow = ref(null)
const reprocesoDialog = ref({ type: 'warning', title: 'Alerta', message: '' })
const { exportToExcel, parseDataFromTable } = useExcelExport()

const filters = ref(Object.fromEntries(columns.filter((col) => !col.hidden).map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])))
const selectableRows = computed(() => store.rows.filter((row) => row.excluida !== 'S'))
const allSelectableSelected = computed(() => selectableRows.value.length > 0 && selectableRows.value.every((row) => store.selectedRows.includes(row.id)))
const selectedRows = computed({
  get: () => store.rows.filter((row) => store.selectedRows.includes(row.id)),
  set: (value) => store.setSelectedRows(value.map((row) => row.id))
})

const wait = (time = 850) => new Promise((resolve) => setTimeout(resolve, time))

const columnStyle = (col) => ({
  width: col.width || '120px',
  minWidth: col.minWidth || col.width || '80px'
})

const rowClass = (data) => ({
  'fm-disabled-row': data?.excluida === 'S',
  'fm-enabled-row': data?.excluida === 'N',
  'fm-selected-row': store.selectedRows.includes(data?.id)
})

const isRowSelectable = (event) => event?.data?.excluida !== 'S'
const onSelectAllChange = () => store.setSelectedRows(allSelectableSelected.value ? [] : selectableRows.value.map((row) => row.id))
const onRowClick = (event) => { if (event?.data) store.toggleSelectedRow(event.data) }
const abrirNota = (row) => { noteRow.value = row; showNota.value = true }
const abrirIncluir = (row) => { includeRow.value = row; showIncluir.value = true }

const isActionColumnVisible = (col, row) => {
  if (col.type !== 'action') return false
  if (!col.showWhenField) return true
  return row?.[col.showWhenField] === col.showWhenValue
}

const runColumnAction = (col, row) => {
  if (col.action === 'nota') abrirNota(row)
  if (col.action === 'incluir') abrirIncluir(row)
}

const abrirReprocesoDialog = (data) => {
  reprocesoDialog.value = data
  showReprocesoDialog.value = true
}

const excluir = () => {
  showReprocesoDialog.value = false

  if (store.selectedRows.length > 0) {
    showExcluir.value = true
    return
  }

  abrirReprocesoDialog({
    type: 'warning',
    title: 'Alerta',
    message: 'Debe seleccionar al menos una OT para excluir.'
  })
}

const reprocesar = async () => {
  showReprocesoDialog.value = false
  showReprocesoLoader.value = true
  await wait()

  if (store.selectedRows.length === 0) {
    showReprocesoLoader.value = false
    abrirReprocesoDialog({
      type: 'warning',
      title: 'Alerta',
      message: 'No hay datos para la consulta efectuada'
    })
    return
  }

  await store.reprocesar()
  showReprocesoLoader.value = false
  abrirReprocesoDialog({
    type: 'success',
    title: 'Reproceso finalizado',
    message: 'Las OTs seleccionadas fueron reprocesadas correctamente.'
  })
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  const rows = parsed.rows
  const fields = parsed.fields.filter((field) => {
    const col = cols.value.find((column) => column.field === field)
    return col && col.exportable !== false
  })
  exportToExcel({ rows, fields, columns: cols.value, filename: 'Ot_FallidasReproceso.xlsx', columnTypes: {}, groupField: null })
}
</script>

<style scoped>
.fm-grid-counter {
  font-size: 12px;
  color: #222;
  padding-right: 8px;
}

.otf-grid-shell {
  border-left-width: 2px !important;
}

:deep(#tabla.fm-pass-grid),
:deep(#tabla.p-datatable) {
  border-left-width: 2px !important;
  border-left-style: solid !important;
  border-left-color: #00a9bd !important;
}

:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

:deep(#tabla .fm-icon-btn) {
  width: 24px !important;
  min-width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  padding: 0 !important;
  color: #001f2f !important;
  background: transparent !important;
  background-color: transparent !important;
}

:deep(#tabla .fm-icon-btn:hover),
:deep(#tabla .fm-icon-btn:focus),
:deep(#tabla .fm-icon-btn:focus-visible) {
  color: #006f7d !important;
  background: transparent !important;
  background-color: transparent !important;
}

:deep(#tabla .fm-icon-btn .pi),
:deep(#tabla .fm-icon-btn .pi::before) {
  width: 18px !important;
  min-width: 18px !important;
  height: 18px !important;
  min-height: 18px !important;
  font-size: 18px !important;
  line-height: 18px !important;
}
</style>
