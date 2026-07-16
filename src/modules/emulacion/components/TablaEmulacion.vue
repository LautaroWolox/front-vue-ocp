<template>
  <FmGridShell
    :loading="store.searching"
    loading-title="Buscando operadores"
    loading-message="Consultando operadores disponibles para emulación"
  >
    <DataTable
      id="tabla-emulacion"
      ref="dt"
      class="fm-pass-grid emulacion-grid"
      :value="store.data"
      dataKey="id"
      tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
      scrollable
      scrollHeight="360px"
      removableSort
      sortMode="multiple"
      filterDisplay="row"
      v-model:filters="filters"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 30, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Página {currentPage} de {totalPages}"
      showGridlines
      @row-click="onRowClick"
    >
      <template #empty>
        <div class="fm-grid-empty">No se encontraron operadores.</div>
      </template>

      <Column field="legajo" sortable :showFilterMenu="false" :style="columnStyle('155px')" :headerStyle="columnStyle('155px')" :bodyStyle="columnStyle('155px')">
        <template #header>
          <span class="emulacion-header-icon"><i class="pi pi-id-card"></i> LEGAJO</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div class="fm-filter-cell">
            <span class="fm-filter-prefix">~</span>
            <InputText v-model="filterModel.value" class="fm-column-filter" type="text" maxlength="13" @input="filterCallback()" />
            <span class="fm-filter-more">...</span>
          </div>
        </template>
        <template #body="{ data }">
          <span class="fm-cell-text emulacion-legajo-cell">{{ data.legajo }}</span>
        </template>
      </Column>

      <Column field="nombre" sortable :showFilterMenu="false" :style="columnStyle('190px')" :headerStyle="columnStyle('190px')" :bodyStyle="columnStyle('190px')">
        <template #header>
          <span class="emulacion-header-icon"><i class="pi pi-user"></i> NOMBRE</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div class="fm-filter-cell">
            <span class="fm-filter-prefix">~</span>
            <InputText v-model="filterModel.value" class="fm-column-filter" type="text" @input="filterCallback()" />
            <span class="fm-filter-more">...</span>
          </div>
        </template>
        <template #body="{ data }">
          <span class="fm-cell-text">{{ data.nombre }}</span>
        </template>
      </Column>

      <Column field="apellido" sortable :showFilterMenu="false" :style="columnStyle('210px')" :headerStyle="columnStyle('210px')" :bodyStyle="columnStyle('210px')">
        <template #header>
          <span class="emulacion-header-icon"><i class="pi pi-users"></i> APELLIDO</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div class="fm-filter-cell">
            <span class="fm-filter-prefix">~</span>
            <InputText v-model="filterModel.value" class="fm-column-filter" type="text" @input="filterCallback()" />
            <span class="fm-filter-more">...</span>
          </div>
        </template>
        <template #body="{ data }">
          <span class="fm-cell-text">{{ data.apellido }}</span>
        </template>
      </Column>

      <Column field="perfil" sortable :showFilterMenu="false" :style="columnStyle('230px')" :headerStyle="columnStyle('230px')" :bodyStyle="columnStyle('230px')">
        <template #header>
          <span class="emulacion-header-icon"><i class="pi pi-shield"></i> PERFIL</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div class="fm-filter-cell">
            <span class="fm-filter-prefix">~</span>
            <InputText v-model="filterModel.value" class="fm-column-filter" type="text" @input="filterCallback()" />
            <span class="fm-filter-more">...</span>
          </div>
        </template>
        <template #body="{ data }">
          <span class="fm-cell-text">{{ data.perfil }}</span>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showPopup" modal header="Emulación" class="fm-dialog emulacion-dialog">
      <div class="fm-dialog-body emulacion-dialog-body">
        <FmTypingLoader
          v-if="store.emulating"
          overlay
          variant="dialog"
          title="Emulando usuario"
          message="Preparando sesión del operador"
        />

        <div class="emulacion-confirm-icon">
          <i class="pi pi-id-card"></i>
        </div>
        <p class="emulacion-confirm-title">Se redireccionará al usuario seleccionado.</p>
        <p v-if="operario" class="emulacion-confirm-user">
          {{ operario.legajo }} - {{ operario.nombre }} {{ operario.apellido }}
        </p>
      </div>

      <template #footer>
        <FmButton label="CANCELAR" icon="pi-times" variant="outline" :disabled="store.emulating" @click="showPopup = false" />
        <FmButton label="ACEPTAR" icon="pi-check" :loading="store.emulating" @click="emular" />
      </template>
    </Dialog>

    <Toast position="top-center" />
  </FmGridShell>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { FilterMatchMode } from '@primevue/core/api'
import router from '@/router'
import emulacionStore from '../store/emulacionStore.js'
import { useToast } from 'primevue/usetoast'

const store = emulacionStore()
const showPopup = ref(false)
const operario = ref(null)
const toast = useToast()

const filters = ref({
  legajo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
  apellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
  perfil: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

watch(() => store.selectedOperador, (newVal) => {
  operario.value = newVal
})

const columnStyle = (width) => ({
  width,
  minWidth: width
})

const openEmulacionDialog = (row) => {
  operario.value = row
  store.$setSelectedOperador(row)
  showPopup.value = true
}

const onRowClick = (event) => {
  if (event?.data) openEmulacionDialog(event.data)
}

const emular = async () => {
  await store.$emulate()

  if (store.error_message) {
    toast.add({
      severity: 'error',
      summary: 'Error de emulación',
      detail: 'No se pudo emular al operador seleccionado.'
    })
    return
  }

  showPopup.value = false
  await router.push({ name: 'main' })
  window.location.reload()
}
</script>

<style scoped>
.emulacion-grid :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.emulacion-header-icon {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.emulacion-header-icon .pi {
  color: #008fa1;
  font-size: 13px;
}

.emulacion-legajo-cell {
  font-weight: 700;
  letter-spacing: .35px;
}

.emulacion-dialog-body {
  position: relative;
  min-height: 120px;
  text-align: center;
}

.emulacion-confirm-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #e0f7fa;
  color: #008fa1;
  font-size: 22px;
}

.emulacion-confirm-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: #263238;
}

.emulacion-confirm-user {
  margin: 0;
  font-size: 12px;
  color: #607d8b;
}
</style>
