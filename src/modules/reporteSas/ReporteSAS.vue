<template>
  <div class="fm-screen fm-screen--pad reporte-sas-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion reporte-sas-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>Reporte SAS</AccordionHeader>
        <AccordionContent>
          <Message v-if="error" severity="error" class="mb-3">
            Error al cargar los datos del reporte SAS.
          </Message>

          <FmGridShell
            :loading="isFetching"
            loading-title="Cargando Reporte SAS"
            loading-message="Consultando extracción de datos GM"
          >
            <DataTable
              id="tabla-reporte-sas"
              ref="dt"
              class="fm-pass-grid reporte-sas-grid"
              :value="processedData"
              dataKey="nroOT"
              tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
              scrollable
              scrollHeight="430px"
              removableSort
              sortMode="multiple"
              filterDisplay="row"
              v-model:filters="filters"
              paginator
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20, 50, 100, 200]"
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}"
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
                  <div v-if="col.filter !== false" class="fm-filter-cell reporte-sas-filter-cell">
                    <span class="fm-filter-prefix">~</span>
                    <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                    <span class="fm-filter-more">...</span>
                  </div>
                </template>

                <template #body="{ data, index }">
                  <div v-if="col.type === 'legajoList'" class="reporte-sas-legajo-cell">
                    <div class="reporte-sas-legajo-box" :class="{ 'reporte-sas-legajo-box--open': isExpanded(index, col.field) }">
                      <Button
                        type="button"
                        text
                        class="reporte-sas-legajo-toggle"
                        @click.stop="toggleExpand(index, col.field)"
                        @keydown.enter.stop="toggleExpand(index, col.field)"
                      >
                        <span class="reporte-sas-legajo-label">{{ getPreview(data[col.field]) }}</span>
                        <i v-if="isExpandable(data[col.field])" :class="isExpanded(index, col.field) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
                      </Button>

                      <div v-if="isExpanded(index, col.field)" class="reporte-sas-legajo-list">
                        <span v-for="(legajo, idx) in getLegajosArray(data[col.field])" :key="idx" class="reporte-sas-legajo-item">
                          {{ legajo }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span v-else class="fm-cell-text reporte-sas-cell-text" :title="String(data[col.field] ?? '')">{{ data[col.field] ?? '' }}</span>
                </template>
              </Column>
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFetch } from '@vueuse/core'
import { FilterMatchMode } from '@primevue/core/api'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useExcelExport } from '../../composables/useExportExcel'
import type { IDataReportSass } from './interfaces/index'
import { reporteSasColumns } from './columns/reporteSas'

interface ExpandedState { [key: string]: boolean }
interface ReporteColumn {
  field: string
  header: string
  hidden?: boolean
  exportable?: boolean
  filter?: boolean
  sort?: boolean
  width?: string
  minWidth?: string
  type?: string
}

const dt = ref()
const activePanels = ref(['0'])
const columns = ref<ReporteColumn[]>(reporteSasColumns)
const expandedCells = ref<ExpandedState>({})
const { exportToExcel, parseDataFromTable } = useExcelExport()

const visibleColumns = computed(() => columns.value.filter(col => !col.hidden))
const filters = ref(Object.fromEntries(visibleColumns.value.map(col => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])))

const { data, isFetching, error } = useFetch('/pc/extraccionDatosGM/searchMatDescargados.html', {
  immediate: true,
  onFetchError(ctx) {
    console.error('Error al cargar reporte SAS:', ctx.error)
    return ctx
  }
}).json<IDataReportSass[]>()

watch(error, newError => {
  if (newError) console.error('Error detectado:', newError)
})

const processedData = computed<IDataReportSass[]>(() => {
  return (data.value ?? []).map(item => ({
    ...item,
    legajoNOLDAP: normalizeLegajos(item.legajoNOLDAP)
  }))
})

const columnStyle = (col: ReporteColumn) => ({
  width: col.width || '120px',
  minWidth: col.minWidth || '58px',
  maxWidth: 'none'
})

const normalizeLegajos = (value: unknown): string => {
  return getLegajosArray(value).join(',')
}

const getExpandKey = (rowIndex: number, fieldName: string): string => `${rowIndex}_${fieldName}`
const isExpanded = (rowIndex: number, fieldName: string): boolean => expandedCells.value[getExpandKey(rowIndex, fieldName)] || false
const toggleExpand = (rowIndex: number, fieldName: string): void => {
  const key = getExpandKey(rowIndex, fieldName)
  expandedCells.value[key] = !expandedCells.value[key]
}

const getLegajosArray = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
  return String(value).split(',').map(item => item.trim()).filter(Boolean)
}

const isExpandable = (value: unknown): boolean => getLegajosArray(value).length > 1

const getPreview = (value: unknown): string => {
  const items = getLegajosArray(value)
  if (items.length <= 1) return items.join('')
  return `${items[0]} (+${items.length - 1} más)`
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  const fields = parsed.fields.filter((field: string) => {
    const col = columns.value.find(column => column.field === field)
    return col && col.exportable !== false
  })

  exportToExcel({
    rows: parsed.rows,
    fields,
    columns: reporteSasColumns,
    filename: 'reporteSAS.xlsx',
    columnTypes: {},
    groupField: 'codTarea'
  })
}
</script>

<style scoped>
.reporte-sas-page {
  width: 100%;
}

.reporte-sas-page :deep(.reporte-sas-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.reporte-sas-grid :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.reporte-sas-grid :deep(.p-datatable-thead > tr > th),
.reporte-sas-grid :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.reporte-sas-grid :deep(.p-sortable-column) {
  cursor: pointer !important;
}

.reporte-sas-grid :deep(.p-column-header-content) {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: visible !important;
}

.reporte-sas-grid :deep(.p-column-title) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.reporte-sas-grid :deep(.p-sortable-column-icon),
.reporte-sas-grid :deep(.p-column-resizer) {
  flex: 0 0 auto !important;
  min-width: 12px !important;
  overflow: visible !important;
}

.reporte-sas-cell-text {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.reporte-sas-filter-cell,
.reporte-sas-filter-cell :deep(.p-inputtext),
.reporte-sas-grid :deep(.fm-filter-cell),
.reporte-sas-grid :deep(.fm-column-filter) {
  min-width: 0 !important;
  width: 100% !important;
}

.reporte-sas-legajo-cell {
  width: 100%;
  min-width: 0;
}

.reporte-sas-legajo-box {
  width: 100%;
  min-width: 0;
  border: 1px solid #d9e3e8;
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;
}

.reporte-sas-legajo-box--open {
  border-color: #00a9bd;
  box-shadow: 0 0 0 2px rgba(0, 169, 189, .12);
}

.reporte-sas-legajo-toggle,
:deep(.reporte-sas-legajo-toggle.p-button) {
  width: 100% !important;
  min-width: 0 !important;
  min-height: 32px !important;
  padding: 0 8px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: #ffffff !important;
  color: #263746 !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 6px !important;
  cursor: pointer !important;
  text-align: left !important;
  font-size: 12px !important;
}

.reporte-sas-legajo-toggle:hover,
:deep(.reporte-sas-legajo-toggle.p-button:hover) {
  background: #eefcff !important;
  color: #263746 !important;
}

.reporte-sas-legajo-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reporte-sas-legajo-toggle :deep(.p-button-label) {
  display: none !important;
}

.reporte-sas-legajo-list {
  padding: 6px;
  border-top: 1px solid #e2edf1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 150px;
  overflow: auto;
  background: #fbfdfe;
}

.reporte-sas-legajo-item {
  padding: 4px 6px;
  border-radius: 3px;
  background: #eefcff;
  color: #263746;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
