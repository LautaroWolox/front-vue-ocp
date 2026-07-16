<template>
  <FmButton label="BUSCAR" icon="pi-search" @click="buscar" />
</template>

<script setup>
const emit = defineEmits(['search'])

const buscar = () => {
  emit('search', true)
}
</script>
