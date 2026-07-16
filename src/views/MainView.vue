<template>
  <div>
    <custom-menu />
    <router-view />
    <div v-show="showLogo()" class="main-body">
      <div v-show="showLogo()" class="fm-logo"></div>
    </div>
  </div>
</template>

<script setup>
import CustomMenu from '@/components/CustomMenu.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showLogo = () => {
  if (route.name === 'main') return true;
  else return false;
}

</script>

<style scoped>
.main-body {
  --main-logo-size: clamp(220px, 22vw, 380px);
  --main-fm-size: calc(var(--main-logo-size) * .86);
  position: absolute;
  inset: 0;
  width: var(--main-logo-size);
  height: var(--main-logo-size);
  margin: auto;
  overflow: hidden;
  pointer-events: none;
  background-image: url(@/assets/images/FM_semi_circulo.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0;
  animation: fmMainLogoReveal .9s ease .25s forwards;
}

.fm-logo {
  position: absolute;
  inset: 0;
  width: var(--main-fm-size);
  height: var(--main-fm-size);
  margin: auto;
  background-image: url(@/assets/images/FM.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform-origin: center;
  animation: fmMainLogoBreath 2.8s ease-in-out 1.15s infinite;
}

@keyframes fmMainLogoReveal {
  0% {
    opacity: 0;
    transform: scale(.96);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fmMainLogoBreath {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(0, 169, 189, 0));
  }

  50% {
    transform: scale(1.045);
    filter: drop-shadow(0 8px 18px rgba(0, 169, 189, .22));
  }
}

@media (max-width: 768px) {
  .main-body {
    --main-logo-size: clamp(190px, 48vw, 300px);
  }
}

@media (max-width: 420px) {
  .main-body {
    --main-logo-size: clamp(170px, 62vw, 250px);
  }
}
</style>
