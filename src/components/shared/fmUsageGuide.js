/* ========================================================================
   GUIA DE USO - COMPONENTES Y ESTILOS GLOBALES FIELD MANAGER
   ------------------------------------------------------------------------
   Este archivo es una guia comentada para pantallas nuevas.
   No ejecuta logica. No se importa en runtime.

   OBJETIVO:
   - Evitar copiar estilos de botones, filtros, grillas y modales en cada pantalla.
   - Mantener una base visual global.
   - Permitir que cada modulo tenga ajustes locales sin romper el resto.

   COMPONENTES GLOBALES REGISTRADOS EN main.js:
   - <FmButton />
   - <FmPanel />
   - <FmGridShell />
   - <FmAlertDialog />

   CSS GLOBAL:
   - src/assets/css/fm-design-system.css
   - src/assets/css/responsive.css
   - src/assets/css/responsive-resolutions.css

   PASS THROUGH GLOBAL PRIMEVUE:
   - src/components/shared/primePassThrough.js
   ======================================================================== */

/*
EJEMPLO DE FILTROS GLOBAL:

<template>
  <FmPanel title="FILTROS DE BUSQUEDA" accent>
    <div class="fm-filter-grid">
      <div class="fm-field fm-field--span-4">
        <label>Nro. OT</label>
        <InputText v-model="filters.nroOt" class="w-full" />
      </div>

      <div class="fm-field fm-field--span-2">
        <label>Estado</label>
        <Select v-model="filters.estado" :options="estados" optionLabel="name" class="w-full" />
      </div>
    </div>

    <div class="fm-actions">
      <FmButton label="BUSCAR" icon="pi-search" @click="buscar" />
      <FmButton label="LIMPIAR" icon="pi-align-left" variant="outline" @click="limpiar" />
    </div>
  </FmPanel>
</template>
*/

/*
EJEMPLO DE GRILLA GLOBAL:

<template>
  <FmGridShell title="RESULTADOS">
    <DataTable class="fm-pass-grid" :value="rows" scrollable resizableColumns columnResizeMode="expand">
      <Column field="nroOt" header="NRO. OT" sortable />
      <Column field="estado" header="ESTADO" sortable />
    </DataTable>
  </FmGridShell>
</template>
*/

/*
EJEMPLO DE ALERTA GLOBAL:

<template>
  <FmAlertDialog
    v-model:visible="showAlert"
    message="Debe seleccionar un motivo."
  />
</template>
*/

/*
REGLA PARA ESTILOS LOCALES:

Si una pantalla necesita algo propio, usar una clase del modulo:

.mi-modulo .fm-pass-grid { ... }

Nunca modificar fm-design-system.css para un caso especifico de una sola pantalla.
*/

export const fmUsageGuide = true
