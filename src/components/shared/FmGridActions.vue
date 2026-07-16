<template>
  <div class="fm-grid-actions-final" :class="{ 'fm-grid-actions-final--large': size === 'large' }">
    <Button
      v-if="showExport"
      icon="pi pi-download"
      text
      rounded
      class="fm-grid-action-final"
      :pt="actionButtonPt"
      title="Exportar"
      aria-label="Exportar"
      @click="$emit('export')"
    />

    <Button
      v-if="showDelete"
      icon="pi pi-trash"
      text
      rounded
      class="fm-grid-action-final"
      :pt="actionButtonPt"
      title="Excluir seleccionados"
      aria-label="Excluir seleccionados"
      @click="$emit('delete')"
    />

    <Button
      v-if="showRefresh"
      icon="pi pi-refresh"
      text
      rounded
      class="fm-grid-action-final"
      :pt="actionButtonPt"
      title="Reprocesar"
      aria-label="Reprocesar"
      @click="$emit('refresh')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  showExport: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  showRefresh: { type: Boolean, default: true },
  size: { type: String, default: 'compact' }
})

const isLarge = computed(() => props.size === 'large')

const actionButtonPt = computed(() => ({
  root: {
    class: 'fm-grid-action-final-root',
    style: isLarge.value
      ? 'width:24px !important;min-width:24px !important;max-width:24px !important;height:24px !important;min-height:24px !important;max-height:24px !important;padding:0 !important;margin:0 !important;border:0 !important;background:transparent !important;background-color:transparent !important;box-shadow:none !important;outline:none !important;overflow:visible !important;color:#001f2f !important;'
      : 'width:16px !important;min-width:16px !important;max-width:16px !important;height:16px !important;min-height:16px !important;max-height:16px !important;padding:0 !important;margin:0 !important;border:0 !important;background:transparent !important;background-color:transparent !important;box-shadow:none !important;outline:none !important;overflow:visible !important;'
  },
  icon: {
    class: 'fm-grid-action-final-icon',
    style: isLarge.value
      ? 'width:18px !important;min-width:18px !important;height:18px !important;min-height:18px !important;font-size:18px !important;line-height:18px !important;margin:0 !important;overflow:visible !important;color:#001f2f !important;'
      : 'width:12px !important;min-width:12px !important;height:12px !important;min-height:12px !important;font-size:12px !important;line-height:12px !important;margin:0 !important;overflow:visible !important;'
  }
}))

defineEmits(['export', 'delete', 'refresh'])
</script>

<style scoped>
.fm-grid-actions-final {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 12px !important;
  overflow: visible !important;
  line-height: 1 !important;
}

.fm-grid-actions-final--large {
  gap: 12px !important;
}

.fm-grid-actions-final :deep(.p-button.fm-grid-action-final),
.fm-grid-actions-final :deep(.fm-grid-action-final-root) {
  width: 16px !important;
  min-width: 16px !important;
  max-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  max-height: 16px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #4f6673 !important;
  box-shadow: none !important;
  outline: none !important;
  overflow: visible !important;
  transform: none !important;
}

.fm-grid-actions-final--large :deep(.p-button.fm-grid-action-final),
.fm-grid-actions-final--large :deep(.fm-grid-action-final-root) {
  width: 24px !important;
  min-width: 24px !important;
  max-width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  max-height: 24px !important;
  color: #001f2f !important;
}

.fm-grid-actions-final :deep(.p-button.fm-grid-action-final:hover),
.fm-grid-actions-final :deep(.p-button.fm-grid-action-final:focus),
.fm-grid-actions-final :deep(.p-button.fm-grid-action-final:focus-visible),
.fm-grid-actions-final :deep(.fm-grid-action-final-root:hover),
.fm-grid-actions-final :deep(.fm-grid-action-final-root:focus),
.fm-grid-actions-final :deep(.fm-grid-action-final-root:focus-visible) {
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #008fa1 !important;
  box-shadow: none !important;
  outline: none !important;
  overflow: visible !important;
  transform: none !important;
}

.fm-grid-actions-final--large :deep(.p-button.fm-grid-action-final:hover),
.fm-grid-actions-final--large :deep(.p-button.fm-grid-action-final:focus),
.fm-grid-actions-final--large :deep(.p-button.fm-grid-action-final:focus-visible),
.fm-grid-actions-final--large :deep(.fm-grid-action-final-root:hover),
.fm-grid-actions-final--large :deep(.fm-grid-action-final-root:focus),
.fm-grid-actions-final--large :deep(.fm-grid-action-final-root:focus-visible) {
  color: #006f7d !important;
}

.fm-grid-actions-final :deep(.p-button-label) {
  display: none !important;
}

.fm-grid-actions-final :deep(.p-button-icon),
.fm-grid-actions-final :deep(.pi),
.fm-grid-actions-final :deep(.fm-grid-action-final-icon) {
  width: 12px !important;
  min-width: 12px !important;
  height: 12px !important;
  min-height: 12px !important;
  font-size: 12px !important;
  line-height: 12px !important;
  margin: 0 !important;
  overflow: visible !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.fm-grid-actions-final :deep(.p-button-icon::before),
.fm-grid-actions-final :deep(.pi::before),
.fm-grid-actions-final :deep(.fm-grid-action-final-icon::before) {
  font-size: 12px !important;
  line-height: 12px !important;
}

.fm-grid-actions-final--large :deep(.p-button-icon),
.fm-grid-actions-final--large :deep(.pi),
.fm-grid-actions-final--large :deep(.fm-grid-action-final-icon) {
  width: 18px !important;
  min-width: 18px !important;
  height: 18px !important;
  min-height: 18px !important;
  font-size: 18px !important;
  line-height: 18px !important;
  color: currentColor !important;
}

.fm-grid-actions-final--large :deep(.p-button-icon::before),
.fm-grid-actions-final--large :deep(.pi::before),
.fm-grid-actions-final--large :deep(.fm-grid-action-final-icon::before) {
  font-size: 18px !important;
  line-height: 18px !important;
}
</style>
