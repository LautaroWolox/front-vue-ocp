<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--nro-ot"
    :class="{ 'otf-filter-element--disabled': disabled }"
  >
    <label for="otf-nro-ot">Nro. OT</label>
    <InputText
      id="otf-nro-ot"
      v-model="nroOt"
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

const nroOt = computed({
  get: () => store.filters.nroOT,
  set: (value) => store.setFilter('nroOT', value ?? '')
})
</script>
