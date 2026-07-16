<template>
    <div class="flex flex-column px-2">
        <label for="desc">Descripción Error</label>
        <InputText type="text" id="desc" v-model="descError" />
    </div>
</template>


<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';

const descError = ref(null);

</script>

<style scoped>
</style>
