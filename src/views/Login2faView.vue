<template>
  <div class="login-page">
    <main class="login-main">
      <section class="login-shell" aria-label="Acceso Field Manager">
        <div class="login-brand-panel">
          <div class="login-logo" aria-hidden="true">
            <span class="login-logo-fm">FM</span>
          </div>

          <h1 class="login-brand-title">Field Manager</h1>
          <span class="login-eyebrow">Personal Argentina</span>
        </div>

        <div class="login-card">
          <span class="login-chip">
            <i class="pi pi-shield"></i>
            Acceso seguro
          </span>

          <div class="login-card-title">
            <h2>Bienvenido</h2>
            <p>Conectate con tu usuario corporativo para ingresar al sistema.</p>
          </div>

          <Button
            icon="pi pi-sign-in"
            label="CONECTAR"
            class="login-submit-button"
            type="button"
            @click="ingresar"
          />
        </div>
      </section>
    </main>

    <footer class="footer-fm">
      <div class="footer-copyright">
        © Copyright
        | <a href="#" class="footer-link">Personal Argentina | v. 1.0.0</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth';

const router = useRouter()
const authStore = useAuthStore();
const popupWindow = ref(null)
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
const width = screenWidth / 1.5;
const height = screenHeight / 1.5;
const left = screenWidth / 6;
const top = screenHeight / 6;

const handleMessage = (event) => {
  const origins = new Set([import.meta.env.VITE_ORIGIN]);
  let autenticado = false;
  let usrObj = {};
  if (!origins.has(event.origin)) return
  let jsonStr = event.data.usr
  if(jsonStr !== undefined) {
    console.log("recibido: " + jsonStr)
    usrObj = JSON.parse(jsonStr)
    autenticado = usrObj.autenticado
  }
  if (usrObj && autenticado) {
    authStore.setPerfil({
        autenticado,
        rutas: usrObj.rutas,
        nombre: usrObj.nombre,
        email: usrObj.email,
        legajo: usrObj.legajo
      })
    router.push({ name: 'main'})
    window.removeEventListener('message', handleMessage)
    if (popupWindow.value) {
      popupWindow.value.close()
      popupWindow.value = null
    }
  }
}

const ingresar = () => {
  popupWindow.value = window.open(window.location.origin + '/pc/llamado.html','LoginPopup',`width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`)
}

onMounted(() => {
  window.removeEventListener('message', handleMessage)
  window.addEventListener('message', handleMessage)
})
onBeforeUnmount(() => window.removeEventListener('message', handleMessage))
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 18%, rgba(0, 180, 181, .16), transparent 28%),
    radial-gradient(circle at 82% 24%, rgba(2, 77, 161, .10), transparent 30%),
    linear-gradient(135deg, #f5f8fa 0%, #eef3f6 100%);
  color: #1d3444;
}

.login-page::before {
  content: '';
  position: absolute;
  inset: auto -12% -34% auto;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  background: rgba(0, 169, 189, .10);
  filter: blur(2px);
}

.login-main {
  min-height: calc(100vh - 42px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px 22px 58px;
}

.login-shell {
  width: min(920px, 100%);
  min-height: 430px;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr);
  border-radius: 28px;
  overflow: hidden;
  background: rgba(255, 255, 255, .86);
  border: 1px solid rgba(224, 234, 239, .92);
  box-shadow: 0 24px 70px rgba(26, 48, 66, .16);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.login-brand-panel {
  position: relative;
  min-height: 430px;
  padding: 34px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(0, 169, 189, .95), rgba(0, 139, 140, .94)), #00a9bd;
}

.login-brand-panel::before {
  content: '';
  position: absolute;
  inset: -84px auto auto -30px;
  width: 430px;
  height: 430px;
  background-image: url('@/assets/images/FM_login.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: .20;
  filter: brightness(0) invert(1);
}

.login-brand-panel::after {
  content: '';
  position: absolute;
  right: -90px;
  bottom: -110px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 42px solid rgba(255, 255, 255, .13);
}

.login-logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  margin: 0;
  position: absolute;
  top: 8px;
  left: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-logo::before {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, .92);
  box-shadow: 0 12px 28px rgba(0, 0, 0, .13), inset 0 1px 0 rgba(255, 255, 255, .25);
}

.login-logo-fm {
  position: relative;
  z-index: 1;
  color: #1d3444;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -.03em;
  line-height: 1;
  transform-origin: center;
  animation: fmLogoBreath 2.15s ease-in-out infinite;
}

@keyframes fmLogoBreath {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: .88;
  }
  50% {
    transform: scale(1.14) rotate(8deg);
    opacity: 1;
  }
}

.login-brand-title {
  position: absolute;
  left: 24px;
  right: 24px;
  top: 202px;
  z-index: 1;
  margin: 0;
  color: #ffffff;
  font-size: clamp(31px, 4vw, 44px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -.02em;
  text-align: center;
  transform: scaleX(1.035);
  transform-origin: center;
}

.login-eyebrow {
  position: absolute;
  right: 10px;
  bottom: 6px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .16);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.login-card {
  padding: 46px 42px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, .94);
}

.login-chip {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  background: #e9fbfd;
  color: #008fa1;
  border: 1px solid rgba(0, 169, 189, .16);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.login-chip i {
  font-size: 13px;
}

.login-card-title {
  margin: 28px 0 28px;
}

.login-card-title h2 {
  margin: 0 0 8px;
  color: #1d3444;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -.03em;
}

.login-card-title p {
  margin: 0;
  color: #61727f;
  font-size: 14px;
  line-height: 1.55;
}

.login-submit-button,
:deep(.login-submit-button.p-button) {
  width: 100% !important;
  height: 42px !important;
  border: 0 !important;
  border-radius: 8px !important;
  background: linear-gradient(135deg, #00a9bd, #008fa1) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 24px rgba(0, 169, 189, .26) !important;
  font-size: 13px !important;
  font-weight: 800 !important;
  letter-spacing: .02em !important;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease !important;
}

.login-submit-button:hover,
:deep(.login-submit-button.p-button:hover) {
  background: linear-gradient(135deg, #00b7ca, #008c9d) !important;
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(0, 169, 189, .30) !important;
}

.login-submit-button:active,
:deep(.login-submit-button.p-button:active) {
  transform: translateY(0);
}

.login-submit-button :deep(.p-button-icon),
.login-submit-button :deep(.pi) {
  font-size: 15px !important;
}

.footer-fm {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
  padding: 0 16px 10px;
  text-align: right;
  color: #7a8994;
  font-size: 11px;
}

.footer-link {
  color: #008fa1;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

@media (max-width: 820px) {
  .login-main {
    align-items: flex-start;
    padding-top: 28px;
  }

  .login-shell {
    grid-template-columns: 1fr;
    min-height: auto;
    border-radius: 22px;
  }

  .login-brand-panel {
    min-height: 260px;
  }

  .login-card {
    padding: 34px 24px;
  }
}
</style>
