import { defineStore } from 'pinia'

const waitForLoader = (ms = 550) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const useCmoActividadStore = defineStore('cmoActividad', {
  state: () => ({
    loading: false,
    searched: false,
    rows: [],
    selectedRow: null
  }),

  getters: {
    hasSelection: (state) => Boolean(state.selectedRow)
  },

  actions: {
    async search() {
      this.loading = true
      this.searched = true
      this.selectedRow = null

      try {
        // ACA TIENE QUE CONECTAR EL BACKEND - BUSCAR RELACIONES CMO-ACTIVIDAD
        // Endpoint legacy estimado:
        // /configuraCmoActividad.html
        // Reemplazar este mock vacío por la llamada real y mapear la respuesta
        // con la misma estructura usada por cmoActividadColumns.
        await waitForLoader()
        this.rows = []
      } finally {
        this.loading = false
      }
    },

    setSelectedRow(row) {
      this.selectedRow = row || null
    },

    clearSelection() {
      this.selectedRow = null
    }
  }
})
