/**
 * FIELD MANAGER - PrimeVue PassThrough global
 * --------------------------------------------------------------------------
 * Esta es la entrada global para que PrimeVue pinte todos los componentes
 * nuevos con el mismo estilo de Field Manager / Registro OTs.
 *
 * NOMBRE CORRECTO:
 * - La funcionalidad se llama PrimeVue PassThrough.
 * - Aca registramos clases globales fm-pt-* en las partes internas de
 *   Button, Select, MultiSelect, Accordion, DataTable, Checkbox, Dialog
 *   y DatePicker.
 *
 * SEMILLA GLOBAL PARA PANTALLAS NUEVAS:
 * - Este archivo: src/components/shared/primePassThrough.js
 * - Guia de uso: src/components/shared/FIELD_MANAGER_UI_SEED.md
 * - CSS base: src/assets/css/fm-foundation.css
 * - CSS Registro/grillas: src/assets/css/fm-registro-ui.css
 * - CSS bridge legacy minimo: src/assets/css/fm-legacy-bridge.css
 *
 * IMPORTANTE:
 * - No poner CSS scoped para botones, grillas, checkbox, dialogs, selects,
 *   acordeones o inputs si el estilo es comun a toda la aplicacion.
 * - Las pantallas nuevas deben usar componentes Fm* y clases fm-*.
 * - Si algo comun no existe todavia, agregarlo a una capa global fm-*.
 *
 * COMO USAR EN UNA PANTALLA NUEVA:
 * --------------------------------------------------------------------------
 * <template>
 *   <div class="fm-screen fm-screen--pad">
 *     <Accordion multiple>
 *       <AccordionPanel value="0">
 *         <AccordionHeader>FILTROS</AccordionHeader>
 *         <AccordionContent>
 *           <div class="fm-panel-content fm-panel-content--accent fm-filters">
 *             <div class="fm-filter-grid">
 *               <div class="fm-field fm-field--span-4">
 *                 <label>Nro. OT</label>
 *                 <InputText v-model="filters.nroOt" />
 *               </div>
 *               <div class="fm-field fm-field--span-4">
 *                 <label>Estado</label>
 *                 <Select v-model="filters.estado" :options="estados" optionLabel="name" showClear />
 *               </div>
 *             </div>
 *
 *             <div class="fm-actions fm-filter-actions">
 *               <FmButton label="BUSCAR" icon="pi-search" @click="buscar" />
 *               <FmButton label="LIMPIAR" icon="pi-align-left" variant="outline" @click="limpiar" />
 *             </div>
 *           </div>
 *         </AccordionContent>
 *       </AccordionPanel>
 *
 *       <AccordionPanel value="1">
 *         <AccordionHeader>RESULTADOS</AccordionHeader>
 *         <AccordionContent>
 *           <FmGridShell>
 *             <DataTable :value="rows" dataKey="id" paginator :rows="10" filterDisplay="row">
 *               <template #paginatorstart>
 *                 <FmGridActions @export="exportar" @delete="excluir" @refresh="reprocesar" />
 *               </template>
 *               <Column selectionMode="multiple" headerStyle="width: 3rem" />
 *               <Column field="nroOt" header="Nro. OT" sortable />
 *             </DataTable>
 *           </FmGridShell>
 *         </AccordionContent>
 *       </AccordionPanel>
 *     </Accordion>
 *
 *     <Dialog v-model:visible="showPopup" modal header="Alerta" class="fm-dialog">
 *       <div class="fm-dialog-body">
 *         <p>Mensaje del popup</p>
 *       </div>
 *       <template #footer>
 *         <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" />
 *         <Button label="ACEPTAR" class="fm-btn fm-btn--primary" />
 *       </template>
 *     </Dialog>
 *   </div>
 * </template>
 */

export const fmPrimePassThrough = {
  /**
   * Button de PrimeVue.
   * Para botones de pantalla se recomienda <FmButton>, pero si se usa
   * <Button> de PrimeVue igual toma la base global.
   */
  button: {
    root: { class: 'fm-pt-button fm-action-button' },
    label: { class: 'fm-pt-button-label' },
    icon: { class: 'fm-pt-button-icon' }
  },

  /** Inputs simples de PrimeVue. */
  inputtext: {
    root: { class: 'fm-pt-inputtext fm-input' }
  },

  /** Textarea de PrimeVue para notas/comentarios en popups. */
  textarea: {
    root: { class: 'fm-pt-textarea fm-input' }
  },

  /** Select / Combo de PrimeVue. */
  select: {
    root: { class: 'fm-pt-select fm-select' },
    label: { class: 'fm-pt-select-label' },
    dropdown: { class: 'fm-pt-select-dropdown' },
    panel: { class: 'fm-pt-select-panel' },
    list: { class: 'fm-pt-select-list' },
    option: { class: 'fm-pt-select-option' }
  },

  /** MultiSelect de PrimeVue. */
  multiselect: {
    root: { class: 'fm-pt-multiselect fm-select' },
    labelContainer: { class: 'fm-pt-multiselect-label' },
    dropdown: { class: 'fm-pt-multiselect-dropdown' },
    panel: { class: 'fm-pt-multiselect-panel' },
    list: { class: 'fm-pt-multiselect-list' },
    option: { class: 'fm-pt-multiselect-option' },
    header: { class: 'fm-pt-multiselect-header' }
  },

  /** Acordeones PrimeVue. */
  accordion: {
    root: { class: 'fm-pt-accordion fm-accordion' }
  },
  accordionpanel: {
    root: { class: 'fm-pt-accordion-panel' }
  },
  accordionheader: {
    root: { class: 'fm-pt-accordion-header' },
    toggleicon: { class: 'fm-pt-accordion-toggle-icon' }
  },
  accordioncontent: {
    content: { class: 'fm-pt-accordion-content' }
  },

  /** DataTable / Grilla PrimeVue. */
  datatable: {
    root: { class: 'fm-pt-datatable fm-pass-grid' },
    table: { class: 'fm-pt-datatable-table' },
    header: { class: 'fm-pt-datatable-header' },
    footer: { class: 'fm-pt-datatable-footer' },
    wrapper: { class: 'fm-pt-datatable-wrapper' },
    thead: { class: 'fm-pt-datatable-thead' },
    tbody: { class: 'fm-pt-datatable-tbody' },
    row: { class: 'fm-pt-datatable-row' },
    bodyRow: { class: 'fm-pt-datatable-body-row' },
    columnHeaderContent: { class: 'fm-pt-column-header' },
    paginator: { class: 'fm-pt-paginator' }
  },

  /** Checkbox, principalmente usado por selectionMode en DataTable. */
  checkbox: {
    root: { class: 'fm-pt-checkbox' },
    box: { class: 'fm-pt-checkbox-box' },
    icon: { class: 'fm-pt-checkbox-icon' }
  },

  /** Dialog / Popup / Modal PrimeVue. */
  dialog: {
    root: { class: 'fm-pt-dialog' },
    header: { class: 'fm-pt-dialog-header' },
    content: { class: 'fm-pt-dialog-content' },
    footer: { class: 'fm-pt-dialog-footer' }
  },

  /** DatePicker PrimeVue preparado para futuras pantallas. */
  datepicker: {
    root: { class: 'fm-pt-datepicker fm-date-picker' },
    input: { class: 'fm-pt-datepicker-input fm-date-button' },
    panel: { class: 'fm-pt-datepicker-panel fm-calendar' },
    header: { class: 'fm-pt-datepicker-header fm-calendar-head' },
    day: { class: 'fm-pt-datepicker-day' }
  }
}

export default fmPrimePassThrough
