# Field Manager — componentes y estilos globales reutilizables

Esta guía describe únicamente los recursos globales que pueden reutilizarse al crear o modificar pantallas de Field Manager.

La regla general es:

- usar componentes globales `Fm*`;
- usar PrimeVue con la configuración global existente;
- usar clases CSS `fm-*`;
- no copiar estilos comunes de una pantalla a otra;
- reservar `<style scoped>` para ajustes exclusivos del módulo.

Los componentes `Fm*`, varios componentes PrimeVue, PrimeIcons, `v-tooltip`, el tema, el PassThrough y los CSS globales ya se registran desde `src/main.js`.

---

## 1. Contenedor de una pantalla

Toda pantalla nueva debe comenzar con `fm-screen`.

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

`fm-screen--pad` agrega el espaciado general de la pantalla.

---

## 2. Panel global: FmPanel

Se usa para agrupar filtros, datos o secciones.

```vue
<FmPanel title="DATOS DE LA ORDEN" accent>
  <!-- contenido -->
</FmPanel>
```

Props principales:

```text
title    Título del panel.
accent   Agrega la línea turquesa lateral.
```

Con acciones en el encabezado:

```vue
<FmPanel title="RESULTADOS">
  <template #headerActions>
    <Button icon="pi pi-plus" text aria-label="Agregar" />
  </template>

  <!-- contenido -->
</FmPanel>
```

Clases equivalentes disponibles:

```text
fm-panel
fm-panel-header
fm-panel-content
fm-panel-content--accent
fm-card
fm-card__header
fm-card__body
fm-card__body--accent
fm-accent-left
```

---

## 3. Acordeones globales

Los acordeones PrimeVue reciben el estilo global Field Manager.

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

Componentes globales relacionados:

```text
Accordion
AccordionPanel
AccordionHeader
AccordionContent
```

Clase principal:

```text
fm-accordion
```

---

## 4. Filtros y formularios

La distribución global de filtros usa una grilla de 12 columnas.

```vue
<div class="fm-filters">
  <div class="fm-filter-grid">
    <div class="fm-field fm-field--span-4">
      <label>Nro. OT</label>
      <InputText v-model="filters.nroOt" />
    </div>

    <div class="fm-field fm-field--span-4">
      <label>Estado</label>
      <Select
        v-model="filters.estado"
        :options="estados"
        optionLabel="nombre"
        showClear
      />
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
fm-field__label
fm-input
fm-select
```

`InputText`, `Textarea` y `DatePicker` deben importarse localmente cuando se utilicen:

```vue
<script setup>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
</script>
```

Aunque se importen localmente, reciben el estilo global por PrimeVue PassThrough.

---

## 5. Botón global principal: FmButton

Es el botón recomendado para acciones comunes.

Botón primario:

```vue
<FmButton
  label="BUSCAR"
  icon="pi-search"
  @click="buscar"
/>
```

Botón secundario:

```vue
<FmButton
  label="LIMPIAR"
  icon="pi-align-left"
  variant="outline"
  @click="limpiar"
/>
```

Props principales:

```text
label          Texto.
icon           PrimeIcon.
variant        primary | outline.
disabled       Deshabilita el botón.
loading        Muestra spinner y cambia el texto.
loadingLabel   Texto durante loading; por defecto PROCESANDO...
```

Para bloquear el botón sin spinner ni cambio visual:

```vue
<FmButton
  label="BUSCAR"
  icon="pi-search"
  :disabled="loading"
  @click="buscar"
/>
```

---

## 6. Botón con SVG propio: FmActionButton

Se usa cuando se necesita uno de los íconos SVG propios del sistema.

```vue
<FmActionButton
  label="GUARDAR"
  icon="save"
  @click="guardar"
/>
```

Íconos disponibles:

```text
search
clean
add
save
cancel
```

Variantes:

```vue
<FmActionButton label="AGREGAR" icon="add" />
<FmActionButton label="CANCELAR" icon="cancel" variant="outline" />
```

---

## 7. Clases globales de botones

Cuando se usa directamente `Button` de PrimeVue:

```vue
<div class="fm-actions">
  <Button label="GUARDAR" class="fm-btn fm-btn--primary" />
  <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" />
</div>
```

Clases disponibles:

```text
fm-actions
fm-action-button
fm-action-button--primary
fm-action-button--outline
fm-btn
fm-btn--primary
fm-btn--outline
fm-icon-button
fm-icon-btn
```

Para código nuevo se recomienda usar `FmButton` antes que repetir las clases manualmente.

---

## 8. Contenedor global de grillas: FmGridShell

Toda grilla nueva debe estar dentro de `FmGridShell`.

```vue
<FmGridShell>
  <DataTable :value="rows" dataKey="id">
    <Column field="nroOt" header="Nro. OT" />
  </DataTable>
</FmGridShell>
```

Con loader global:

```vue
<FmGridShell
  :loading="loading"
  loading-title="Buscando"
  loading-message="Cargando resultados"
>
  <DataTable :value="rows" dataKey="id">
    <!-- columnas -->
  </DataTable>
</FmGridShell>
```

Props principales:

```text
title
loading
loadingTitle
loadingMessage
```

---

## 9. Grilla PrimeVue estándar

Configuración recomendada:

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

Clases globales disponibles:

```text
fm-grid-shell
fm-grid-title
fm-grid-actions
fm-pass-grid
fm-ui-grid
fm-column-filter
fm-filter-cell
fm-filter-prefix
fm-filter-more
fm-cell-text
fm-grid-empty
fm-selected-row
fm-enabled-row
fm-disabled-row
fm-link-cell
```

Texto de celda con corte y tooltip nativo:

```vue
<span class="fm-cell-text" :title="data.nombre">
  {{ data.nombre }}
</span>
```

Filtro de columna:

```vue
<Column field="nroOt" header="Nro. OT" sortable>
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
</Column>
```

Clases de filas:

```js
const rowClass = (row) => ({
  'fm-selected-row': selectedIds.includes(row.id),
  'fm-enabled-row': row.habilitada,
  'fm-disabled-row': !row.habilitada
})
```

```vue
<DataTable :value="rows" :rowClass="rowClass" />
```

---

## 10. Acciones globales de grilla: FmGridActions

Incluye los íconos estándar de Excel, eliminar y reprocesar.

```vue
<template #paginatorstart>
  <FmGridActions
    size="large"
    @export="exportarExcel"
    @delete="eliminarSeleccionados"
    @refresh="reprocesar"
  />
</template>
```

Mostrar sólo Excel:

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

Eventos:

```text
@export
@delete
@refresh
```

---

## 11. Exportación global a Excel

Composable reutilizable:

```text
src/composables/useExportExcel.js
```

Uso corto:

```vue
<script setup>
import { ref } from 'vue'
import { useExcelExport } from '@/composables/useExportExcel'

const dt = ref()
const { parseDataFromTable, exportToExcel } = useExcelExport()

const columns = [
  { field: 'nroOt', header: 'Nro. OT' },
  { field: 'estado', header: 'Estado' }
]

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

El composable también expone:

```text
parseDataFromTable
exportToExcel
groupBy
sortRows
```

---

## 12. Popup de alerta global: FmAlertDialog

Para alertas simples se debe usar este componente.

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

Contenido personalizado:

```vue
<FmAlertDialog v-model:visible="showAlert" title="Resultado">
  La operación finalizó correctamente.
</FmAlertDialog>
```

---

## 13. Popup estándar con Dialog

Para formularios, confirmaciones o contenido más complejo:

```vue
<Dialog
  v-model:visible="showDialog"
  modal
  header="Confirmación"
  class="fm-dialog"
  :style="{ width: '42rem' }"
>
  <div class="fm-dialog-body">
    ¿Confirma la operación?
  </div>

  <template #footer>
    <Button
      label="CANCELAR"
      outlined
      class="fm-btn fm-btn--outline"
      @click="showDialog = false"
    />

    <Button
      label="ACEPTAR"
      class="fm-btn fm-btn--primary"
      @click="confirmar"
    />
  </template>
</Dialog>
```

Clases disponibles:

```text
fm-dialog
fm-alert-dialog
fm-dialog-body
fm-popup-body
fm-note-body
fm-alert-body
fm-alert-triangle
```

---

## 14. Popup flotante o maximizable

Actualmente no existe un componente global llamado `FmFloatingWindow` o similar.

La ventana de Órdenes de Trabajo Externas se encuentra en:

```text
src/modules/busquedaOts/components/ExternalOtsDialog.vue
```

Esa implementación es específica del módulo `busquedaOts` y no debe llamarse directamente desde otras pantallas.

Cuando se necesite una segunda ventana flotante, primero se debe extraer la estructura común a un componente global, por ejemplo:

```text
src/components/shared/FmFloatingWindow.vue
```

Hasta que ese componente exista, los popups globales reutilizables son:

```text
FmAlertDialog
Dialog + clases fm-dialog
```

---

## 15. Loader global: FmTypingLoader

Pantalla completa:

```vue
<FmTypingLoader
  v-if="loading"
  fullscreen
  title="Cargando perfil"
  message="Preparando Field Manager"
/>
```

Dentro de un popup:

```vue
<FmTypingLoader
  v-if="loading"
  overlay
  variant="dialog"
  title="Procesando"
  message="Guardando cambios"
/>
```

Dentro de una grilla se recomienda usar el loader de `FmGridShell`:

```vue
<FmGridShell :loading="loading" loading-message="Cargando grilla">
  <DataTable :value="rows" />
</FmGridShell>
```

Props principales:

```text
title
message
variant: inline | grid | dialog
fullscreen
overlay
inline
showTitle
showMessage
```

No se debe construir otro loader manualmente.

---

## 16. Íconos globales

PrimeIcons ya está cargado globalmente.

En un botón PrimeVue:

```vue
<Button icon="pi pi-search" text aria-label="Buscar" />
```

En `FmButton`:

```vue
<FmButton label="BUSCAR" icon="pi-search" />
```

En HTML:

```html
<i class="pi pi-download" aria-hidden="true"></i>
```

Ejemplos frecuentes:

```text
pi pi-search
pi pi-download
pi pi-trash
pi pi-refresh
pi pi-plus
pi pi-times
pi pi-save
pi pi-window-maximize
pi pi-clone
```

Para íconos SVG propios usar `FmActionButton`.

---

## 17. Tooltips globales

La directiva `v-tooltip` está registrada globalmente.

```vue
<Button
  icon="pi pi-search"
  text
  v-tooltip.top="'Buscar'"
  aria-label="Buscar"
/>
```

Posiciones disponibles según PrimeVue:

```text
v-tooltip.top
v-tooltip.bottom
v-tooltip.left
v-tooltip.right
```

Siempre acompañar el tooltip con `aria-label`.

---

## 18. Componentes PrimeVue disponibles globalmente

Pueden utilizarse sin import local:

```text
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

Ejemplo:

```vue
<Select v-model="estado" :options="estados" />
<Button label="ACEPTAR" />
```

Los siguientes normalmente requieren import local:

```text
InputText
Textarea
DatePicker
```

---

## 19. PrimeVue PassThrough global

Archivo:

```text
src/components/shared/primePassThrough.js
```

Aplica automáticamente clases internas `fm-pt-*` a:

```text
Button
InputText
Textarea
Select
MultiSelect
Accordion
DataTable
Checkbox
Dialog
DatePicker
```

Por eso un componente PrimeVue nuevo ya recibe la base visual Field Manager.

Ejemplo:

```vue
<DataTable :value="rows" />
```

PrimeVue agrega internamente clases como:

```text
fm-pt-datatable
fm-pt-datatable-wrapper
fm-pt-datatable-table
fm-pt-paginator
```

Las clases `fm-pt-*` no deben escribirse manualmente en una pantalla.

---

## 20. CSS globales reutilizables

Estos archivos ya se importan desde `src/main.js`. No deben volver a importarse en cada pantalla.

Base visual:

```text
src/assets/css/base/fm-design-system.css
src/assets/css/base/fm-global-ui.css
src/assets/css/base/fm-foundation.css
src/assets/css/base/fm-registro-ui.css
```

Loader:

```text
src/assets/css/components/loaders/fm-loader.css
```

Diálogos y popups:

```text
src/assets/css/components/dialogs/fm-dialog-fixes.css
src/assets/css/components/dialogs/fm-dialog-responsive.css
src/assets/css/components/dialogs/fm-popup-overrides.css
src/assets/css/components/dialogs/fm-dialog-close.css
```

Acciones de grilla:

```text
src/assets/css/components/grids/fm-grid-actions.css
```

Responsive:

```text
src/assets/css/responsive/responsive.css
src/assets/css/responsive/responsive-resolutions.css
```

Compatibilidad con pantallas antiguas:

```text
src/assets/css/legacy/fm-legacy-bridge.css
```

Los CSS de `src/assets/css/modules/` son específicos de cada módulo y no deben reutilizarse directamente en otras pantallas.

---

## 21. Responsive global

El responsive ya se aplica automáticamente a:

```text
pantallas
menú
filtros
botones
grillas
paginadores
popups
loaders
```

Breakpoints generales:

```text
>= 1440 px   Monitores grandes y televisores.
<= 1200 px   Notebooks y pantallas medianas.
<= 900 px    Tablets horizontales y notebooks pequeñas.
<= 768 px    Tablets verticales y celulares grandes.
<= 480 px    Celulares pequeños.
```

Además existe soporte por resoluciones específicas para monitores, televisores, notebooks, MacBook, tablets Samsung, Samsung Galaxy e iPhone.

Para aprovecharlo, usar las clases globales y evitar anchos fijos innecesarios:

```vue
<div class="fm-screen fm-screen--pad">
  <div class="fm-filter-grid">
    <!-- filtros -->
  </div>

  <FmGridShell>
    <DataTable class="fm-pass-grid" scrollable>
      <!-- columnas -->
    </DataTable>
  </FmGridShell>
</div>
```

Las grillas grandes deben conservar scroll horizontal en lugar de comprimir todas las columnas.

---

## 22. Estructura mínima recomendada

```vue
<template>
  <div class="fm-screen fm-screen--pad">
    <FmPanel title="FILTROS" accent>
      <div class="fm-filter-grid">
        <div class="fm-field fm-field--span-4">
          <label>Nro. OT</label>
          <InputText v-model="filters.nroOt" />
        </div>
      </div>

      <div class="fm-actions">
        <FmButton
          label="BUSCAR"
          icon="pi-search"
          :disabled="loading"
          @click="buscar"
        />

        <FmButton
          label="LIMPIAR"
          icon="pi-align-left"
          variant="outline"
          @click="limpiar"
        />
      </div>
    </FmPanel>

    <FmGridShell
      :loading="loading"
      loading-message="Cargando resultados"
    >
      <DataTable
        ref="dt"
        class="fm-pass-grid"
        :value="rows"
        dataKey="id"
        paginator
        :rows="10"
        scrollable
        showGridlines
      >
        <template #paginatorstart>
          <FmGridActions
            :show-delete="false"
            :show-refresh="false"
            @export="exportarExcel"
          />
        </template>

        <template #empty>
          <div class="fm-grid-empty">No hay resultados</div>
        </template>

        <Column field="nroOt" header="Nro. OT" sortable />
      </DataTable>
    </FmGridShell>

    <FmAlertDialog
      v-model:visible="showAlert"
      title="Alerta"
      :message="alertMessage"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import InputText from 'primevue/inputtext'

const loading = ref(false)
const rows = ref([])
const showAlert = ref(false)
const alertMessage = ref('')

const filters = reactive({
  nroOt: ''
})

const buscar = async () => {}
const limpiar = () => {}
const exportarExcel = () => {}
</script>

<style scoped>
/* Sólo estilos exclusivos de esta pantalla. */
</style>
```

---

## 23. Regla final

Reutilizar:

```text
FmPanel
FmButton
FmActionButton
FmGridShell
FmGridActions
FmAlertDialog
FmTypingLoader
PrimeVue
PrimeIcons
v-tooltip
useExcelExport
clases fm-*
responsive global
```

No reutilizar directamente:

```text
CSS de otro módulo
componentes internos de otra pantalla
ExternalOtsDialog como supuesto componente global
clases fm-pt-* escritas manualmente
estilos globales duplicados dentro de scoped
```

Cuando una solución específica comience a necesitarse en varias pantallas, debe extraerse a `src/components/shared/` y registrarse como componente global.