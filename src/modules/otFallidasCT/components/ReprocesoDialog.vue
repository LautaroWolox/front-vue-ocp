<template>
  <Dialog
    :visible="visible"
    modal
    :header="title"
    :style="dialogStyle"
    :class="['fm-dialog', 'fm-reproceso-dialog', `fm-reproceso-dialog--${type}`]"
    @update:visible="onVisibleChange"
  >
    <div class="fm-reproceso-dialog__body">
      <div v-if="type === 'success'" class="fm-reproceso-dialog__success" aria-hidden="true">
        <span></span>
      </div>
      <div v-else class="fm-alert-triangle" aria-hidden="true">
        <span>!</span>
      </div>

      <span class="fm-reproceso-dialog__message">{{ message }}</span>
    </div>

    <template #footer>
      <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Popup de resultado para el boton Reprocesar / Excluir sin seleccion.
 *
 * COMO USAR:
 * <ReprocesoDialog
 *   v-model:visible="visible"
 *   type="warning"
 *   title="Alerta"
 *   message="Debe seleccionar al menos una OT para excluir."
 * />
 */
const props = defineProps({
  visible: { type: Boolean, default: false },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'success'].includes(value)
  },
  title: { type: String, default: 'Alerta' },
  message: { type: String, default: '' }
})

const emit = defineEmits(['update:visible'])

const dialogStyle = computed(() => ({
  width: props.type === 'success' ? '500px' : '430px'
}))

const cerrar = () => {
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}
</script>
