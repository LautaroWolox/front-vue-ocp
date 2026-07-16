import { defineStore } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useFetch } from '@vueuse/core'

const MOCK_OPERADORES = [
  {
    id: 1,
    legajo: 'AB123456789',
    nombre: 'Lautaro',
    apellido: 'Operador Demo',
    perfil: 'ADMINISTRADOR FM',
    email: 'lautaro.operador.demo@fieldmanager.local',
    rutas: ['main', 'EMUL', 'ROTF', 'GEOP']
  },
  {
    id: 2,
    legajo: 'OP987654321',
    nombre: 'Marina',
    apellido: 'Soporte',
    perfil: 'OPERADOR SOPORTE',
    email: 'marina.soporte@fieldmanager.local',
    rutas: ['main', 'EMUL', 'SONE']
  },
  {
    id: 3,
    legajo: 'CRD45678901',
    nombre: 'Diego',
    apellido: 'Credencial',
    perfil: 'SUPERVISOR',
    email: 'diego.credencial@fieldmanager.local',
    rutas: ['main', 'EMUL', 'ROTF']
  }
]

const normalizeLegajo = (value = '') => String(value).trim().toUpperCase().slice(0, 13)

const parseBackendData = (data) => {
  if (!data?.value) return null
  try {
    return JSON.parse(data.value)
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

    getMockOperadores() {
      const legajo = normalizeLegajo(this.legajoSelected)
      if (!legajo) return MOCK_OPERADORES

      const filtrados = MOCK_OPERADORES.filter((operador) => operador.legajo.includes(legajo))
      return filtrados.length ? filtrados : [
        {
          id: 99,
          legajo,
          nombre: 'Usuario',
          apellido: 'Mockeado',
          perfil: 'OPERADOR FM',
          email: `${legajo.toLowerCase()}@fieldmanager.local`,
          rutas: ['main', 'EMUL']
        }
      ]
    },

    async $fetchData() {
      this.error_code = ''
      this.error_message = ''
      this.toggleLoader = true
      this.searching = true
      this.selectedOperador = null
      this.legajoSelected = normalizeLegajo(this.legajoSelected)

      try {
        // ACA TIENE QUE CONECTAR EL BACKEND - BUSCAR OPERADORES PARA EMULACION
        // Endpoint actual legado:
        // /pc/emulacion/buscar.html?legajo=<LEGAJO>
        // Reemplazar este bloque por el servicio real cuando este disponible.
        const { error, data } = await useFetch(`/pc/emulacion/buscar.html?legajo=${encodeURIComponent(this.legajoSelected)}`)
        const parsed = parseBackendData(data)

        if (Array.isArray(parsed) && parsed.length) {
          this.data = parsed.map((item, index) => ({
            id: item.id ?? index + 1,
            legajo: normalizeLegajo(item.legajo),
            nombre: item.nombre ?? '',
            apellido: item.apellido ?? '',
            perfil: item.perfil ?? item.descripcionPerfil ?? '',
            email: item.email ?? '',
            rutas: item.rutas ?? []
          }))
        } else {
          this.data = this.getMockOperadores()
        }

        this.error_message = error?.value || ''
        this.error_code = error?.value ? 500 : ''
      } catch (error) {
        this.error_message = error?.message || 'Error buscando operadores'
        this.error_code = 500
        this.data = this.getMockOperadores()
      } finally {
        this.toggleLoader = false
        this.searching = false
      }
    },

    async $emulate() {
      this.error_code = ''
      this.error_message = ''
      this.toggleLoader = true
      this.emulating = true

      const operador = this.selectedOperador || this.data.find((item) => item.legajo === this.legajoSelected)
      const legajo = normalizeLegajo(operador?.legajo || this.legajoSelected)

      try {
        // ACA TIENE QUE CONECTAR EL BACKEND - EMULAR USUARIO
        // Endpoint actual legado:
        // /pc/emulacion/cambiarUsuario.html?legajo=<LEGAJO>
        // Reemplazar este bloque por el servicio real cuando este disponible.
        const { error, data } = await useFetch(`/pc/emulacion/cambiarUsuario.html?legajo=${encodeURIComponent(legajo)}`)
        const parsed = parseBackendData(data)
        const perfil = parsed || operador || {
          legajo,
          nombre: 'Usuario Mockeado',
          email: `${legajo.toLowerCase()}@fieldmanager.local`,
          rutas: ['main', 'EMUL']
        }

        this.authStore.setPerfil({
          autenticado: true,
          rutas: perfil.rutas ?? operador?.rutas ?? ['main', 'EMUL'],
          nombre: perfil.nombre ?? operador?.nombre ?? 'Usuario Mockeado',
          email: perfil.email ?? operador?.email ?? `${legajo.toLowerCase()}@fieldmanager.local`,
          legajo: perfil.legajo ?? legajo
        })

        this.error_message = error?.value || ''
        this.error_code = error?.value ? 500 : ''
      } catch (error) {
        this.error_message = error?.message || 'Error emulando usuario'
        this.error_code = 500
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
