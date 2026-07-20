<template>
  <Dialog
    :visible="visible"
    modal
    header="Alerta"
    :style="{ width: '500px' }"
    class="fm-dialog fm-dialog-incluir"
    @update:visible="onVisibleChange"
  >
    <div class="fm-dialog-body">
      <p>¿Confirma que desea recuperar la OT seleccionada?</p>

      <label for="otf-incluir-motivo">Motivo</label>
      <Select
        id="otf-incluir-motivo"
        v-model="motivoSelected"
        :options="motivoOptions"
        optionLabel="nombre"
        :loading="status.motivos === 'loading'"
        :disabled="status.motivos === 'loading'"
        class="fm-dialog-select"
      />

      <label for="otf-incluir-nota">Nota</label>
      <Textarea id="otf-incluir-nota" v-model="nota" rows="4" class="w-full fm-dialog-textarea" placeholder="Opcional" />
    </div>

    <FmTypingLoader v-if="saving" overlay variant="dialog" title="Procesando" message="Recuperando OT" />

    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" :disabled="saving" @click="cerrar" />
      <Button label="ACEPTAR" class="fm-btn fm-btn--primary" :disabled="saving" @click="confirmar" />
    </template>
  </Dialog>

  <FmAlertDialog v-model:visible="showAlert" title="Alerta" :message="alertMessage" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Textarea from 'primevue/textarea'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import { useCommonCtStore } from '@/store/commonCt'

const props = defineProps({
  visible: Boolean,
  row: { type: Object, default: null }
})

const emit = defineEmits(['update:visible'])
const store = useFallidasCtStore()
const commonCT = useCommonCtStore()
const { motivos, status } = storeToRefs(commonCT)
const motivoSelected = ref(null)
const nota = ref('')
const showAlert = ref(false)
const alertMessage = ref('')
const saving = ref(false)

const motivoOptions = computed(() => motivos.value ?? [])

watch(() => props.visible, (value) => {
  if (!value) return

  motivoSelected.value = null
  nota.value = props.row?.nota || ''
  showAlert.value = false
  alertMessage.value = ''
  saving.value = false
})

const cerrar = () => {
  if (saving.value) return
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}

const confirmar = async () => {
  if (!motivoSelected.value?.nombreCorto) {
    alertMessage.value = 'Debe seleccionar un motivo.'
    showAlert.value = true
    return
  }

  if (!props.row?.id) {
    alertMessage.value = 'No se pudo identificar la OT seleccionada.'
    showAlert.value = true
    return
  }

  saving.value = true

  try {
    const result = await store.sendIncluir(
      props.row.id,
      motivoSelected.value.nombreCorto,
      nota.value
    )

    if (result?.status === false) {
      alertMessage.value = result.respuesta || 'No se pudo recuperar la OT.'
      showAlert.value = true
      return
    }

    await store.setData()
    cerrar()
  } finally {
    saving.value = false
  }
}

onMounted(() => commonCT.setMotivosExcInc())
</script>
