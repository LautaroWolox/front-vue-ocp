/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARAMETER1: string
  readonly VITE_FM_MV_URL: string
  readonly VITE_ORIGIN?: string
  readonly VITE_ALLOWED_HOSTS?: string
  readonly VITE_MS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
