import { defineStore } from 'pinia'
import { EncryptStorage } from 'encrypt-storage'
import { useFetch } from '@vueuse/core'
import type { Filters, Row, StoreState, ActionResponse, ExcluirRequest } from './types'
import { emptyFilters } from './types'

const clave = import.meta.env.VITE_PARAMETER1 as string
export const fallidasCtStorage = new EncryptStorage(clave, { storageType: 'sessionStorage' })

type SearchResponse =
  | Row[]
  | {
      rows?: Row[]
      content?: Row[]
      items?: Row[]
      data?: Row[]
      resultados?: Row[]
    }

const extractRows = (payload: SearchResponse | null | undefined): Row[] => {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const candidates = [
    payload.rows,
    payload.content,
    payload.items,
    payload.data,
    payload.resultados
  ]

  return candidates.find(Array.isArray) ?? []
}

export const useFallidasCtStore = defineStore('fallidasCT', {
  state: (): StoreState => ({
    activeTab: ['0'],
    filters: emptyFilters(),
    rows: [],
    selectedRows: [],
    rowId: null,
    loading: false
  }),

  getters: {
    getRow: (state: StoreState) => (index: number): Row | undefined => state.rows[index],

    selectedNotExcludedRows: (state: StoreState): Row[] =>
      state.selectedRows
        .map((id) => state.rows.find((row) => row.id === id))
        .filter((row): row is Row => row !== undefined)
        .filter((row) => row.excluida !== 'S')
  },

  actions: {
    setFilter<K extends keyof Filters>(key: K, value: Filters[K]): void {
      this.filters[key] = value
    },

    async setData(): Promise<void> {
      if (this.loading) return

      this.loading = true
      this.rows = []
      this.selectedRows = []
      this.rowId = null

      try {
        const { data, error, response } = await useFetch(
          '/pc/registroOTFallidasReproceso/searchFallidas.html'
        )
          .post(this.filters)
          .json<SearchResponse>()

        if (error.value || (response.value?.status && response.value.status >= 400)) {
          console.error('Error buscando OTs fallidas:', error.value)
          return
        }

        this.rows = extractRows(data.value)

        if (!this.activeTab.includes('1')) {
          this.activeTab = [...this.activeTab, '1']
        }
      } finally {
        this.loading = false
      }
    },

    async search(): Promise<void> {
      await this.setData()
    },

    setSelectedRows(rows: number[]): void {
      this.selectedRows = [...new Set(rows)]
    },

    toggleSelectedRow(row: Row): void {
      if (!row || row.excluida === 'S') return

      if (this.selectedRows.includes(row.id)) {
        this.selectedRows = this.selectedRows.filter((id) => id !== row.id)
      } else {
        this.selectedRows = [...this.selectedRows, row.id]
      }
    },

    async sendReproceso(): Promise<ActionResponse> {
      if (!this.selectedRows.length) {
        return { status: false, respuesta: 'No hay OTs seleccionadas.' }
      }

      this.loading = true

      try {
        const { data, error, response } = await useFetch(
          '/pc/registroOTFallidasReproceso/reprocesar.html'
        ).post(this.selectedRows)

        const status = response.value?.status

        if (error.value || (status && status >= 400)) {
          return { status: false, respuesta: String(error.value || `Error ${status}`) }
        }

        if (typeof data.value === 'string' && data.value.trim()) {
          try {
            const parsed = JSON.parse(data.value) as ActionResponse
            if (typeof parsed?.status === 'boolean') return parsed
          } catch {
            return { status: true, respuesta: data.value }
          }
        }

        return { status: true, respuesta: 'Reproceso enviado correctamente.' }
      } finally {
        this.loading = false
      }
    },

    async reprocesar(): Promise<ActionResponse> {
      return this.sendReproceso()
    },

    async sendExcluidas(motivo: string, comentario: string): Promise<ActionResponse> {
      this.loading = true

      try {
        const payload: ExcluirRequest = {
          idOts: this.selectedNotExcludedRows.map((row) => row.id.toString()),
          nota: comentario || null,
          motivoNombreCorto: motivo
        }

        const { data, error, response } = await useFetch(
          '/pc/registroOTFallidasReproceso/excluirOTFallida.html'
        )
          .post(payload)
          .json<ActionResponse>()

        if (error.value || (response.value?.status && response.value.status >= 400)) {
          return { status: false, respuesta: String(error.value || `Error ${response.value?.status}`) }
        }

        if (!data.value) {
          return { status: false, respuesta: 'Respuesta vacía del servidor' }
        }

        return data.value
      } finally {
        this.loading = false
      }
    },

    async sendIncluir(id: number, motivo: string, comentario: string): Promise<ActionResponse> {
      // El frontend recibido no define todavía el endpoint de inclusión.
      // Se conserva la firma para que el diálogo y la integración futura no cambien.
      console.log('Incluir OT pendiente de endpoint:', { id, motivo, comentario })
      return { status: false, respuesta: 'Endpoint de inclusión no configurado.' }
    },

    clearFilters(): void {
      this.filters = emptyFilters()
    },

    clearStore(): void {
      this.$reset()
    }
  },

  persist: [
    {
      // Se cambia la clave para invalidar las 12 filas mock guardadas por la versión anterior.
      // Sólo se persisten filtros y estado visual; nunca resultados ni selecciones.
      key: 'fallidasCTFiltersV2',
      storage: {
        getItem: (key: string): string | null => fallidasCtStorage.getItem(key) ?? null,
        setItem: (key: string, value: string): void => fallidasCtStorage.setItem(key, value)
      },
      pick: ['activeTab', 'filters']
    }
  ]
})
