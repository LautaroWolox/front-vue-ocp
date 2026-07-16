<template>
  <Dialog :visible="visible" modal header="Alerta" :style="{ width: '500px' }" class="fm-dialog fm-dialog-incluir" @update:visible="onVisibleChange">
    <div class="fm-dialog-body">
      <p>¿Confirma que desea recuperar la OT seleccionada?</p>
      <label>Motivo</label>
      <Select v-model="motivo" :options="store.motivos" optionLabel="name" class="fm-dialog-select" />
      <label>Nota</label>
      <Textarea v-model="nota" rows="4" class="w-full fm-dialog-textarea" placeholder="Opcional" />
    </div>

    <FmTypingLoader v-if="saving" overlay variant="dialog" title="Procesando" message="Recuperando OT" />

    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" :disabled="saving" @click="cerrar" />
      <Button label="ACEPTAR" class="fm-btn fm-btn--primary" :disabled="saving" @click="confirmar" />
    </template>
  </Dialog>

  <Dialog v-model:visible="showAlert" modal header="Alerta" :style="{ width: '430px' }" class="fm-dialog-alert">
    <div class="fm-alert-body">
      <div class="fm-alert-triangle"><span>!</span></div>
      <span>Debe seleccionar un motivo.</span>
    </div>
    <template #footer>
      <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="showAlert = false" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Textarea from 'primevue/textarea'
import { useFallidasCtStore } from '../store/CtFallidaStore'

const props = defineProps({ visible: Boolean, row: { type: Object, default: null } })
const emit = defineEmits(['update:visible'])
const store = useFallidasCtStore()
const motivo = ref(null)
const nota = ref('')
const showAlert = ref(false)
const saving = ref(false)

watch(() => props.visible, (value) => {
  if (value) {
    motivo.value = null
    nota.value = props.row?.nota || ''
    showAlert.value = false
    saving.value = false
  }
})

const cerrar = () => {
  if (saving.value) return
  emit('update:visible', false)
}

const closeAfterSave = () => {
  saving.value = false
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}

const confirmar = async () => {
  if (!motivo.value) {
    showAlert.value = true
    return
  }

  saving.value = true
  try {
    await store.incluir(props.row, motivo.value, nota.value)
    closeAfterSave()
  } finally {
    saving.value = false
  }
}
</script>
