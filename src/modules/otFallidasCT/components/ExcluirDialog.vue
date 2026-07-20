<template>
  <Dialog
    :visible="visible"
    modal
    header="Alerta"
    :style="{ width: '520px' }"
    class="fm-dialog fm-dialog-excluir"
    @update:visible="onVisibleChange"
  >
    <div v-if="step === 'form'" class="fm-dialog-body">
      <p>¿Confirma que desea excluir las OTs seleccionadas?</p>

      <label for="otf-excluir-motivo">Motivo</label>
      <Select
        id="otf-excluir-motivo"
        v-model="motivoSelected"
        :options="motivoOptions"
        optionLabel="nombre"
        :loading="status.motivos === 'loading'"
        :disabled="status.motivos === 'loading'"
        class="fm-dialog-select"
      />

      <label for="otf-excluir-nota">Nota</label>
      <Textarea id="otf-excluir-nota" v-model="nota" rows="4" class="w-full fm-dialog-textarea" placeholder="Opcional" />
    </div>

    <div v-else class="fm-dialog-body">
      <p>¿Está seguro que desea excluir?</p>

      <div class="fm-confirm-summary">
        <div class="fm-confirm-row">
          <div class="fm-confirm-label">MOTIVO</div>
          <div class="fm-confirm-value">{{ motivoSelected?.nombre }}</div>
        </div>
        <div class="fm-confirm-row">
          <div class="fm-confirm-label">NOTA</div>
          <div class="fm-confirm-value">{{ nota || 'Sin nota cargada' }}</div>
        </div>
      </div>
    </div>

    <FmTypingLoader v-if="saving" overlay variant="dialog" title="Procesando" message="Excluyendo OTs" />

    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" :disabled="saving" @click="cerrar" />
      <Button :label="step === 'confirm' ? 'EXCLUIR' : 'ACEPTAR'" class="fm-btn fm-btn--primary" :disabled="saving" @click="aceptar" />
    </template>
  </Dialog>

  <FmAlertDialog
    v-model:visible="showValidationAlert"
    title="Alerta"
    :message="validationMessage"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Textarea from 'primevue/textarea'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import { useCommonCtStore } from '@/store/commonCt'

const props = defineProps({
  visible: Boolean,
  selectedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible'])
const store = useFallidasCtStore()
const commonCT = useCommonCtStore()
const { motivos, status } = storeToRefs(commonCT)
const motivoSelected = ref(null)
const nota = ref('')
const step = ref('form')
const showValidationAlert = ref(false)
const validationMessage = ref('')
const saving = ref(false)

const motivoOptions = computed(() => motivos.value ?? [])

watch(() => props.visible, (value) => {
  if (value) reset()
})

const reset = () => {
  motivoSelected.value = null
  nota.value = ''
  step.value = 'form'
  showValidationAlert.value = false
  validationMessage.value = ''
  saving.value = false
}

const cerrar = () => {
  if (saving.value) return
  reset()
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}

const showAlert = (message) => {
  validationMessage.value = message
  showValidationAlert.value = true
}

const aceptar = async () => {
  if (!props.selectedRows.length) {
    showAlert('Debe seleccionar al menos una OT para excluir.')
    return
  }

  if (!motivoSelected.value?.nombreCorto) {
    showAlert('Debe seleccionar un motivo.')
    return
  }

  if (step.value === 'form') {
    step.value = 'confirm'
    return
  }

  saving.value = true

  try {
    const result = await store.sendExcluidas(motivoSelected.value.nombreCorto, nota.value)

    if (result?.status === false) {
      showAlert(result.respuesta || 'No se pudieron excluir las OTs seleccionadas.')
      return
    }

    await store.setData()
    store.setSelectedRows([])
    cerrar()
  } finally {
    saving.value = false
  }
}

onMounted(() => commonCT.setMotivosExcInc())
</script>
