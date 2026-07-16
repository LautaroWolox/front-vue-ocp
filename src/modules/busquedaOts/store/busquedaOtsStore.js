import { defineStore } from 'pinia'

const normalizeOtList = (value) => {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const createMockRows = (ots) => {
  return ots.map((ot, index) => ({
    id: index + 1,
    nroOt: ot,
    nroOtSfs: '',
    statusOt: '',
    statusOtWfx: '',
    fechaUltimaModificacion: '',
    nroTech: '',
    nombreTech: '',
    codigoSolucion: '',
    empresaContratista: '',
    baseTecnica: '',
    pais: '',
    actividades: '',
    ubicacionOt: ''
  }))
}

export const useBusquedaOtsStore = defineStore('busquedaOts', {
  state: () => ({
    loading: false,
    error: '',
    otsText: '',
    rows: []
  }),
  getters: {
    ots: (state) => normalizeOtList(state.otsText),
    hasRows: (state) => state.rows.length > 0
  },
  actions: {
    clear() {
      this.otsText = ''
      this.rows = []
      this.error = ''
    },

    async search() {
      this.loading = true
      this.error = ''

      try {
        const ots = normalizeOtList(this.otsText)

        if (!ots.length) {
          this.rows = []
          return { status: false, message: 'Debe ingresar al menos una OT.' }
        }

        /*
         * ================================================================
         * ACA TIENE QUE CONECTAR EL BACKEND - BUSQUEDA DE OTS
         * ================================================================
         * Pantalla legacy actual:
         * /FM/busquedaOtsGcc.html
         *
         * Datos disponibles para enviar:
         * - ots: lista de OTs separadas por coma ya normalizadas.
         *
         * Reemplazar este bloque por el servicio real cuando este disponible.
         * La respuesta debe mapearse a la estructura usada por
         * busquedaOtsColumns.js.
         */
        this.rows = createMockRows(ots)
        return { status: true, rows: this.rows }
      } catch (error) {
        this.error = 'Error al consultar las órdenes de trabajo.'
        this.rows = []
        return { status: false, error }
      } finally {
        this.loading = false
      }
    }
  }
})
