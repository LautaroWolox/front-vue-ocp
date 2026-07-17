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
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let removeLoginReloadHook

/**
 * Loader global de carga de pantalla.
 * --------------------------------------------------------------------------
 * Se muestra cuando Vue carga componentes de ruta lazy.
 * No hace falta agregarlo manualmente en cada pantalla.
 */

/**
 * Al cerrar sesión, Vue navega internamente desde MainView hacia login2fa.
 * Esa navegación conservaba estilos y estado visual de las pantallas internas,
 * deformando el login. Cuando el login se alcanza desde otra ruta, se fuerza
 * una recarga limpia para restaurar exactamente su diseño original.
 */
onMounted(() => {
  removeLoginReloadHook = router.afterEach((to, from) => {
    if (to.name !== 'login2fa' || !from.name) return

    window.location.replace(`${import.meta.env.BASE_URL}login2fa.html`)
  })
})

onUnmounted(() => {
  removeLoginReloadHook?.()
})
</script>
