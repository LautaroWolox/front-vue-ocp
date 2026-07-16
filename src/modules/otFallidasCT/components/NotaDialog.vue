<template>
  <Dialog :visible="visible" modal header="Nota" :style="{ width: '34rem' }" class="fm-dialog fm-dialog-nota" @update:visible="$emit('update:visible', $event)">
    <div class="fm-note-body">
      <label>Nota</label>
      <div class="fm-note-readonly">{{ nota }}</div>
    </div>
    <template #footer>
      <div class="fm-note-footer">
        <button type="button" class="fm-note-close-native" @click="cerrar">CERRAR</button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ visible: Boolean, row: { type: Object, default: null } })
const emit = defineEmits(['update:visible'])
const nota = computed(() => props.row?.nota || '')

const cerrar = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.fm-note-readonly {
  width: 100%;
  min-height: 74px;
  padding: 12px 14px;
  border: 1px solid #c8d3dc;
  border-radius: 4px;
  background: #ffffff;
  color: #263746;
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.fm-note-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.fm-note-close-native {
  width: 96px;
  min-width: 96px;
  max-width: 96px;
  height: 32px;
  min-height: 32px;
  max-height: 32px;
  padding: 0 12px;
  border: 1px solid #00a9bd;
  border-radius: 5px;
  background: #ffffff;
  color: #00a9bd;
  box-shadow: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: .2px;
  text-align: center;
  cursor: pointer;
  transition: background-color .15s ease, box-shadow .15s ease, border-color .15s ease, color .15s ease, transform .15s ease;
}

.fm-note-close-native:hover,
.fm-note-close-native:focus,
.fm-note-close-native:focus-visible {
  border-color: #008fa1;
  background: #e0f7fa;
  color: #008fa1;
  box-shadow: 0 8px 18px #c8edf2;
  outline: none;
  transform: translateY(-1px);
}
</style>
