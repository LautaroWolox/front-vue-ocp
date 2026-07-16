<template>
  <div
    class="fm-typing-loader"
    :class="loaderClasses"
    role="status"
    aria-live="polite"
    :aria-label="accessibleMessage"
  >
    <div class="fm-typing-loader__box">
      <img class="fm-typing-loader__image" :src="typingLoaderSrc" alt="Cargando" />
      <strong v-if="showTitle && displayTitle" class="fm-typing-loader__title">{{ displayTitle }}</strong>
      <div v-if="showMessage" class="fm-typing-loader__message">
        {{ message }}<span class="fm-typing-loader__dots" aria-hidden="true"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Loader global Field Manager.
 * --------------------------------------------------------------------------
 * Usa la captura del tipito tipeando que se recibio como base visual.
 *
 * COMO USAR EN OTRAS PANTALLAS:
 *
 * 1) Pantalla completa / cambio de ruta:
 *    <FmTypingLoader fullscreen title="Cargando" message="Cargando pantalla" />
 *
 * 2) Dentro de una grilla:
 *    <FmGridShell :loading="loading" loading-message="Cargando grilla">
 *      <DataTable :value="rows" />
 *    </FmGridShell>
 *
 * 3) Dentro de un popup/dialog:
 *    <Dialog v-model:visible="visible" modal header="Alerta" class="fm-dialog">
 *      <div class="fm-dialog-body">...</div>
 *      <FmTypingLoader v-if="loading" overlay variant="dialog" title="Procesando" message="Guardando cambios" />
 *    </Dialog>
 *
 * No repetir CSS scoped para este loader. La estetica esta en:
 * src/assets/css/fm-loader.css
 */

const props = defineProps({
  title: { type: String, default: 'Cargando' },
  message: { type: String, default: 'Procesando información' },
  variant: { type: String, default: 'inline' },
  fullscreen: { type: Boolean, default: false },
  overlay: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  showTitle: { type: Boolean, default: true },
  showMessage: { type: Boolean, default: true }
})

const typingLoaderSrc = 'data:image/png;base64,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'

const displayTitle = computed(() => props.title || props.message)
const accessibleMessage = computed(() => `${displayTitle.value}. ${props.message}`.trim())

const loaderClasses = computed(() => ({
  'fm-typing-loader--fullscreen': props.fullscreen,
  'fm-typing-loader--overlay': props.overlay,
  'fm-typing-loader--inline': props.inline || (!props.fullscreen && !props.overlay),
  [`fm-typing-loader--${props.variant}`]: Boolean(props.variant)
}))
</script>
