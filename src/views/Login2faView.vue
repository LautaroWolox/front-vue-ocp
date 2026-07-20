<template>
  <div v-if="loadingUser" class="login-page login-page--profile-loading">
    <main class="profile-loading-main">
      <section class="profile-loading-card" aria-live="polite" aria-busy="true">
        <div class="profile-loading-avatar" aria-hidden="true">
          <span v-if="profileInitials">{{ profileInitials }}</span>
          <i v-else class="pi pi-user"></i>
        </div>

        <span class="profile-loading-chip">
          <i class="pi pi-check-circle"></i>
          Acceso confirmado
        </span>

        <h1 v-if="profileName">Tu turno {{ profileFirstName }}</h1>
        <h1 v-else>Cargando tu perfil</h1>

        <p v-if="profileName">Estamos preparando tu espacio de trabajo en Field Manager.</p>
        <p v-else>Validando tus permisos y rutas de acceso.</p>

        <ProgressSpinner
          class="profile-loading-spinner"
          strokeWidth="4"
          animationDuration=".8s"
        />

        <span class="profile-loading-message">Cargando perfil...</span>
      </section>
    </main>
  </div>

  <div v-else class="login-page">
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
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()
const loadingUser = ref(false)
const profileName = ref('')

const profileFirstName = computed(() => {
  const value = String(profileName.value || 'Usuario').trim()
  return value.split(/\s+/)[0] || 'Usuario'
})

const profileInitials = computed(() => {
  const parts = String(profileName.value || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return ''
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const ingresar = () => {
  window.location.href = `${window.location.origin}/pc/llamado.html`
}

onMounted(async () => {
  const loginCallback = new URLSearchParams(window.location.search).get('loginCallback')
  if (loginCallback !== 'true') return

  loadingUser.value = true

  try {
    const user = await authStore.fetchUserData()

    if (user?.autenticado) {
      profileName.value = user.nombre || user.legajo || 'Usuario'
      await wait(1400)
      await router.replace({ name: 'main' })
      return
    }

    loadingUser.value = false
  } catch (error) {
    console.error('No se pudo cargar el perfil del usuario:', error)
    loadingUser.value = false
  }
})
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

.login-page--profile-loading::before {
  inset: -16% auto auto -10%;
  width: 620px;
  height: 620px;
  background: rgba(0, 169, 189, .12);
}

.profile-loading-main {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.profile-loading-card {
  width: min(500px, 100%);
  min-height: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 36px;
  text-align: center;
  border: 1px solid rgba(216, 229, 234, .94);
  border-radius: 26px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 24px 70px rgba(26, 48, 66, .16);
  backdrop-filter: blur(14px);
}

.profile-loading-avatar {
  width: 82px;
  height: 82px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(145deg, #00b4b5, #008fa1);
  color: #ffffff;
  box-shadow: 0 15px 32px rgba(0, 160, 176, .28);
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -.03em;
}

.profile-loading-chip {
  margin-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  border: 1px solid rgba(35, 161, 95, .18);
  background: #edf9f2;
  color: #1b8c50;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.profile-loading-card h1 {
  margin: 22px 0 8px;
  color: #1d3444;
  font-size: clamp(30px, 5vw, 40px);
  line-height: 1.08;
  font-weight: 850;
  letter-spacing: -.045em;
}

.profile-loading-card p {
  max-width: 350px;
  margin: 0;
  color: #61727f;
  font-size: 14px;
  line-height: 1.6;
}

.profile-loading-spinner {
  width: 48px;
  height: 48px;
  margin-top: 26px;
}

.profile-loading-message {
  margin-top: 10px;
  color: #008fa1;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
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

  .profile-loading-card {
    min-height: 350px;
    padding: 36px 24px;
  }
}
</style>
