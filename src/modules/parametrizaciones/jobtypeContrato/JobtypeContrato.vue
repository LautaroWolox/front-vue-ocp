<template>
  <div class="fm-screen fm-screen--pad jobtype-contrato-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion jobtype-contrato-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BÚSQUEDA</AccordionHeader>
        <AccordionContent>
          <div class="jobtype-contrato-filters">
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
        <AccordionHeader>RELACIONES JOBTYPE-CONTRATO</AccordionHeader>
        <AccordionContent>
          <FmGridShell
            :loading="store.loading"
            loading-title="Cargando Jobtype-Contrato"
            loading-message="Consultando relaciones jobtype-contrato"
          >
            <DataTable
              id="tabla-jobtype-contrato"
              ref="dt"
              class="fm-pass-grid jobtype-contrato-grid"
              :value="store.rows"
              dataKey="id"
              tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
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
                <div class="jobtype-grid-actions" aria-label="Acciones de grilla">
                  <Button icon="pi pi-download" text rounded class="fm-grid-action-final jobtype-grid-action" title="Exportar" aria-label="Exportar" v-tooltip.top="'Exportar'" @click="exportarExcel" />
                  <Button icon="pi pi-trash" text rounded class="fm-grid-action-final jobtype-grid-action" :disabled="!store.hasSelection" title="Eliminar" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click="eliminar" />
                  <Button icon="pi pi-pencil" text rounded class="fm-grid-action-final jobtype-grid-action" :disabled="!store.hasSelection" title="Editar" aria-label="Editar" v-tooltip.top="'Editar'" @click="abrirEdicion" />
                  <Button icon="pi pi-plus" text rounded class="fm-grid-action-final jobtype-grid-action" title="Nueva Relación" aria-label="Nueva Relación" v-tooltip.top="'Nueva Relación'" @click="abrirAlta" />
                </div>
              </template>

              <template #paginatorend>
                <span class="fm-grid-counter">
                  Mostrando {{ store.rows.length ? 1 : 0 }} - {{ Math.min(10, store.rows.length) }} de {{ store.rows.length }}
                </span>
              </template>

              <template #empty>
                <div class="fm-grid-empty">No hay resultados</div>
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
                  <div class="fm-filter-cell jobtype-filter-cell">
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
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Dialog
      v-model:visible="showAlta"
      class="jobtype-modal jobtype-modal--alta"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '980px', maxWidth: 'calc(100vw - 48px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Alta Jobtype - Contrato</span>
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

      <div class="jobtype-modal-form jobtype-modal-form--origen">
        <div class="jobtype-modal-field jobtype-modal-field--pais">
          <label for="alta-pais">Pais</label>
          <Select id="alta-pais" v-model="altaForm.pais" :options="paisOptions" optionLabel="label" optionValue="value" class="jobtype-modal-select" />
        </div>

        <div class="jobtype-modal-field">
          <label for="alta-jobtype">Jobtype</label>
          <InputText id="alta-jobtype" v-model="altaForm.jobtype" class="jobtype-modal-input" />
        </div>

        <div class="jobtype-modal-field">
          <label for="alta-contrato">Contrato</label>
          <InputText id="alta-contrato" v-model="altaForm.contrato" class="jobtype-modal-input" />
        </div>

        <div class="jobtype-modal-field">
          <label for="alta-origen">Origen</label>
          <Select id="alta-origen" v-model="altaForm.origen" :options="origenOptions" optionLabel="label" optionValue="value" class="jobtype-modal-select" />
        </div>

        <Button label="AGREGAR" class="jobtype-modal-button jobtype-modal-button--add" :disabled="!canAgregarRelacion" @click="agregarRelacionPreview" />
      </div>

      <div class="jobtype-alta-grid-shell">
        <DataTable
          id="tabla-jobtype-alta"
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

    <Dialog
      v-model:visible="showEdicion"
      class="jobtype-modal jobtype-modal--edicion jobtype-modal--edicion-origen"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '940px', maxWidth: 'calc(100vw - 48px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Edición Jobtype-Contrato</span>
          <span
            role="button"
            tabindex="0"
            class="jobtype-modal-close"
            aria-label="Cerrar"
            @click="showEdicion = false"
            @keydown.enter.prevent="showEdicion = false"
            @keydown.space.prevent="showEdicion = false"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </span>
        </div>
      </template>

      <div class="jobtype-edit-form jobtype-edit-form--origen">
        <div class="jobtype-modal-field">
          <label for="edit-jobtype">JobType</label>
          <InputText id="edit-jobtype" v-model="editForm.jobtype" class="jobtype-modal-input" disabled />
        </div>

        <div class="jobtype-modal-field">
          <label for="edit-contrato-actual">Contrato</label>
          <InputText id="edit-contrato-actual" v-model="editForm.contratoActual" class="jobtype-modal-input" disabled />
        </div>

        <div class="jobtype-modal-field">
          <label for="edit-pais">País</label>
          <InputText id="edit-pais" v-model="editForm.pais" class="jobtype-modal-input" disabled />
        </div>

        <div class="jobtype-modal-field jobtype-edit-empty" aria-hidden="true"></div>

        <div class="jobtype-modal-field">
          <label for="edit-contrato-nuevo">Nuevo Contrato</label>
          <InputText id="edit-contrato-nuevo" v-model="editForm.contratoNuevo" class="jobtype-modal-input jobtype-input--active" />
        </div>

        <div class="jobtype-modal-field">
          <label for="edit-origen">Origen</label>
          <Select id="edit-origen" v-model="editForm.origen" :options="editOrigenOptions" optionLabel="label" optionValue="value" class="jobtype-modal-select jobtype-input--active" />
        </div>
      </div>

      <template #footer>
        <Button label="ACTUALIZAR" class="jobtype-modal-button jobtype-modal-button--update" @click="actualizarRelacion" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showEliminar"
      class="jobtype-delete-confirm"
      appendTo="body"
      :modal="true"
      :draggable="false"
      :resizable="false"
      :closable="false"
      :style="{ width: '560px', maxWidth: 'calc(100vw - 32px)' }"
    >
      <template #header>
        <div class="jobtype-delete-confirm__header">
          <span class="jobtype-delete-confirm__title">Alerta</span>
          <span
            role="button"
            tabindex="0"
            class="jobtype-delete-confirm__close"
            aria-label="Cerrar"
            @click="cancelarEliminar"
            @keydown.enter.prevent="cancelarEliminar"
            @keydown.space.prevent="cancelarEliminar"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </span>
        </div>
      </template>

      <div class="jobtype-delete-confirm__body">
        <i class="pi pi-exclamation-triangle jobtype-delete-confirm__icon" aria-hidden="true"></i>
        <span class="jobtype-delete-confirm__message">
          ¿Confirma que desea desactivar la relación seleccionada?
        </span>
      </div>

      <template #footer>
        <div class="jobtype-delete-confirm__footer">
          <button type="button" class="jobtype-delete-confirm__button jobtype-delete-confirm__button--cancel" @click="cancelarEliminar">
            CANCELAR
          </button>
          <button type="button" class="jobtype-delete-confirm__button jobtype-delete-confirm__button--accept" @click="confirmarEliminar">
            ACEPTAR
          </button>
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showAltaDuplicado"
      class="jobtype-delete-confirm jobtype-duplicate-alert"
      appendTo="body"
      :modal="true"
      :draggable="false"
      :resizable="false"
      :closable="false"
      :style="{ width: '560px', maxWidth: 'calc(100vw - 32px)' }"
    >
      <template #header>
        <div class="jobtype-delete-confirm__header">
          <span class="jobtype-delete-confirm__title">Alerta</span>
          <span
            role="button"
            tabindex="0"
            class="jobtype-delete-confirm__close"
            aria-label="Cerrar"
            @click="cerrarAltaDuplicado"
            @keydown.enter.prevent="cerrarAltaDuplicado"
            @keydown.space.prevent="cerrarAltaDuplicado"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </span>
        </div>
      </template>

      <div class="jobtype-delete-confirm__body">
        <i class="pi pi-exclamation-triangle jobtype-delete-confirm__icon" aria-hidden="true"></i>
        <span class="jobtype-delete-confirm__message">
          {{ altaDuplicadoMensaje }}
        </span>
      </div>

      <template #footer>
        <div class="jobtype-delete-confirm__footer">
          <button type="button" class="jobtype-delete-confirm__button jobtype-delete-confirm__button--accept" @click="cerrarAltaDuplicado">
            CERRAR
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { FilterMatchMode } from '@primevue/core/api'
import { useExcelExport } from '@/composables/useExportExcel'
import { jobtypeContratoColumns } from './columns'
import { useJobtypeContratoStore } from './store'

const store = useJobtypeContratoStore()
const dt = ref()
const activePanels = ref(['0'])
const columns = ref(jobtypeContratoColumns)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const showAlta = ref(false)
const showEdicion = ref(false)
const showEliminar = ref(false)
const showAltaDuplicado = ref(false)
const altaDuplicadoMensaje = ref('El Jobtype seleccionado ya está cargado.')
const altaRows = ref([])
const altaSelectedRow = ref(null)

const altaColumns = ref([
  { field: 'codigoTarea', header: 'CODIGO_TAREA', width: '20%', minWidth: '145px' },
  { field: 'tarea', header: 'TAREA', width: '24%', minWidth: '180px' },
  { field: 'origen', header: 'ORIGEN', width: '16%', minWidth: '130px' },
  { field: 'nombreContrato', header: 'NOMBRE_CONTRATO', width: '24%', minWidth: '180px' },
  { field: 'pais', header: 'PAIS', width: '16%', minWidth: '120px' }
])

const paisOptions = [
  { label: '', value: '' },
  { label: 'ARG/UY', value: 'ARG/UY' },
  { label: 'PY', value: 'PY' }
]

const origenAllOptions = [
  { label: '', value: '' },
  { label: 'FAN', value: 'FAN' },
  { label: 'MXM', value: 'MXM' }
]

const origenPyOptions = [
  { label: 'FAN', value: 'FAN' }
]

const altaForm = reactive({
  pais: '',
  jobtype: '',
  contrato: '',
  origen: ''
})

const editForm = reactive({
  jobtype: '',
  contratoActual: '',
  pais: '',
  contratoNuevo: '',
  origen: ''
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

const origenOptions = computed(() => (altaForm.pais === 'PY' ? origenPyOptions : origenAllOptions))
const editOrigenOptions = computed(() => (editForm.pais === 'PY' ? origenPyOptions : origenAllOptions))

const canAgregarRelacion = computed(() => Boolean(
  altaForm.jobtype.trim() &&
  altaForm.contrato.trim() &&
  altaForm.pais &&
  altaForm.origen
))

const normalizarOrigenPorPais = (pais, origen) => {
  if (pais === 'PY') return 'FAN'
  if (['FAN', 'MXM'].includes(origen)) return origen
  return ''
}

watch(
  () => altaForm.pais,
  (pais) => {
    altaForm.origen = normalizarOrigenPorPais(pais, altaForm.origen)
  }
)

watch(
  () => editForm.pais,
  (pais) => {
    editForm.origen = normalizarOrigenPorPais(pais, editForm.origen)
  }
)

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
  'jobtype-row-selected': store.selectedRow?.id === data?.id
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
    filename: 'jobtype_contrato.xlsx',
    columnTypes: {},
    groupField: null
  })
}

const abrirAlta = () => {
  altaForm.pais = ''
  altaForm.jobtype = ''
  altaForm.contrato = ''
  altaForm.origen = ''
  altaRows.value = []
  altaSelectedRow.value = null
  Object.values(altaTableFilters.value).forEach((filter) => {
    filter.value = null
  })
  showAlta.value = true
}

const normalizarJobtype = (value) => value.trim().toUpperCase()

const existeJobtypeEnAlta = (jobtype) => {
  const jobtypeNormalizado = normalizarJobtype(jobtype)
  return altaRows.value.some((row) => normalizarJobtype(row.codigoTarea || row.tarea || '') === jobtypeNormalizado)
}

const mostrarAltaDuplicado = (mensaje = 'El Jobtype seleccionado ya está cargado.') => {
  altaDuplicadoMensaje.value = mensaje
  showAltaDuplicado.value = true
}

const cerrarAltaDuplicado = () => {
  showAltaDuplicado.value = false
}

const agregarRelacionPreview = () => {
  if (!canAgregarRelacion.value) return

  const jobtype = altaForm.jobtype.trim()
  if (existeJobtypeEnAlta(jobtype)) {
    mostrarAltaDuplicado('El Jobtype seleccionado ya está cargado.')
    return
  }

  const newRow = {
    id: Date.now(),
    codigoTarea: normalizarJobtype(jobtype),
    tarea: jobtype,
    origen: altaForm.origen,
    nombreContrato: altaForm.contrato.trim(),
    pais: altaForm.pais
  }

  altaRows.value = [...altaRows.value, newRow]
  altaSelectedRow.value = newRow
  altaForm.jobtype = ''
  altaForm.contrato = ''
  if (altaForm.pais === 'PY') {
    altaForm.origen = 'FAN'
  }
}

const eliminarAltaPreview = () => {
  if (!altaSelectedRow.value) return
  const deletedId = altaSelectedRow.value.id
  altaRows.value = altaRows.value.filter((row) => row.id !== deletedId)
  altaSelectedRow.value = null
}

const relacionar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - VALIDAR JOBTYPE-CONTRATO CONTRA BASE
  // Antes de guardar, enviar altaRows.value al servicio real para validar si algun
  // jobtype/origen/pais ya existe en base. Si el backend devuelve duplicado,
  // llamar a mostrarAltaDuplicado('El Jobtype seleccionado ya está cargado.')
  // y NO cerrar el popup.

  // ACA TIENE QUE CONECTAR EL BACKEND - ALTA RELACION JOBTYPE-CONTRATO
  // Si la validacion contra base responde OK, enviar altaRows.value al servicio
  // real de alta y refrescar la grilla principal con buscar().
  showAlta.value = false
}

const abrirEdicion = () => {
  if (!store.selectedRow) return

  editForm.jobtype = store.selectedRow.tarea || store.selectedRow.codigoTarea || ''
  editForm.contratoActual = store.selectedRow.nombreContrato || ''
  editForm.pais = store.selectedRow.pais || ''
  editForm.contratoNuevo = ''
  editForm.origen = normalizarOrigenPorPais(editForm.pais, store.selectedRow.origen || '')
  showEdicion.value = true
}

const actualizarRelacion = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ACTUALIZAR RELACION JOBTYPE-CONTRATO
  // Enviar al servicio real store.selectedRow + editForm.contratoNuevo + editForm.origen.
  // Si editForm.contratoNuevo viene vacio, el backend puede mantener el contrato actual.
  // Si editForm.pais es PY, el origen ya viaja forzado como FAN.
  showEdicion.value = false
}

const eliminar = () => {
  if (!store.selectedRow) return
  showEliminar.value = true
}

const cancelarEliminar = () => {
  showEliminar.value = false
}

const confirmarEliminar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - DESACTIVAR RELACION JOBTYPE-CONTRATO
  // Usar store.selectedRow para enviar la relacion seleccionada al servicio real.
  showEliminar.value = false
}
</script>

<style scoped>
.jobtype-contrato-page {
  width: 100%;
}

.jobtype-contrato-page :deep(.jobtype-contrato-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.jobtype-contrato-page :deep(.p-accordionpanel + .p-accordionpanel) {
  margin-top: 4px !important;
}

.jobtype-contrato-filters {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
}

.jobtype-modal-form--origen {
  grid-template-columns: 125px minmax(0, 1fr) minmax(0, 1fr) 125px 112px !important;
}

.jobtype-edit-form--origen {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 16px 22px !important;
  padding: 8px 4px 28px !important;
}

.jobtype-edit-empty {
  visibility: hidden !important;
  pointer-events: none !important;
}

.jobtype-edit-form--origen .jobtype-modal-input,
.jobtype-edit-form--origen .jobtype-modal-select,
.jobtype-edit-form--origen .jobtype-modal-input.p-inputtext,
.jobtype-edit-form--origen .jobtype-modal-select.p-select {
  height: 34px !important;
  min-height: 34px !important;
  max-height: 34px !important;
}

.jobtype-edit-form--origen .jobtype-modal-select .p-select-label {
  line-height: 24px !important;
}

.jobtype-contrato-grid :deep(.p-datatable-table),
.jobtype-alta-datatable :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.jobtype-contrato-grid :deep(.p-datatable-thead > tr > th),
.jobtype-contrato-grid :deep(.p-datatable-tbody > tr > td),
.jobtype-alta-datatable :deep(.p-datatable-thead > tr > th),
.jobtype-alta-datatable :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr),
.jobtype-alta-datatable :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr:hover > td),
.jobtype-alta-datatable :deep(.p-datatable-tbody > tr:hover > td) {
  background: rgba(0, 180, 181, .06) !important;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr.jobtype-row-selected > td),
.jobtype-contrato-grid :deep(.p-datatable-tbody > tr.p-highlight > td),
.jobtype-alta-datatable :deep(.p-datatable-tbody > tr.jobtype-row-selected > td),
.jobtype-alta-datatable :deep(.p-datatable-tbody > tr.p-highlight > td) {
  background: #e8f8fb !important;
  color: #0f2f3d !important;
  font-weight: 600 !important;
}

.jobtype-cell-text {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.jobtype-grid-actions {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 12px !important;
  overflow: visible !important;
  line-height: 1 !important;
}

.jobtype-grid-actions--alta {
  padding-left: 2px;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action) {
  width: 16px !important;
  min-width: 16px !important;
  max-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  max-height: 16px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #001f2f !important;
  box-shadow: none !important;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:hover),
.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:focus) {
  color: #008fa1 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:disabled),
.jobtype-grid-actions :deep(.p-button.jobtype-grid-action.p-disabled) {
  color: #001f2f !important;
  opacity: .35 !important;
  cursor: not-allowed !important;
}

.jobtype-grid-actions :deep(.p-button-label) {
  display: none !important;
}

.jobtype-grid-actions :deep(.p-button-icon),
.jobtype-grid-actions :deep(.pi) {
  width: 12px !important;
  min-width: 12px !important;
  height: 12px !important;
  min-height: 12px !important;
  font-size: 12px !important;
  line-height: 12px !important;
  margin: 0 !important;
}

.jobtype-alta-grid-shell {
  position: relative;
  width: 100%;
  min-width: 0;
}

.jobtype-alta-trash-left,
.jobtype-alta-trash-left:hover,
.jobtype-alta-trash-left:focus,
.jobtype-alta-trash-left:active,
.jobtype-alta-trash-left:disabled {
  position: absolute !important;
  left: 14px !important;
  bottom: 8px !important;
  z-index: 5 !important;
  width: 22px !important;
  min-width: 22px !important;
  height: 22px !important;
  min-height: 22px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  outline: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: #001f2f !important;
  opacity: 1 !important;
  cursor: pointer !important;
}

.jobtype-alta-trash-left:disabled {
  opacity: .55 !important;
  cursor: not-allowed !important;
}

.jobtype-alta-trash-left .pi {
  width: 16px !important;
  min-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  font-size: 16px !important;
  line-height: 16px !important;
  color: #001f2f !important;
}

.jobtype-alta-empty {
  height: 148px !important;
  min-height: 148px !important;
}

:global(.jobtype-delete-confirm.p-dialog) {
  border-radius: 0 !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .16) !important;
  overflow: hidden !important;
}

:global(.jobtype-delete-confirm .p-dialog-header) {
  min-height: 56px !important;
  padding: 0 !important;
  border-bottom: 1px solid #d8e0e5 !important;
}

:global(.jobtype-delete-confirm__header) {
  width: 100% !important;
  min-height: 56px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 18px 0 20px !important;
}

:global(.jobtype-delete-confirm__title) {
  color: #2c3e4d !important;
  font-size: 26px !important;
  font-weight: 400 !important;
  line-height: 1 !important;
}

:global(.jobtype-delete-confirm__close) {
  width: 30px !important;
  height: 30px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #8da0aa !important;
  cursor: pointer !important;
}

:global(.jobtype-delete-confirm__close:hover),
:global(.jobtype-delete-confirm__close:focus) {
  color: #00a9bd !important;
}

:global(.jobtype-delete-confirm__close .pi) {
  font-size: 27px !important;
  font-weight: 700 !important;
}

:global(.jobtype-delete-confirm .p-dialog-content) {
  padding: 0 !important;
  border-bottom: 1px solid #d8e0e5 !important;
  overflow: hidden !important;
}

:global(.jobtype-delete-confirm__body) {
  min-height: 145px !important;
  display: flex !important;
  align-items: center !important;
  gap: 32px !important;
  padding: 0 38px !important;
}

:global(.jobtype-delete-confirm__icon) {
  width: 56px !important;
  min-width: 56px !important;
  color: #e5393f !important;
  font-size: 55px !important;
  line-height: 55px !important;
  filter: drop-shadow(0 10px 14px rgba(229, 57, 63, .13)) !important;
}

:global(.jobtype-delete-confirm__message) {
  color: #2c3e4d !important;
  font-size: 22px !important;
  font-weight: 400 !important;
  line-height: 1.28 !important;
}

:global(.jobtype-delete-confirm .p-dialog-footer) {
  min-height: 74px !important;
  padding: 0 20px !important;
  border-top: 0 !important;
}

:global(.jobtype-delete-confirm__footer) {
  width: 100% !important;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 14px !important;
}

:global(.jobtype-delete-confirm__button) {
  min-width: 170px !important;
  height: 56px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 7px !important;
  padding: 0 24px !important;
  font-size: 24px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
  cursor: pointer !important;
  box-shadow: none !important;
  outline: 0 !important;
}

:global(.jobtype-delete-confirm__button--cancel) {
  background: #ffffff !important;
  background-color: #ffffff !important;
  border: 1px solid #00a9bd !important;
  color: #00a9bd !important;
}

:global(.jobtype-delete-confirm__button--cancel:hover),
:global(.jobtype-delete-confirm__button--cancel:focus) {
  background: #dff7fb !important;
  background-color: #dff7fb !important;
  border: 1px solid #00a9bd !important;
  color: #00a9bd !important;
}

:global(.jobtype-delete-confirm__button--accept) {
  background: #00a9bd !important;
  background-color: #00a9bd !important;
  border: 1px solid #00a9bd !important;
  color: #ffffff !important;
}

:global(.jobtype-delete-confirm__button--accept:hover),
:global(.jobtype-delete-confirm__button--accept:focus) {
  background: #00a9bd !important;
  background-color: #00a9bd !important;
  border: 1px solid #00a9bd !important;
  color: #ffffff !important;
}
</style>
