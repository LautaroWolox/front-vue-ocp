<template>
  <div class="fm-screen fm-screen--pad cmo-actividad-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion cmo-actividad-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BÚSQUEDA</AccordionHeader>
        <AccordionContent>
          <div class="cmo-actividad-filters">
            <FmButton
              label="BUSCAR"
              icon="pi-search"
              :loading="store.loading"
              loading-label="BUSCANDO..."
              @click="buscar"
            />
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel v-if="store.searched || store.loading" value="1">
        <AccordionHeader>RELACIONES CMO-ACTIVIDAD</AccordionHeader>
        <AccordionContent>
          <FmGridShell
            :loading="store.loading"
            loading-title="Cargando CMO-Actividad"
            loading-message="Consultando relaciones cmo-actividad"
          >
            <DataTable
              id="tabla-cmo-actividad"
              ref="dt"
              class="fm-pass-grid cmo-actividad-grid"
              :value="store.rows"
              dataKey="id"
              tableStyle="table-layout: fixed; width: 100%; min-width: 100%"
              scrollable
              scrollHeight="430px"
              removableSort
              sortMode="multiple"
              filterDisplay="row"
              v-model:filters="filters"
              v-model:selection="selectedRow"
              selectionMode="single"
              :rowClass="rowClass"
              paginator
              :rows="10"
              :rowsPerPageOptions="[10, 20, 50, 100]"
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Pagina {currentPage} de {totalPages}"
              :resizableColumns="true"
              columnResizeMode="expand"
              showGridlines
              @row-click="onRowClick"
            >
              <template #paginatorstart>
                <div class="cmo-grid-actions" aria-label="Acciones de grilla">
                  <Button icon="pi pi-download" text rounded class="fm-grid-action-final cmo-grid-action" title="Exportar" aria-label="Exportar" v-tooltip.top="'Exportar'" @click="exportarExcel" />
                  <Button icon="pi pi-plus" text rounded class="fm-grid-action-final cmo-grid-action" title="Nueva Relación" aria-label="Nueva Relación" v-tooltip.top="'Nueva Relación'" @click="abrirAlta" />
                  <Button icon="pi pi-pencil" text rounded class="fm-grid-action-final cmo-grid-action" :disabled="!store.hasSelection" title="Editar" aria-label="Editar" v-tooltip.top="'Editar'" @click="editar" />
                  <Button icon="pi pi-trash" text rounded class="fm-grid-action-final cmo-grid-action" :disabled="!store.hasSelection" title="Eliminar" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click="eliminar" />
                </div>
              </template>

              <template #paginatorend>
                <span class="fm-grid-counter" v-if="store.rows.length">
                  Mostrando {{ firstVisibleRow }} - {{ lastVisibleRow }} de {{ store.rows.length }}
                </span>
                <span class="fm-grid-counter" v-else>No hay resultados</span>
              </template>

              <template #empty>
                <div class="fm-grid-empty cmo-grid-empty">No hay resultados</div>
              </template>

              <Column
                v-for="col in columns"
                :key="col.field"
                :field="col.field"
                :sortField="col.field"
                :filterField="col.field"
                :header="col.header"
                sortable
                filter
                :showFilterMenu="false"
                :exportable="col.exportable"
                :style="columnStyle(col)"
                :headerStyle="columnStyle(col)"
                :bodyStyle="columnStyle(col)"
              >
                <template #filter="{ filterModel, filterCallback }">
                  <div class="fm-filter-cell cmo-filter-cell">
                    <span class="fm-filter-prefix">~</span>
                    <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                    <span class="fm-filter-more">...</span>
                  </div>
                </template>

                <template #body="{ data }">
                  <span class="fm-cell-text cmo-cell-text" :title="String(data[col.field] ?? '')">
                    {{ data[col.field] ?? '' }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Dialog
      v-model:visible="showAlta"
      class="jobtype-modal jobtype-modal--alta cmo-alta-compact-modal"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '980px', maxWidth: 'calc(100vw - 48px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Alta CMO - Actividad</span>
          <span
            role="button"
            tabindex="0"
            class="jobtype-modal-close"
            aria-label="Cerrar"
            @click="showAlta = false"
            @keydown.enter.prevent="showAlta = false"
            @keydown.space.prevent="showAlta = false"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </span>
        </div>
      </template>

      <div class="jobtype-modal-form cmo-modal-form--jobtype-aligned">
        <div class="jobtype-modal-field jobtype-modal-field--pais cmo-pais-placeholder" aria-hidden="true"></div>

        <div class="jobtype-modal-field">
          <label for="alta-cmo-actividad">Actividad</label>
          <InputText id="alta-cmo-actividad" v-model="altaForm.actividad" class="jobtype-modal-input" />
        </div>

        <div class="jobtype-modal-field">
          <label for="alta-cmo-cmo">CMO</label>
          <InputText id="alta-cmo-cmo" v-model="altaForm.cmo" class="jobtype-modal-input" />
        </div>

        <Button label="AGREGAR" class="jobtype-modal-button jobtype-modal-button--add" :disabled="!canAgregarRelacion" @click="agregarRelacionPreview" />
      </div>

      <div class="jobtype-alta-grid-shell">
        <DataTable
          id="tabla-cmo-alta-jobtype"
          class="fm-pass-grid jobtype-alta-datatable"
          :value="altaRows"
          dataKey="id"
          tableStyle="table-layout: fixed; width: 100%; min-width: 100%"
          scrollable
          scrollHeight="210px"
          removableSort
          sortMode="multiple"
          filterDisplay="row"
          v-model:filters="altaTableFilters"
          v-model:selection="altaSelectedRow"
          selectionMode="single"
          :rowClass="altaRowClass"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="Página {currentPage} de {totalPages}"
          :resizableColumns="true"
          columnResizeMode="expand"
          showGridlines
          @row-click="onAltaRowClick"
        >
          <template #empty>
            <div class="fm-grid-empty jobtype-alta-empty">No hay relaciones agregadas</div>
          </template>

          <Column
            v-for="col in altaColumns"
            :key="col.field"
            :field="col.field"
            :sortField="col.field"
            :filterField="col.field"
            :header="col.header"
            sortable
            filter
            :showFilterMenu="false"
            :style="altaColumnStyle(col)"
            :headerStyle="altaColumnStyle(col)"
            :bodyStyle="altaColumnStyle(col)"
          >
            <template #filter="{ filterModel, filterCallback }">
              <div class="fm-filter-cell jobtype-filter-cell jobtype-filter-cell--alta">
                <span class="fm-filter-prefix">~</span>
                <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                <span class="fm-filter-more">...</span>
              </div>
            </template>

            <template #body="{ data }">
              <span class="fm-cell-text jobtype-cell-text" :title="String(data[col.field] ?? '')">
                {{ data[col.field] ?? '' }}
              </span>
            </template>
          </Column>
        </DataTable>

        <button
          type="button"
          class="jobtype-alta-trash-left"
          :disabled="!altaSelectedRow"
          title="Eliminar"
          aria-label="Eliminar"
          v-tooltip.top="'Eliminar'"
          @click="eliminarAltaPreview"
        >
          <i class="pi pi-trash" aria-hidden="true"></i>
        </button>
      </div>

      <template #footer>
        <Button label="RELACIONAR" class="jobtype-modal-button jobtype-modal-button--relacionar" :disabled="altaRows.length === 0" @click="relacionar" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'
import { useExcelExport } from '@/composables/useExportExcel'
import { cmoActividadColumns } from './columns'
import { useCmoActividadStore } from './store'

const store = useCmoActividadStore()
const dt = ref()
const activePanels = ref(['0'])
const columns = ref(cmoActividadColumns)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const showAlta = ref(false)
const altaRows = ref([])
const altaSelectedRow = ref(null)

const altaColumns = ref([
  { field: 'codigoActividad', header: 'CODIGO_ACTIVIDAD', width: '24%', minWidth: '140px' },
  { field: 'descActividad', header: 'DESC_ACTIVIDAD', width: '34%', minWidth: '200px' },
  { field: 'codigoS4', header: 'CODIGO_S4', width: '24%', minWidth: '140px' },
  { field: 'cmo', header: 'CMO', width: '18%', minWidth: '110px' }
])

const altaForm = reactive({
  actividad: '',
  cmo: ''
})

const filters = ref(
  Object.fromEntries(
    columns.value.map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])
  )
)

const altaTableFilters = ref(
  Object.fromEntries(
    altaColumns.value.map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])
  )
)

const selectedRow = computed({
  get: () => store.selectedRow,
  set: (value) => store.setSelectedRow(value)
})

const firstVisibleRow = computed(() => (store.rows.length ? 1 : 0))
const lastVisibleRow = computed(() => Math.min(10, store.rows.length))
const canAgregarRelacion = computed(() => Boolean(altaForm.actividad.trim() && altaForm.cmo.trim()))

const buscar = async () => {
  activePanels.value = ['0', '1']
  await store.search()
  activePanels.value = ['0', '1']
}

const columnStyle = (col) => ({
  width: col.width || '140px',
  minWidth: col.minWidth || col.width || '100px',
  maxWidth: 'none'
})

const altaColumnStyle = (col) => ({
  width: col.width || '140px',
  minWidth: col.minWidth || col.width || '100px',
  maxWidth: col.width || 'none'
})

const rowClass = (data) => ({
  'fm-selected-row': store.selectedRow?.id === data?.id,
  'cmo-row-selected': store.selectedRow?.id === data?.id
})

const altaRowClass = (data) => ({
  'fm-selected-row': altaSelectedRow.value?.id === data?.id,
  'jobtype-row-selected': altaSelectedRow.value?.id === data?.id
})

const onRowClick = (event) => {
  if (event?.data) store.setSelectedRow(event.data)
}

const onAltaRowClick = (event) => {
  if (event?.data) altaSelectedRow.value = event.data
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  exportToExcel({
    rows: parsed.rows,
    fields: parsed.fields,
    columns: columns.value,
    filename: 'cmo_actividad.xlsx',
    columnTypes: {},
    groupField: null
  })
}

const abrirAlta = () => {
  altaForm.actividad = ''
  altaForm.cmo = ''
  altaRows.value = []
  altaSelectedRow.value = null
  Object.values(altaTableFilters.value).forEach((filter) => {
    filter.value = null
  })
  showAlta.value = true
}

const agregarRelacionPreview = () => {
  if (!canAgregarRelacion.value) return

  const actividad = altaForm.actividad.trim()
  const cmo = altaForm.cmo.trim()
  const newRow = {
    id: Date.now(),
    codigoActividad: actividad.toUpperCase(),
    descActividad: actividad,
    codigoS4: actividad.toUpperCase(),
    cmo
  }

  altaRows.value = [...altaRows.value, newRow]
  altaSelectedRow.value = newRow
  altaForm.actividad = ''
  altaForm.cmo = ''
}

const eliminarAltaPreview = () => {
  if (!altaSelectedRow.value) return
  const deletedId = altaSelectedRow.value.id
  altaRows.value = altaRows.value.filter((row) => row.id !== deletedId)
  altaSelectedRow.value = null
}

const relacionar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ALTA RELACION CMO-ACTIVIDAD
  // Enviar altaRows.value al servicio real y refrescar la grilla principal.
  showAlta.value = false
}

const editar = () => {
  if (!store.selectedRow) return
  // ACA TIENE QUE CONECTAR EL BACKEND - EDITAR RELACION CMO-ACTIVIDAD
}

const eliminar = () => {
  if (!store.selectedRow) return
  // ACA TIENE QUE CONECTAR EL BACKEND - ELIMINAR/DESACTIVAR RELACION CMO-ACTIVIDAD
}
</script>
