# Field Manager Frontend

Frontend de **Field Manager** desarrollado con Vue 3, Vite y PrimeVue.

El proyecto incluye una capa visual global para que las pantallas compartan el mismo diseño de:

- filtros y formularios;
- botones principales y secundarios;
- grillas, paginadores y acciones;
- acordeones y paneles;
- diálogos, alertas y ventanas;
- loaders;
- adaptación responsive para distintas resoluciones.

> Las pantallas nuevas deben reutilizar los componentes `Fm*`, PrimeVue y las clases globales `fm-*`. No se debe copiar CSS común de una pantalla a otra.

---

## Contenido

1. [Tecnologías](#tecnologías)
2. [Requisitos](#requisitos)
3. [Instalación y ejecución local](#instalación-y-ejecución-local)
4. [Variables de entorno](#variables-de-entorno)
5. [Comandos disponibles](#comandos-disponibles)
6. [Configuración general](#configuración-general)
7. [Sistema visual global](#sistema-visual-global)
8. [Componentes globales propios](#componentes-globales-propios)
9. [Componentes PrimeVue globales](#componentes-primevue-globales)
10. [PrimeVue PassThrough](#primevue-passthrough)
11. [Clases CSS globales](#clases-css-globales)
12. [Grillas](#grillas)
13. [Diálogos y alertas](#diálogos-y-alertas)
14. [Loaders](#loaders)
15. [Responsive y resoluciones](#responsive-y-resoluciones)
16. [Plantilla de una pantalla nueva](#plantilla-de-una-pantalla-nueva)
17. [Reglas de desarrollo](#reglas-de-desarrollo)
18. [Checklist de una pantalla nueva](#checklist-de-una-pantalla-nueva)

---

## Tecnologías

- Vue 3.
- Vite 6.
- Vue Router.
- Pinia.
- PrimeVue 4.
- PrimeIcons.
- PrimeFlex.
- TypeScript disponible para archivos tipados.
- Axios.
- ExcelJS.
- Vitest.
- Cypress.
- ESLint.
- Prettier.

---

## Requisitos

El proyecto declara la siguiente versión de Node.js:

```text
Node.js 24.14.0
```

También se necesita npm.

Comprobar las versiones instaladas:

```bash
node --version
npm --version
```

---

## Instalación y ejecución local

Clonar el repositorio e instalar dependencias:

```bash
git clone <URL_DEL_REPOSITORIO>
cd front-vue-ocp
npm ci
```

Levantar el entorno local:

```bash
npm run dev
```

La aplicación utiliza como base:

```text
/UI/
```

La URL local habitual es:

```text
http://localhost:5173/UI/
```

Cuando se actualiza una rama y existen cambios en dependencias:

```bash
git fetch origin
git switch main
git pull origin main
npm ci
npm run dev
```

Después de actualizar estilos globales se recomienda hacer una recarga completa del navegador:

```text
Ctrl + F5
```

---

## Variables de entorno

Vite carga únicamente variables cuyo nombre comienza con `VITE_`.

La configuración actual utiliza al menos:

```env
VITE_ORIGIN=
VITE_ALLOWED_HOSTS=
```

### VITE_ORIGIN

Origen utilizado por el proxy local para las peticiones legacy bajo:

```text
/pc/
```

Ejemplo de flujo local:

```text
Frontend: http://localhost:5173/UI/
Proxy:    /pc/*
Backend:  VITE_ORIGIN
```

### VITE_ALLOWED_HOSTS

Host permitido por el servidor de desarrollo de Vite.

> No subir credenciales, tokens ni secretos reales al repositorio.

---

## Comandos disponibles

### Desarrollo

```bash
npm run dev
```

### Compilación estándar

```bash
npm run build
```

### Compilaciones por ambiente

```bash
npm run desa1
npm run desa2
npm run inte
npm run uat
npm run nginx
```

### Vista previa de la compilación

```bash
npm run preview
```

### Pruebas unitarias

```bash
npm run test:unit
```

### Pruebas end-to-end

```bash
npm run test:e2e
```

Modo interactivo de Cypress:

```bash
npm run test:e2e:dev
```

### Verificación de tipos

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

### Formato

```bash
npm run format
```

---

## Configuración general

La entrada principal del proyecto es:

```text
src/main.js
```

Desde ese archivo se realiza lo siguiente:

- se crea la aplicación Vue;
- se instala Pinia;
- se instala Vue Router;
- se instala PrimeVue;
- se configura el tema Lara;
- se define el color primario turquesa de Field Manager;
- se instala el PassThrough global;
- se registran los componentes globales;
- se registra `v-tooltip`;
- se importan los CSS globales y los ajustes responsive.

La configuración de Vite se encuentra en:

```text
vite.config.ts
```

Configuraciones relevantes:

```text
Base pública: /UI/
Alias:        @ -> src
Proxy:        /pc/ -> VITE_ORIGIN
```

---

# Sistema visual global

## Objetivo

La aplicación posee una capa de diseño global para evitar que cada pantalla defina su propia versión de botones, grillas, popups o filtros.

Una pantalla nueva debe priorizar:

```text
FmPanel
FmButton
FmGridShell
FmGridActions
FmAlertDialog
FmTypingLoader
PrimeVue + PassThrough
Clases fm-*
```

## Convención de nombres

### Clases `fm-*`

Son las clases recomendadas para escribir directamente en una pantalla nueva.

Ejemplos:

```text
fm-screen
fm-panel
fm-filter-grid
fm-field
fm-actions
fm-btn
fm-grid-shell
fm-pass-grid
fm-dialog
```

### Clases `fm-ui-*`

Son aliases y clases de compatibilidad de la capa visual global.

No es necesario preferirlas en código nuevo cuando existe una clase equivalente `fm-*`.

### Clases `fm-pt-*`

Son clases aplicadas internamente por PrimeVue PassThrough.

Normalmente no deben escribirse manualmente.

Ejemplos internos:

```text
fm-pt-button
fm-pt-inputtext
fm-pt-select
fm-pt-datatable
fm-pt-dialog
fm-pt-paginator
```

---

## CSS globales reutilizables

Estos archivos ya se importan desde `src/main.js` y no deben importarse nuevamente en cada pantalla.

### Base visual

```text
src/assets/css/base/fm-design-system.css
src/assets/css/base/fm-global-ui.css
src/assets/css/base/fm-foundation.css
src/assets/css/base/fm-registro-ui.css
```

Responsabilidad general:

- `fm-design-system.css`: variables, colores, filtros, paneles, botones y grillas compartidas.
- `fm-global-ui.css`: aliases `fm-ui-*` y compatibilidad visual.
- `fm-foundation.css`: capa principal para pantallas nuevas.
- `fm-registro-ui.css`: estilo aprobado de Registro OTs para grillas, paginadores, botones, checkbox y filas seleccionadas.

### Loader

```text
src/assets/css/components/loaders/fm-loader.css
```

### Diálogos y popups

```text
src/assets/css/components/dialogs/fm-dialog-fixes.css
src/assets/css/components/dialogs/fm-dialog-responsive.css
src/assets/css/components/dialogs/fm-popup-overrides.css
src/assets/css/components/dialogs/fm-dialog-close.css
```

### Acciones de grilla

```text
src/assets/css/components/grids/fm-grid-actions.css
```

### Responsive

```text
src/assets/css/responsive/responsive.css
src/assets/css/responsive/responsive-resolutions.css
```

### Compatibilidad legacy

```text
src/assets/css/legacy/fm-legacy-bridge.css
```

Este archivo se utiliza únicamente para compatibilidad con pantallas antiguas.

No debe tomarse como base para una pantalla nueva.

### CSS específicos de módulos

Los archivos dentro de:

```text
src/assets/css/modules/
```

pertenecen a pantallas o módulos concretos, por ejemplo:

```text
modules/login/
modules/ot-fallidas/
modules/parametrizaciones/
modules/reporteSas/
```

No deben reutilizarse directamente en una pantalla nueva.

Cuando un estilo de un módulo pasa a ser necesario en varias pantallas, debe generalizarse en una clase global `fm-*`.

---

# Componentes globales propios

Los siguientes componentes están registrados globalmente en `src/main.js`.

No es necesario importarlos dentro de cada archivo `.vue`.

---

## FmButton

Botón principal reutilizable basado en PrimeVue.

### Uso básico

```vue
<FmButton
  label="BUSCAR"
  icon="pi-search"
  @click="buscar"
/>
```

### Botón secundario

```vue
<FmButton
  label="LIMPIAR"
  icon="pi-align-left"
  variant="outline"
  @click="limpiar"
/>
```

### Props

```text
label          String   Texto del botón.
loadingLabel   String   Texto durante la carga. Valor inicial: PROCESANDO...
icon           String   PrimeIcon. Ejemplo: pi-search.
variant        String   primary | outline.
type           String   Tipo HTML. Valor inicial: button.
disabled       Boolean  Deshabilita el botón.
loading        Boolean  Muestra spinner, bloquea y cambia el texto.
```

### Evento

```text
@click
```

### Bloquear sin mostrar spinner

Cuando no se desea que el botón cambie visualmente durante la consulta, usar `disabled` en lugar de `loading`:

```vue
<FmButton
  label="BUSCAR"
  icon="pi-search"
  :disabled="loading"
  @click="buscar"
/>
```

---

## FmActionButton

Botón con íconos SVG propios de Field Manager.

```vue
<FmActionButton
  label="BUSCAR"
  icon="search"
  @click="buscar"
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

Props:

```text
label       String
variant     primary | outline
icon        search | clean | add | save | cancel
type        String
disabled    Boolean
```

Para código nuevo se recomienda generalmente `FmButton`, salvo que se necesite uno de los SVG propios de `FmActionButton`.

---

## FmPanel

Panel o tarjeta reutilizable.

### Uso básico

```vue
<FmPanel title="DATOS DE LA ORDEN">
  Contenido del panel
</FmPanel>
```

### Con línea turquesa

```vue
<FmPanel title="DATOS DE LA ORDEN" accent>
  Contenido del panel
</FmPanel>
```

Props:

```text
title     String
accent    Boolean
```

Slots:

```text
header
headerActions
default
```

Ejemplo con acciones:

```vue
<FmPanel title="RESULTADOS">
  <template #headerActions>
    <Button
      icon="pi pi-plus"
      text
      aria-label="Agregar"
    />
  </template>

  Contenido
</FmPanel>
```

---

## FmGridShell

Contenedor estándar para grillas.

Incluye:

- estructura visual Field Manager;
- título opcional;
- slot de acciones;
- línea turquesa;
- loader automático sobre la grilla.

### Uso básico

```vue
<FmGridShell>
  <DataTable :value="rows" dataKey="id">
    <Column field="nroOt" header="Nro. OT" />
  </DataTable>
</FmGridShell>
```

### Con loader

```vue
<FmGridShell
  :loading="loading"
  loading-title="Buscando órdenes"
  loading-message="Consultando información"
>
  <DataTable :value="rows">
    ...
  </DataTable>
</FmGridShell>
```

Props:

```text
title            String
loading          Boolean
loadingTitle     String   Valor inicial: Cargando
loadingMessage   String   Valor inicial: Cargando grilla
```

Slots:

```text
title
actions
default
```

---

## FmGridActions

Barra estándar de acciones de una grilla.

Acciones incluidas:

- exportar a Excel;
- eliminar seleccionados;
- reprocesar o actualizar.

### Uso recomendado

```vue
<DataTable :value="rows" paginator :rows="10">
  <template #paginatorstart>
    <FmGridActions
      @export="exportarExcel"
      @delete="eliminarSeleccionados"
      @refresh="reprocesar"
    />
  </template>
</DataTable>
```

Props:

```text
showExport    Boolean   Valor inicial: true
showDelete    Boolean   Valor inicial: true
showRefresh   Boolean   Valor inicial: true
size          String    compact | large
```

Eventos:

```text
@export
@delete
@refresh
```

Mostrar únicamente Excel:

```vue
<FmGridActions
  :show-delete="false"
  :show-refresh="false"
  @export="exportarExcel"
/>
```

Usar íconos grandes:

```vue
<FmGridActions
  size="large"
  @export="exportarExcel"
  @delete="eliminar"
  @refresh="actualizar"
/>
```

---

## FmAlertDialog

Popup global para alertas simples.

```vue
<FmAlertDialog
  v-model:visible="showAlert"
  title="Alerta"
  message="No hay datos para la consulta efectuada"
/>
```

Props:

```text
visible       Boolean
title         String   Valor inicial: Alerta
message       String
closeLabel    String   Valor inicial: CERRAR
width         String   Valor inicial: 42rem
type          String   Valor inicial: warning
```

El triángulo de advertencia se muestra cuando:

```text
type="warning"
```

Contenido personalizado:

```vue
<FmAlertDialog
  v-model:visible="showAlert"
  title="Resultado"
>
  <strong>La operación finalizó correctamente.</strong>
</FmAlertDialog>
```

---

## FmTypingLoader

Loader global con la animación de Field Manager.

### Pantalla completa

```vue
<FmTypingLoader
  v-if="loading"
  fullscreen
  title="Cargando perfil"
  message="Preparando Field Manager"
/>
```

### Dentro de un popup

```vue
<Dialog
  v-model:visible="showPopup"
  modal
  header="Procesando"
  class="fm-dialog"
>
  <div class="fm-dialog-body">
    Contenido
  </div>

  <FmTypingLoader
    v-if="loading"
    overlay
    variant="dialog"
    title="Procesando"
    message="Guardando cambios"
  />
</Dialog>
```

### Dentro de una grilla

Se recomienda usar el loader integrado de `FmGridShell`:

```vue
<FmGridShell
  :loading="loading"
  loading-title="Buscando"
  loading-message="Cargando resultados"
>
  <DataTable :value="rows">
    ...
  </DataTable>
</FmGridShell>
```

Props:

```text
title         String
message       String
variant       inline | grid | dialog
fullscreen    Boolean
overlay       Boolean
inline        Boolean
showTitle     Boolean
showMessage   Boolean
```

---

# Componentes PrimeVue globales

Los siguientes componentes PrimeVue están registrados globalmente:

```vue
<Accordion />
<AccordionPanel />
<AccordionHeader />
<AccordionContent />

<DataTable />
<Column />

<Button />
<CheckBox />
<Select />
<MultiSelect />
<ProgressSpinner />
<Dialog />
```

También está registrada la directiva:

```vue
v-tooltip
```

Ejemplo:

```vue
<Button
  icon="pi pi-search"
  text
  v-tooltip.top="'Buscar'"
/>
```

## Componentes que deben importarse localmente

Entre otros:

```text
InputText
Textarea
DatePicker
```

Ejemplo:

```vue
<script setup>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
</script>
```

Aunque se importen localmente, reciben el PassThrough y los estilos globales de PrimeVue.

---

# PrimeVue PassThrough

Archivo:

```text
src/components/shared/primePassThrough.js
```

PassThrough agrega automáticamente clases Field Manager a las partes internas de PrimeVue.

Actualmente está configurado para:

```text
Button
InputText
Textarea
Select
MultiSelect
Accordion
AccordionPanel
AccordionHeader
AccordionContent
DataTable
Checkbox
Dialog
DatePicker
```

Ejemplo:

```vue
<DataTable :value="rows">
```

PrimeVue recibe internamente clases como:

```text
fm-pt-datatable
fm-pass-grid
fm-pt-datatable-wrapper
fm-pt-datatable-table
fm-pt-paginator
```

No es necesario escribir manualmente todas las clases internas.

Para dejar explícito que una tabla utiliza la apariencia Field Manager también se puede usar:

```vue
<DataTable class="fm-pass-grid" :value="rows">
```

---

# Clases CSS globales

## Pantallas y contenedores

```text
fm-screen
fm-screen--pad
fm-module-page
fm-responsive-page
fm-section
fm-card
fm-panel
```

Uso recomendado:

```vue
<div class="fm-screen fm-screen--pad">
  ...
</div>
```

---

## Paneles

```text
fm-card__header
fm-card__body
fm-card__body--accent

fm-panel-header
fm-panel-content
fm-panel-content--accent

fm-accent-left
```

Ejemplo sin componente:

```vue
<section class="fm-panel">
  <header class="fm-panel-header">
    DATOS DE LA ORDEN
  </header>

  <div class="fm-panel-content fm-panel-content--accent">
    ...
  </div>
</section>
```

Cuando sea posible, preferir `<FmPanel />`.

---

## Acordeones

```text
fm-accordion
```

Ejemplo:

```vue
<Accordion multiple class="fm-accordion">
  <AccordionPanel value="0">
    <AccordionHeader>FILTROS</AccordionHeader>

    <AccordionContent>
      ...
    </AccordionContent>
  </AccordionPanel>
</Accordion>
```

---

## Formularios y filtros

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

La grilla de filtros utiliza 12 columnas.

Ejemplo:

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

    <div class="fm-field fm-field--span-4">
      <label>Técnico</label>
      <InputText v-model="filters.tecnico" />
    </div>
  </div>
</div>
```

---

## Botones

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

Ejemplo con PrimeVue:

```vue
<div class="fm-actions">
  <Button
    label="GUARDAR"
    class="fm-btn fm-btn--primary"
  />

  <Button
    label="CANCELAR"
    outlined
    class="fm-btn fm-btn--outline"
  />
</div>
```

Para botones de pantalla se recomienda `<FmButton />` en lugar de repetir clases manualmente.

---

# Grillas

## Clases principales

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

## Configuración recomendada

```vue
<FmGridShell
  :loading="loading"
  loading-message="Cargando resultados"
>
  <DataTable
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
    <template #paginatorstart>
      <FmGridActions
        size="large"
        @export="exportarExcel"
        @delete="eliminar"
        @refresh="actualizar"
      />
    </template>

    <template #empty>
      <div class="fm-grid-empty">
        No hay resultados
      </div>
    </template>

    <Column
      field="nroOt"
      header="Nro de OT"
      sortable
    >
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

      <template #body="{ data }">
        <span
          class="fm-cell-text"
          :title="String(data.nroOt ?? '')"
        >
          {{ data.nroOt ?? '' }}
        </span>
      </template>
    </Column>
  </DataTable>
</FmGridShell>
```

## Filas seleccionadas, habilitadas y deshabilitadas

```js
const rowClass = (row) => ({
  'fm-selected-row': selectedIds.value.includes(row.id),
  'fm-enabled-row': row.habilitada,
  'fm-disabled-row': !row.habilitada
})
```

```vue
<DataTable
  :value="rows"
  :rowClass="rowClass"
>
```

## Reglas de grillas

- Usar `FmGridShell` como contenedor.
- Usar PrimeVue `DataTable`.
- Usar `dataKey` cuando exista un identificador único.
- Usar `FmGridActions` para Excel, eliminar y actualizar.
- Mantener paginación.
- Mantener scroll horizontal para grillas con muchas columnas.
- No comprimir columnas hasta volverlas ilegibles.
- Usar `fm-cell-text` para truncado con puntos suspensivos.
- Agregar `title` cuando el contenido pueda quedar truncado.
- Usar `fm-grid-empty` para el estado sin resultados.

---

# Diálogos y alertas

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

## Diálogo estándar

```vue
<Dialog
  v-model:visible="showDialog"
  modal
  header="Confirmación"
  class="fm-dialog"
  :style="{ width: '42rem' }"
>
  <div class="fm-dialog-body">
    <p>¿Confirma la operación?</p>
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

## Alerta simple

```vue
<FmAlertDialog
  v-model:visible="showAlert"
  title="Alerta"
  :message="alertMessage"
/>
```

## Regla para ventanas especiales

Una ventana flotante, redimensionable o maximizable que tenga un comportamiento exclusivo debe implementarse como componente propio del módulo.

Los botones, colores, grillas y footer de esa ventana deben seguir usando la base global.

---

# Loaders

Las clases internas del loader existen globalmente:

```text
fm-typing-loader
fm-typing-loader--fullscreen
fm-typing-loader--overlay
fm-typing-loader--inline
fm-typing-loader--grid
fm-typing-loader--dialog
```

No se recomienda crear manualmente la estructura del loader.

Usar siempre:

```vue
<FmTypingLoader />
```

o el loader integrado de:

```vue
<FmGridShell :loading="loading" />
```

---

# Responsive y resoluciones

El soporte responsive se carga globalmente desde:

```text
src/assets/css/responsive/responsive.css
src/assets/css/responsive/responsive-resolutions.css
```

## Breakpoints generales

```text
>= 1440 px  Monitores grandes, escritorios amplios y televisores.
<= 1200 px  Notebooks y pantallas medianas.
<= 900 px   Tablets horizontales y notebooks pequeñas.
<= 768 px   Tablets verticales y celulares grandes.
<= 480 px   Celulares pequeños.
```

## Resoluciones específicas contempladas

La segunda capa complementa los breakpoints con casos para:

- monitores 4K, QHD y Full HD;
- monitores ultrawide y super ultrawide;
- televisores 8K, 4K, Full HD y HD;
- notebooks y netbooks;
- MacBook y MacBook Pro;
- tablets Samsung;
- Samsung Galaxy S20 a S25;
- iPhone 11 a iPhone 18.

## Comportamiento esperado

- El menú conserva el ancho disponible.
- Los formularios cambian la cantidad de columnas según el viewport.
- Los botones se reorganizan en pantallas pequeñas.
- Los diálogos limitan su ancho y alto.
- Los paginadores permiten reacomodar sus elementos.
- Las grillas grandes usan scroll horizontal controlado.
- Las columnas no deben aplastarse hasta ser ilegibles.

## Importante sobre móviles y tablets

Los fabricantes suelen publicar resoluciones físicas.

El navegador trabaja con viewport CSS y densidad DPR, por lo que la cobertura se realiza combinando:

- ancho;
- alto;
- orientación;
- densidad/resolución.

La existencia de reglas responsive no reemplaza la validación visual en los dispositivos o resoluciones objetivo.

## Reglas para conservar el responsive

Usar:

```text
fm-screen
fm-screen--pad
fm-filter-grid
fm-field--span-*
fm-actions
fm-pass-grid
fm-dialog
```

Evitar anchos rígidos innecesarios como:

```css
width: 1920px;
min-width: 1500px;
```

Para grillas con muchas columnas, usar scroll horizontal en lugar de reducir todo el contenido.

---

# Plantilla de una pantalla nueva

La siguiente plantilla combina filtros, acciones, grilla, loader y alerta.

```vue
<template>
  <div class="fm-screen fm-screen--pad">
    <Accordion multiple class="fm-accordion">
      <AccordionPanel value="filtros">
        <AccordionHeader>
          FILTROS
        </AccordionHeader>

        <AccordionContent>
          <div class="fm-panel-content fm-panel-content--accent fm-filters">
            <div class="fm-filter-grid">
              <div class="fm-field fm-field--span-4">
                <label>Nro. OT</label>

                <InputText
                  v-model="filters.nroOt"
                  placeholder="Ingrese una OT"
                />
              </div>

              <div class="fm-field fm-field--span-4">
                <label>Estado</label>

                <Select
                  v-model="filters.estado"
                  :options="estados"
                  optionLabel="nombre"
                  placeholder="Seleccione"
                  showClear
                />
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
                :disabled="loading"
                @click="limpiar"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="resultados">
        <AccordionHeader>
          RESULTADOS
        </AccordionHeader>

        <AccordionContent>
          <FmGridShell
            :loading="loading"
            loading-title="Buscando"
            loading-message="Cargando resultados"
          >
            <DataTable
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
              <template #paginatorstart>
                <FmGridActions
                  size="large"
                  :show-delete="false"
                  :show-refresh="false"
                  @export="exportarExcel"
                />
              </template>

              <template #empty>
                <div class="fm-grid-empty">
                  No hay resultados
                </div>
              </template>

              <Column
                field="nroOt"
                header="Nro. OT"
                sortable
              />

              <Column
                field="estado"
                header="Estado"
                sortable
              />

              <Column
                field="tecnico"
                header="Técnico"
                sortable
              />
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

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
const estados = ref([])
const showAlert = ref(false)
const alertMessage = ref('')

const filters = reactive({
  nroOt: '',
  estado: null
})

const buscar = async () => {
  if (loading.value) return

  loading.value = true

  try {
    // Consultar el backend y actualizar rows.value.
  } catch (error) {
    alertMessage.value = 'No se pudo realizar la búsqueda.'
    showAlert.value = true
  } finally {
    loading.value = false
  }
}

const limpiar = () => {
  filters.nroOt = ''
  filters.estado = null
  rows.value = []
}

const exportarExcel = () => {
  // Implementar exportación o reutilizar el composable disponible.
}
</script>

<style scoped>
/*
  Agregar únicamente estilos exclusivos de esta pantalla.

  No repetir estilos de:
  - botones;
  - grillas;
  - filtros;
  - diálogos;
  - paginadores;
  - loaders.
*/
</style>
```

---

# Reglas de desarrollo

## Usar

- `FmPanel` para paneles compartidos.
- `FmButton` para botones principales y secundarios.
- `FmGridShell` como contenedor de grillas.
- `DataTable` y `Column` de PrimeVue.
- `FmGridActions` para acciones estándar de grilla.
- `FmAlertDialog` para alertas simples.
- `FmTypingLoader` para cargas.
- Clases `fm-*` para estructura y apariencia global.
- Una clase con prefijo propio para ajustes exclusivos del módulo.

Ejemplo de clase específica correcta:

```css
.busqueda-ots-externas__resumen {
  ...
}
```

## Evitar

- Copiar CSS de otra pantalla.
- Crear un diseño distinto para un botón ya existente.
- Crear otra estructura visual de grilla.
- Reimportar CSS que ya carga `main.js`.
- Usar CSS específico de otro módulo.
- Modificar `.p-button`, `.p-datatable` o `.p-dialog` globalmente desde un componente.
- Usar anchos fijos que rompan el responsive.
- Crear loaders manuales.
- Duplicar popups de alerta simples.

## CSS scoped

Utilizar `scoped` únicamente para comportamientos exclusivos de la pantalla.

No utilizarlo para repetir estilos globales de:

```text
botones
grillas
filtros
inputs
selects
paginadores
dialogs
loaders
```

Cuando un estilo deja de ser exclusivo y comienza a utilizarse en varias pantallas, debe trasladarse a la capa global.

---

# Checklist de una pantalla nueva

Antes de dar una pantalla por terminada, comprobar:

- [ ] La raíz usa `fm-screen`.
- [ ] Los filtros usan `fm-filter-grid` y `fm-field--span-*`.
- [ ] Los botones usan `FmButton` o clases globales.
- [ ] La grilla está dentro de `FmGridShell`.
- [ ] La tabla usa PrimeVue `DataTable`.
- [ ] Existe `dataKey` cuando hay identificador único.
- [ ] La grilla tiene estado `No hay resultados`.
- [ ] La grilla conserva scroll horizontal si tiene muchas columnas.
- [ ] El paginador mantiene acciones y contador legibles.
- [ ] Las acciones estándar usan `FmGridActions`.
- [ ] Las cargas usan `FmTypingLoader` o el loader de `FmGridShell`.
- [ ] Las alertas simples usan `FmAlertDialog`.
- [ ] Los diálogos usan botones y footer globales.
- [ ] No se duplicó CSS global en `<style scoped>`.
- [ ] Se probó en una resolución de escritorio.
- [ ] Se probó en notebook o viewport mediano.
- [ ] Se comprobó el scroll de la grilla.
- [ ] Se comprobó el comportamiento del popup.
- [ ] Se ejecutó el build antes de integrar.

Comando final recomendado:

```bash
npm run build
```

---

## Documentación relacionada

Existe una guía adicional en:

```text
src/components/shared/FIELD_MANAGER_UI_SEED.md
```

El presente README es la referencia principal para crear pantallas nuevas y utiliza las rutas actuales de la estructura del proyecto.
