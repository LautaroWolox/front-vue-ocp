<template>
  <div class="fm-field emulacion-legajo-field">
    <label class="emulacion-legajo-label" for="legajo-emulacion-legacy">LEGAJO</label>
    <div class="emulacion-legajo-control">
      <InputText
        id="legajo-emulacion-legacy"
        v-model="legajo"
        class="fm-input emulacion-legajo-input"
        type="text"
        maxlength="13"
        autocomplete="off"
        :disabled="disable"
        @input="capturarlegajo"
        @blur="capturarlegajo"
      />
      <span class="emulacion-legajo-icon" aria-hidden="true">
        <i class="pi pi-id-card"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import emulacionStore from '../../../store/emulacionStore.js'

const store = emulacionStore()
const legajo = ref(store.legajoSelected)
const disable = ref(false)

watch(() => store.legajoSelected, (newVal) => {
  legajo.value = newVal
})

watch(() => store.disableNroOt, (newVal) => {
  disable.value = Boolean(newVal)
})

const capturarlegajo = () => {
  const normalized = String(legajo.value || '').toUpperCase().slice(0, 13)
  legajo.value = normalized
  store.$setlegajoSelected(normalized)
}
</script>

<style scoped>
.emulacion-legajo-field {
  max-width: 245px;
}

.emulacion-legajo-label {
  display: block;
  margin-bottom: 6px;
  color: #111;
  font-size: 13px;
  font-weight: 700;
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
  height: 30px !important;
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
</style>
