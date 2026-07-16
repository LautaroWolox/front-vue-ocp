<template>
  <div class="iframe-wrapper">
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      :title="titulo"
      id="iframe"
      frameborder="0"
      allowfullscreen
      scrolling="no"
      @load="onIframeLoad"
    />
    <div v-if="isLoading" class="iframe-loader">
      <FmTypingLoader
        fullscreen
        title="Cargando"
        message="Cargando pantalla"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import router from '@/router';

const allowedOrigin = import.meta.env.VITE_ORIGIN;

const props = defineProps({
  urlParam: {
    type: String,
    required: true
  },
  titleParam: {
    type: String,
    required: true
  }
});

const iframeRef = ref(null);
const iframeVisible = ref(true);
const isLoading = ref(true);

const currentUrlParam = ref(props.urlParam || sessionStorage.getItem('urlParam') || '');
const currentTitleParam = ref(props.titleParam || sessionStorage.getItem('titleParam') || '');

const iframeSrc = computed(() => '/pc' + currentUrlParam.value);
const titulo = computed(() => currentTitleParam.value);

watch(
  () => [props.urlParam, props.titleParam],
  async ([newUrl, newTitle]) => {
    if (!newUrl) return;
    sessionStorage.setItem('urlParam', newUrl);
    sessionStorage.setItem('titleParam', newTitle || '');

    iframeVisible.value = false;
    isLoading.value = true;

    await nextTick();

    currentUrlParam.value = newUrl;
    currentTitleParam.value = newTitle || '';

    iframeVisible.value = true;
  },
  { immediate: true }
);

function onIframeLoad() {
  console.trace('IFRAME LOAD EVENT', iframeSrc.value);
  isLoading.value = false;

  try {
    iframeRef.value?.contentWindow?.dispatchEvent(new Event('resize'));
  } catch (e) {
    console.warn('No se pudo disparar resize dentro del iframe', e);
  }
}

function handleRedirect(event) {
  if (event.origin !== allowedOrigin && event.origin !== window.location.origin) {
    return;
  }

  const message = event.data;

  if (message && message.type === 'redirect' && message.nroActa && message.url) {
    const { nroActa, url } = message;

    sessionStorage.setItem('nroActa', nroActa);
    sessionStorage.setItem('urlDetalle', url);

    const route = router.resolve({ name: 'DEAC' });
    window.open(route.href, '_blank');
  }
}

onMounted(() => {
  window.addEventListener('message', handleRedirect);
});

onUnmounted(() => {
  window.removeEventListener('message', handleRedirect);
});
</script>

<style scoped>
.iframe-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.iframe-loader {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
}
</style>
