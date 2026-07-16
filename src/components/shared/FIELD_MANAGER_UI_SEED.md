# Field Manager UI Seed

Esta es la semilla global de estilos y componentes para reutilizar en nuevas pantallas del aplicativo.

## Objetivo

Todas las pantallas nuevas deben usar la misma base visual:

- PrimeVue
- PrimeVue PassThrough global
- componentes globales `Fm*`
- clases globales `fm-*`
- CSS global Field Manager

No copiar estilos scoped de una pantalla a otra para botones, grillas, acordeones, checkbox, calendarios, popups o loaders.

## Entrada global

La configuracion principal esta en:

```js
src/main.js
```

Ahi se importan los CSS globales y se conecta PrimeVue con:

```js
pt: fmPrimePassThrough
```

## PassThrough global

Archivo:

```js
src/components/shared/primePassThrough.js
```

PassThrough es la funcionalidad de PrimeVue que permite agregar clases globales a las partes internas de sus componentes.

Ejemplo: DataTable genera tabla, wrapper, body, paginator y checkbox. Con PassThrough se agregan clases `fm-pt-*` para que los CSS globales los pinten igual en todas las pantallas.

## CSS global principal

Base nueva:

```css
src/assets/css/fm-foundation.css
```

Estilos de Registro / grilla / componentes Field Manager:

```css
src/assets/css/fm-registro-ui.css
```

Loader del tipito:

```css
src/assets/css/fm-loader.css
```

Dialogs, popups y alertas:

```css
src/assets/css/fm-dialog-fixes.css
src/assets/css/fm-dialog-responsive.css
src/assets/css/fm-popup-final-overrides.css
```

Ajustes finales de botones/filtros/acordeones:

```css
src/assets/css/fm-button-final-overrides.css
```

Compatibilidad legacy minima:

```css
src/assets/css/fm-legacy-bridge.css
```

## Componentes globales propios

Registrados en `main.js`:

```vue
<FmButton />
<FmPanel />
<FmGridShell />
<FmAlertDialog />
<FmActionButton />
<FmGridActions />
<FmTypingLoader />
```

## Estructura recomendada para una pantalla nueva

```vue
<template>
  <div class="fm-screen fm-screen--pad">
    <Accordion multiple>
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS</AccordionHeader>
        <AccordionContent>
          <div class="fm-panel-content fm-panel-content--accent fm-filters">
            <div class="fm-filter-grid">
              <div class="fm-field fm-field--span-4">
                <label>Nro. OT</label>
                <InputText v-model="filters.nroOt" />
              </div>

              <div class="fm-field fm-field--span-4">
                <label>Estado</label>
                <Select v-model="filters.estado" :options="estados" optionLabel="name" showClear />
              </div>
            </div>

            <div class="fm-actions fm-filter-actions">
              <FmButton label="BUSCAR" icon="pi-search" @click="buscar" />
              <FmButton label="LIMPIAR" icon="pi-align-left" variant="outline" @click="limpiar" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader>RESULTADOS</AccordionHeader>
        <AccordionContent>
          <FmGridShell>
            <DataTable
              :value="rows"
              dataKey="id"
              paginator
              :rows="10"
              filterDisplay="row"
              selectionMode="multiple"
            >
              <template #paginatorstart>
                <FmGridActions @export="exportar" @delete="excluir" @refresh="reprocesar" />
              </template>

              <Column selectionMode="multiple" headerStyle="width: 3rem" />
              <Column field="nroOt" header="Nro. OT" sortable />
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
```

## Reglas

1. Usar `FmButton` para botones de accion.
2. Usar `FmGridShell` + PrimeVue `DataTable` para grillas.
3. Usar `FmGridActions` para iconos de exportar, excluir y reprocesar.
4. Usar PrimeVue `Dialog` con clases `fm-dialog` o `fm-dialog-alert` para popups.
5. Usar `FmTypingLoader` para cargas de pantalla, grilla o popup.
6. No crear CSS scoped para estilos globales repetibles.
7. Si una pantalla necesita un ajuste comun, agregarlo a una capa global `fm-*`.
8. Si una pantalla vieja necesita compatibilidad, agregar solo lo minimo a `fm-legacy-bridge.css`.

## Migracion de theme.css

`theme.css` era un theme viejo generado para PrimeVue anterior. No debe volver a usarse como base porque contiene reglas internas viejas y primary azul.

Se elimino el archivo y se migro al bridge solo lo que puede servir como compatibilidad:

- `--surface-*`
- `--gray-*`
- `--text-color`
- `--text-color-secondary`
- `--content-padding`
- `--inline-spacing`
- `--border-radius`
- `--focus-ring`
- `--maskbg`
- paletas `blue`, `cyan`, `primary`, `green`, `yellow`, `red`, `pink`, `indigo`, `teal`, `orange`, `bluegray`, `purple`
- estados minimos `.p-error`, `.p-text-secondary`, `.p-component-overlay`, `.p-link`
- compatibilidad minima de `.p-editor-container`

No se migraron reglas viejas masivas de componentes PrimeVue como `p-datepicker`, `p-autocomplete`, `p-dropdown`, etc. porque la base nueva ya viene de PrimeVue 4 + Lara + `definePreset` + PassThrough + CSS `fm-*`.

## Archivos legacy eliminados

Los estilos viejos ya no deben usarse como base:

```css
nuestros.css
/theme.css
```

Las variables utiles de `theme.css` fueron migradas a `fm-legacy-bridge.css`, pero con primary turquesa Field Manager.
