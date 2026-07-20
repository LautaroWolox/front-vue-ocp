import { defineStore } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useFetch } from '@vueuse/core'

const normalizeLegajo = (value = '') => String(value).trim().toUpperCase().slice(0, 13)

const parseBackendData = (value) => {
  if (value == null || value === '') return null
  if (typeof value !== 'string') return value

  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}

const useEmulacionStore = defineStore('emulacionStore', {
  state: () => ({
    legajoSelected: '',
    activeTab: [0],
    data: [],
    selectedOperador: null,
    toggleLoader: false,
    searching: false,
    emulating: false,
    error_code: '',
    error_message: '',
    authStore: useAuthStore()
  }),

  actions: {
    $setlegajoSelected(selection) {
      this.legajoSelected = normalizeLegajo(selection)
    },

    $setSelectedOperador(operador) {
      this.selectedOperador = operador || null

      if (operador?.legajo) {
        this.legajoSelected = normalizeLegajo(operador.legajo)
      }
    },

    $resetFilters() {
      this.legajoSelected = ''
      this.selectedOperador = null
      this.error_code = ''
      this.error_message = ''
    },

    $resetData() {
      this.data = []
      this.selectedOperador = null
    },

    $clearAll() {
      this.$resetFilters()
      this.$resetData()
      this.$setActiveTab(0)
    },

    async $fetchData() {
      if (this.searching) return

      this.error_code = ''
      this.error_message = ''
      this.toggleLoader = true
      this.searching = true
      this.selectedOperador = null
      this.legajoSelected = normalizeLegajo(this.legajoSelected)

      try {
        const { data, error, response } = await useFetch(
          `/pc/emulacion/buscar.html?legajo=${encodeURIComponent(this.legajoSelected)}`
        ).get()

        const status = response.value?.status
        const parsed = parseBackendData(data.value)

        if (error.value || (status && status >= 400)) {
          this.data = []
          this.error_code = status || 500
          this.error_message = String(error.value || `Error ${status}`)
          return
        }

        const rows = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.rows)
            ? parsed.rows
            : []

        this.data = rows.map((item, index) => ({
          id: item.id ?? index + 1,
          legajo: normalizeLegajo(item.legajo),
          nombre: item.nombre ?? '',
          apellido: item.apellido ?? '',
          perfil: item.perfil ?? item.descripcionPerfil ?? '',
          email: item.email ?? '',
          rutas: Array.isArray(item.rutas) ? item.rutas : []
        }))
      } catch (error) {
        this.data = []
        this.error_code = 500
        this.error_message = error?.message || 'Error buscando operadores'
      } finally {
        this.toggleLoader = false
        this.searching = false
      }
    },

    async $emulate() {
      if (this.emulating) return

      this.error_code = ''
      this.error_message = ''
      this.toggleLoader = true
      this.emulating = true

      const operador = this.selectedOperador || this.data.find(
        (item) => item.legajo === this.legajoSelected
      )
      const legajo = normalizeLegajo(operador?.legajo || this.legajoSelected)

      try {
        const { data, error, response } = await useFetch(
          `/pc/emulacion/cambiarUsuario.html?legajo=${encodeURIComponent(legajo)}`
        ).get()

        const status = response.value?.status
        const perfil = parseBackendData(data.value)

        if (error.value || (status && status >= 400) || !perfil) {
          this.error_code = status || 500
          this.error_message = String(error.value || `Error ${status || ''}`)
          return
        }

        this.authStore.setPerfil({
          autenticado: true,
          rutas: Array.isArray(perfil.rutas) ? perfil.rutas : [],
          nombre: perfil.nombre ?? operador?.nombre ?? '',
          email: perfil.email ?? operador?.email ?? '',
          legajo: perfil.legajo ?? legajo
        })
      } catch (error) {
        this.error_code = 500
        this.error_message = error?.message || 'Error emulando usuario'
      } finally {
        this.toggleLoader = false
        this.emulating = false
      }
    },

    $setActiveTab(val) {
      this.activeTab = [val]
    }
  }
})

export default useEmulacionStore
