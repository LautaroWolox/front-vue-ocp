<template>
  <button class="fm-btn fm-btn--primary" type="button" :disabled="disabled" @click="$emit('click')">
    <span class="material-icons fm-btn__icon">search</span>
    <span>{{ label }}</span>
  </button>
</template>
<script setup>
defineProps({ label: { type: String, default: 'BUSCAR' }, disabled: { type: Boolean, default: false } })
defineEmits(['click'])
</script>
