<template>
  <div
    class="fm-field fm-field--span-3 otf-filter-element otf-filter-element--contratista"
    :class="{ 'otf-filter-element--disabled': fieldDisabled }"
  >
    <label for="otf-contratista">Contratista</label>
    <Select
      inputId="otf-contratista"
      v-model="contratistaSelected"
      :options="contratistaOptions"
      optionLabel="nombre"
      :loading="status.contratistas === 'loading'"
      :disabled="fieldDisabled"
      class="w-full"
      showClear
    />
    <span v-if="status.contratistas === 'error'" class="otf-filter-element__error">
      Error al cargar contratistas.
    </span>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Select from 'primevue/select'
import { useFallidasCtStore } from '../../store/CtFallidaStore'
import { useCommonCtStore } from '@/store/commonCt'
import './filter-element.css'

const props = defineProps({
  disabled: { type: Boolean, default: false }
})

const store = useFallidasCtStore()
const commonCT = useCommonCtStore()
const { contratistas, status } = storeToRefs(commonCT)

const fieldDisabled = computed(() => props.disabled || status.value.contratistas === 'loading')

const contratistaOptions = computed(() => [
  { empresaId: 0, codigo: '', nombre: '', tipo: 'Contratista', activo: 'S' },
  ...(contratistas.value ?? [])
])

const contratistaSelected = computed({
  get: () => contratistaOptions.value.find((item) => item.codigo === store.filters.contratista) ?? null,
  set: (value) => store.setFilter('contratista', value?.codigo ?? '')
})

onMounted(() => commonCT.setContratistas())
</script>
