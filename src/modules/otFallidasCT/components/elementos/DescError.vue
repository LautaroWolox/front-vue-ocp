<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--descripcion-error"
    :class="{ 'otf-filter-element--disabled': disabled }"
  >
    <label for="otf-descripcion-error">Descripción error</label>
    <InputText
      id="otf-descripcion-error"
      v-model="descripcionError"
      :disabled="disabled"
      class="w-full"
      type="text"
      autocomplete="off"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import { useFallidasCtStore } from '../../store/CtFallidaStore'
import './filter-element.css'

defineProps({
  disabled: { type: Boolean, default: false }
})

const store = useFallidasCtStore()

const descripcionError = computed({
  get: () => store.filters.descripcionError,
  set: (value) => store.setFilter('descripcionError', value ?? '')
})
</script>
