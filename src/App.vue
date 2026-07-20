<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />

      <template #fallback>
        <FmTypingLoader fullscreen title="Cargando" message="Cargando pantalla" />
      </template>
    </Suspense>
  </RouterView>
</template>

<script setup>
/**
 * Loader global de carga de pantalla.
 * --------------------------------------------------------------------------
 * Se muestra cuando Vue carga componentes de ruta lazy.
 * No hace falta agregarlo manualmente en cada pantalla.
 */
</script>
