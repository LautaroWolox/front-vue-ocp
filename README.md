# Field Manager — recursos globales reutilizables

Esta guía enumera los componentes, clases e integraciones visuales que deben reutilizarse al crear o modificar una pantalla de Field Manager.

Reglas generales:

- usar componentes globales `Fm*`;
- usar PrimeVue con la configuración ya registrada en `src/main.js`;
- usar clases CSS `fm-*`;
- no copiar CSS común entre pantallas;
- reservar `<style scoped>` para ajustes exclusivos del módulo.

---

## Pantalla y responsive

Toda pantalla debe comenzar con:

```vue
<div class="fm-screen fm-screen--pad">
  <!-- contenido -->
</div>
```

Clases disponibles:

```text
fm-screen
fm-screen--pad
fm-module-page
fm-responsive-page
```

Los CSS responsive se cargan globalmente desde:

```text
src/assets/css/responsive/responsive.css
src/assets/css/responsive/responsive-resolutions.css
```

No deben importarse nuevamente desde cada pantalla.

---

## Panel: FmPanel

```vue
<FmPanel title="DATOS DE LA ORDEN" accent>
  <!-- contenido -->
</FmPanel>
```

Con acciones:

```vue
<FmPanel title="RESULTADOS">
  <template #headerActions>
    <Button icon="pi pi-plus" text aria-label="Agregar" />
  </template>

  <!-- contenido -->
</FmPanel>
```

Clases equivalentes:

```text
fm-panel
fm-panel-header
fm-panel-content
fm-panel-content--accent
fm-card
fm-card__header
fm-card__body
fm-accent-left
```

---

## Acordeones

```vue
<Accordion multiple class="fm-accordion">
  <AccordionPanel value="0">
    <AccordionHeader>FILTROS</AccordionHeader>
    <AccordionContent>
      <!-- contenido -->
    </AccordionContent>
  </AccordionPanel>
</Accordion>
```

Los componentes `Accordion`, `AccordionPanel`, `AccordionHeader` y `AccordionContent` están registrados globalmente.

---

## Filtros y formularios

La distribución estándar usa una grilla de 12 columnas:

```vue
<div class="fm-panel-content fm-panel-content--accent fm-filters">
  <div class="fm-filter-grid">
    <div class="fm-field fm-field--span-4">
      <label>Nro. OT</label>
      <InputText v-model="filters.nroOt" />
    </div>

    <div class="fm-field fm-field--span-4">
      <label>Estado</label>
      <Select v-model="filters.estado" :options="estados" />
    </div>
  </div>
</div>
```

Clases disponibles:

```text
fm-filters
fm-filter-grid
fm-field
fm-field--span-2
fm-field--span-3
fm-field--span-4
fm-field--span-6
fm-field--span-8
fm-field--span-12
fm-input
fm-select
```

`InputText`, `Textarea` y `DatePicker` se importan localmente cuando se utilizan.

---

## Botón principal: FmButton

Primario:

```vue
<FmButton label="BUSCAR" icon="pi-search" @click="buscar" />
```

Secundario:

```vue
<FmButton
  label="LIMPIAR"
  icon="pi-filter-slash"
  variant="outline"
  @click="limpiar"
/>
```

Con loader:

```vue
<FmButton
  label="GUARDAR"
  icon="pi-save"
  :loading="guardando"
  @click="guardar"
/>
```

Para bloquear sin cambiar el texto ni mostrar spinner:

```vue
<FmButton label="BUSCAR" icon="pi-search" :disabled="loading" />
```

Props principales:

```text
label
icon
variant: primary | outline
disabled
loading
loadingLabel
```

---

## Botón con SVG propio: FmActionButton

```vue
<FmActionButton label="GUARDAR" icon="save" @click="guardar" />
```

Íconos disponibles:

```text
search
clean
add
save
cancel
```

---

## Clases globales para Button de PrimeVue

```vue
<div class="fm-actions">
  <Button label="ACEPTAR" class="fm-btn fm-btn--primary" />
  <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" />
</div>
```

Clases disponibles:

```text
fm-actions
fm-btn
fm-btn--primary
fm-btn--outline
fm-icon-button
fm-icon-btn
```

---

## Contenedor de grilla: FmGridShell

Toda grilla debe estar dentro de `FmGridShell`:

```vue
<FmGridShell
  :loading="loading"
  loading-title="Buscando"
  loading-message="Cargando resultados"
>
  <DataTable :value="rows" dataKey="id">
    <Column field="nroOt" header="Nro. OT" />
  </DataTable>
</FmGridShell>
```

Props:

```text
title
loading
loadingTitle
loadingMessage
```

---

## DataTable estándar

```vue
<DataTable
  ref="dt"
  class="fm-pass-grid"
  :value="rows"
  dataKey="id"
  paginator
  :rows="10"
  :rowsPerPageOptions="[10, 50, 100, 500]"
  filterDisplay="row"
  scrollable
  scrollHeight="430px"
  resizableColumns
  columnResizeMode="expand"
  showGridlines
>
  <template #empty>
    <div class="fm-grid-empty">No hay resultados</div>
  </template>

  <Column field="nroOt" header="Nro. OT" sortable />
</DataTable>
```

Filtro de columna:

```vue
<template #filter="{ filterModel, filterCallback }">
  <div class="fm-filter-cell">
    <span class="fm-filter-prefix">~</span>
    <InputText
      v-model="filterModel.value"
      class="fm-column-filter"
      @input="filterCallback()"
    />
    <span class="fm-filter-more">...</span>
  </div>
</template>
```

Texto con recorte y tooltip nativo:

```vue
<span class="fm-cell-text" :title="String(data.nombre ?? '')">
  {{ data.nombre }}
</span>
```

Clases disponibles:

```text
fm-grid-shell
fm-grid-title
fm-grid-actions
fm-pass-grid
fm-filter-cell
fm-filter-prefix
fm-filter-more
fm-column-filter
fm-cell-text
fm-grid-empty
fm-selected-row
fm-enabled-row
fm-disabled-row
fm-link-cell
```

---

## Acciones de grilla: FmGridActions

Excel, eliminar y reprocesar:

```vue
<template #paginatorstart>
  <FmGridActions
    size="large"
    @export="exportarExcel"
    @delete="eliminar"
    @refresh="reprocesar"
  />
</template>
```

Sólo Excel:

```vue
<FmGridActions
  :show-delete="false"
  :show-refresh="false"
  @export="exportarExcel"
/>
```

Props:

```text
showExport
showDelete
showRefresh
size: compact | large
```

---

## Exportación a Excel

```vue
<script setup>
import { ref } from 'vue'
import { useExcelExport } from '@/composables/useExportExcel'

const dt = ref()
const { parseDataFromTable, exportToExcel } = useExcelExport()

const exportarExcel = () => {
  const { rows, fields } = parseDataFromTable(dt)

  exportToExcel({
    rows,
    fields,
    columns,
    filename: 'Ordenes.xlsx',
    columnTypes: {},
    groupField: null
  })
}
</script>
```

---

## Alerta global: FmAlertDialog

```vue
<FmAlertDialog
  v-model:visible="showAlert"
  title="Alerta"
  message="No hay datos para la consulta efectuada"
/>
```

Props principales:

```text
title
message
closeLabel
width
type
```

---

## Popup estándar

```vue
<Dialog
  v-model:visible="showDialog"
  modal
  header="Confirmación"
  class="fm-dialog"
  :style="{ width: '520px' }"
>
  <div class="fm-dialog-body">
    <!-- contenido -->
  </div>

  <template #footer>
    <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" />
    <Button label="ACEPTAR" class="fm-btn fm-btn--primary" />
  </template>
</Dialog>
```

Clases disponibles:

```text
fm-dialog
fm-dialog-body
fm-popup-body
fm-alert-body
fm-alert-triangle
fm-note-body
```

---

## Popup flotante

La ventana flotante de Órdenes de Trabajo Externas está implementada en:

```text
src/modules/busquedaOts/components/ExternalOtsDialog.vue
```

Incluye:

- encabezado arrastrable;
- maximizar/restaurar;
- cerrar;
- grilla responsive;
- paginado;
- Excel.

Actualmente es específica de Búsqueda de OTs. Para reutilizarla en más módulos debe extraerse previamente como `FmFloatingWindow`.

---

## Loader global: FmTypingLoader

Pantalla completa:

```vue
<FmTypingLoader
  fullscreen
  title="Cargando"
  message="Cargando pantalla"
/>
```

Sobre un popup:

```vue
<FmTypingLoader
  v-if="loading"
  overlay
  variant="dialog"
  title="Procesando"
  message="Guardando cambios"
/>
```

Sobre una grilla se recomienda usar directamente las props `loading` de `FmGridShell`.

---

## Íconos y tooltips

PrimeIcons:

```vue
<i class="pi pi-search"></i>
<i class="pi pi-trash"></i>
<i class="pi pi-download"></i>
```

Tooltip global:

```vue
<Button
  icon="pi pi-search"
  text
  v-tooltip.top="'Buscar'"
  aria-label="Buscar"
/>
```

`primeicons.css` y la directiva `v-tooltip` ya se registran desde `src/main.js`.

---

## Componentes registrados globalmente

No requieren import local:

```text
FmButton
FmPanel
FmGridShell
FmAlertDialog
FmActionButton
FmGridActions
FmTypingLoader

Accordion
AccordionPanel
AccordionHeader
AccordionContent
DataTable
Column
Button
CheckBox
Select
MultiSelect
ProgressSpinner
Dialog
```

---

## CSS globales

Se cargan una sola vez desde `src/main.js`:

```text
src/assets/css/legacy/fm-legacy-bridge.css
src/assets/css/base/fm-design-system.css
src/assets/css/base/fm-global-ui.css
src/assets/css/base/fm-foundation.css
src/assets/css/base/fm-registro-ui.css
src/assets/css/responsive/responsive.css
src/assets/css/responsive/responsive-resolutions.css
src/assets/css/components/loaders/fm-loader.css
src/assets/css/components/dialogs/*.css
src/assets/css/components/grids/fm-grid-actions.css
src/assets/css/components/menus/fm-menubar-submenus.css
```

No volver a importar `nuestros.css` ni `theme.css`: pertenecen a la capa legacy y pisan el diseño actual.

---

## Plantilla mínima de una pantalla nueva

```vue
<template>
  <div class="fm-screen fm-screen--pad">
    <Accordion multiple class="fm-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS</AccordionHeader>
        <AccordionContent>
          <div class="fm-panel-content fm-panel-content--accent fm-filters">
            <div class="fm-filter-grid">
              <div class="fm-field fm-field--span-4">
                <label>Nro. OT</label>
                <InputText v-model="filters.nroOt" />
              </div>
            </div>

            <div class="fm-actions">
              <FmButton label="BUSCAR" icon="pi-search" @click="buscar" />
              <FmButton label="LIMPIAR" icon="pi-filter-slash" variant="outline" @click="limpiar" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader>RESULTADOS</AccordionHeader>
        <AccordionContent>
          <FmGridShell :loading="loading">
            <DataTable class="fm-pass-grid" :value="rows" paginator :rows="10">
              <template #empty>
                <div class="fm-grid-empty">No hay resultados</div>
              </template>

              <Column field="nroOt" header="Nro. OT" sortable />
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
```

No sobrescribir globalmente `.p-button`, `.p-datatable`, `.p-dialog` o `.p-menubar` desde una pantalla. Si un estilo es exclusivo del módulo, usar una clase con prefijo propio dentro de `<style scoped>`.
