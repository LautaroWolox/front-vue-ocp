<template>
  <div class="fm-screen fm-screen--pad emulacion-page">
    <Accordion v-model:value="active" multiple class="fm-accordion emulacion-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BÚSQUEDA</AccordionHeader>
        <AccordionContent>
          <CajonFiltros />
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader>OPERADORES</AccordionHeader>
        <AccordionContent>
          <TablaEmulacion />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CajonFiltros from '../components/filtros/CajonFiltros.vue'
import TablaEmulacion from '../components/TablaEmulacion.vue'
import emulacionStore from '../store/emulacionStore.js'

const active = ref(['0'])
const store = emulacionStore()

watch(() => store.activeTab, (newVal) => {
  active.value = Array.isArray(newVal) ? newVal.map(String) : [String(newVal)]
})
</script>

<style scoped>
.emulacion-page :deep(.emulacion-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.emulacion-page :deep(.p-accordionpanel + .p-accordionpanel) {
  margin-top: 4px !important;
}
</style>
