import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/css/legacy/fm-legacy-bridge.css';
import './assets/css/base/fm-design-system.css';
import './assets/css/base/fm-global-ui.css';
import './assets/css/responsive/responsive.css';
import './assets/css/responsive/responsive-resolutions.css';
import './assets/css/base/fm-foundation.css';
import './assets/css/base/fm-registro-ui.css';
import './assets/css/components/loaders/fm-loader.css';
import './assets/css/components/dialogs/fm-dialog-fixes.css';
import './assets/css/components/dialogs/fm-dialog-responsive.css';
import './assets/css/overrides/fm-last-overrides.css';
import './assets/css/components/dialogs/fm-popup-overrides.css';
import './assets/css/modules/ot-fallidas/fm-button-overrides.css';
import './assets/css/components/grids/fm-grid-actions.css';
import './assets/css/components/menus/fm-menubar-submenus.css';
import './assets/css/components/dialogs/fm-dialog-close.css';
import './assets/css/modules/login/login-redesign.css';
import './assets/css/modules/parametrizaciones/jobtype-contrato.css';
import './assets/css/modules/parametrizaciones/jobtype-contrato-compact.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-layout.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-final-fix.css';
import './assets/css/modules/parametrizaciones/jobtype-close-kill.css';
import './assets/css/modules/parametrizaciones/jobtype-trash-icon-fix.css';
import './assets/css/modules/parametrizaciones/jobtype-grid-icon-alignment.css';
import './assets/css/modules/parametrizaciones/jobtype-search-button-size.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-grid-main-like.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-grid-gutter-fix.css';
import './assets/css/modules/parametrizaciones/jobtype-modal-maximize.css';
import './assets/css/modules/parametrizaciones/jobtype-modal-trash-flat.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-scroll-lines-final.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-datatable-final.css';
import './assets/css/modules/parametrizaciones/jobtype-popup-trash-left-final.css';
import './assets/css/modules/parametrizaciones/jobtype-alta-dynamic-grid.css';
import './assets/css/modules/parametrizaciones/cmo-actividad.css';
import './assets/css/modules/parametrizaciones/cmo-popup-jobtype-align.css';
import './assets/css/modules/reporteSas/grid-ajustes.css';
import Lara from '@primeuix/themes/lara';

import { definePreset } from '@primeuix/themes';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { strings } from './strings.js'
import { fmPrimePassThrough } from './components/shared/primePassThrough.js'
import { initJobtypeModalMaximize } from './modules/parametrizaciones/jobtypeContrato/jobtypeModalMaximize.js'

import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import App from './App.vue';
import router from './router';
import FmButton from './components/shared/FmButton.vue';
import FmPanel from './components/shared/FmPanel.vue';
import FmGridShell from './components/shared/FmGridShell.vue';
import FmAlertDialog from './components/shared/FmAlertDialog.vue';
import FmActionButton from './components/shared/FmActionButton.vue';
import FmGridActions from './components/shared/FmGridActions.vue';
import FmTypingLoader from './components/shared/FmTypingLoader.vue';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import ProgressSpinner from 'primevue/progressspinner';
import MultiSelect from 'primevue/multiselect'
import Dialog from 'primevue/dialog';


const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const MyPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '#e0fafa',
            100: '#b3f1f1',
            200: '#80e7e8',
            300: '#4ddddd',
            400: '#26d4d4',
            500: '#00b4b5',
            600: '#009fa0',
            700: '#008b8c',
            800: '#007678',
            900: '#006364',
            950: '#004445'
        }
    }
});

const app = createApp(App)
app.use(pinia);
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            prefix: '',
            cssLayer: {
                name: 'primevue',
                order: 'primevue, fieldmanager'
            },
            darkModeSelector: false
        }
    },
    pt: fmPrimePassThrough,
    ripple: true,
    inputVariant: "filled",
    locale: strings.locale
});

app.component('Accordion', Accordion);
app.component('AccordionPanel', AccordionPanel);
app.component('AccordionHeader', AccordionHeader);
app.component('AccordionContent', AccordionContent);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('CheckBox', Checkbox);
app.component('ProgressSpinner', ProgressSpinner);
app.component('MultiSelect', MultiSelect);
app.component('Dialog', Dialog);
app.component('Select',Select);

app.component('FmButton', FmButton);
app.component('FmPanel', FmPanel);
app.component('FmGridShell', FmGridShell);
app.component('FmAlertDialog', FmAlertDialog);
app.component('FmActionButton', FmActionButton);
app.component('FmGridActions', FmGridActions);
app.component('FmTypingLoader', FmTypingLoader);
app.directive('tooltip', Tooltip);

initJobtypeModalMaximize();

app.mount('#app')