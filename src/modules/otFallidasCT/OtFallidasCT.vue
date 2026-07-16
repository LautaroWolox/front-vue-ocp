<template>
  <div class="fm-screen fm-screen--pad ot-fallidas-ct">
    <Accordion v-model:value="active" multiple class="fm-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BUSQUEDA</AccordionHeader>
        <AccordionContent>
          <Filtros />
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>OTS FALLIDAS REPROCESO</AccordionHeader>
        <AccordionContent>
          <Table />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useFallidasCtStore } from './store/CtFallidaStore'
import Table from './components/Table.vue'
import Filtros from './components/Filtros.vue'

const store = useFallidasCtStore()
const active = ref(['0', '1'])

onMounted(async () => {
  store.rows = []
  store.selectedRows = []
  await store.setMotivos()
  await store.setData()
})
</script>

<style scoped>
.ot-fallidas-ct :deep(.fm-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.ot-fallidas-ct :deep(.p-accordionpanel + .p-accordionpanel) {
  margin-top: 4px !important;
}
</style>
