<template>
  <button class="fm-btn fm-btn--outline" type="button" :disabled="disabled" @click="$emit('click')">
    <span>{{ label }}</span>
  </button>
</template>
<script setup>
defineProps({ label: { type: String, default: 'LIMPIAR' }, disabled: { type: Boolean, default: false } })
defineEmits(['click'])
</script>
