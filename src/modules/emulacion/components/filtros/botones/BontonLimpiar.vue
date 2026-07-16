<template>
  <FmButton label="LIMPIAR" icon="pi-align-left" variant="outline" @click="limpiar" />
</template>

<script setup>
const emit = defineEmits(['clear'])

const limpiar = () => {
  emit('clear', true)
}
</script>
