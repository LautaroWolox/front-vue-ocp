<template>
  <Dialog
    :visible="visible"
    modal
    header="Alerta"
    :style="{ width }"
    class="fm-ui-dialog"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="fm-ui-alert-body">
      <div class="fm-ui-alert-triangle"><span>!</span></div>
      <span>{{ message }}</span>
    </div>
    <template #footer>
      <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="$emit('update:visible', false)" />
    </template>
  </Dialog>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: 'Debe completar los datos requeridos.' },
  width: { type: String, default: '42rem' }
})

defineEmits(['update:visible'])
</script>
