<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters emulacion-filters">
    <div class="fm-filter-grid emulacion-filter-grid">
      <div class="fm-field emulacion-legajo-field">
        <label for="legajo-emulacion">LEGAJO</label>
        <div class="emulacion-legajo-control">
          <InputText
            id="legajo-emulacion"
            v-model="legajo"
            class="fm-input emulacion-legajo-input"
            type="text"
            maxlength="13"
            autocomplete="off"
            @input="onLegajoInput"
            @keyup.enter="onSearch"
          />
          <span class="emulacion-legajo-icon" aria-hidden="true">
            <i class="pi pi-id-card"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="fm-actions fm-filter-actions emulacion-actions">
      <FmButton label="BUSCAR" icon="pi-search" :loading="storeEmulacion.searching" @click="onSearch" />
      <FmButton label="LIMPIAR" icon="pi-align-left" variant="outline" @click="onClear" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import emulacionStore from '../../store/emulacionStore.js'

const storeEmulacion = emulacionStore()
const legajo = ref(storeEmulacion.legajoSelected)

watch(() => storeEmulacion.legajoSelected, (newVal) => {
  legajo.value = newVal
})

const onLegajoInput = () => {
  const normalized = String(legajo.value || '').toUpperCase().slice(0, 13)
  legajo.value = normalized
  storeEmulacion.$setlegajoSelected(normalized)
}

const onClear = () => {
  storeEmulacion.$clearAll()
}

const onSearch = async () => {
  onLegajoInput()
  await storeEmulacion.$fetchData()

  if (storeEmulacion.data.length) {
    storeEmulacion.$setActiveTab(1)
  }
}
</script>

<style scoped>
.emulacion-filter-grid {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.emulacion-legajo-field {
  grid-column: span 3;
  max-width: 245px;
}

.emulacion-legajo-control {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
}

.emulacion-legajo-input {
  width: 158px !important;
  min-width: 158px !important;
  max-width: 158px !important;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.emulacion-legajo-icon {
  width: 28px;
  height: 26px;
  min-width: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #9bc9d2;
  border-radius: 4px;
  background: #e0f7fa;
  color: #008fa1;
  font-size: 14px;
}

.emulacion-actions {
  margin-top: 14px !important;
}

@media (max-width: 760px) {
  .emulacion-legajo-field {
    grid-column: span 12;
    max-width: 100%;
  }
}
</style>
