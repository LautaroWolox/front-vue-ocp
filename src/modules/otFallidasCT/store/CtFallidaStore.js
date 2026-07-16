import { defineStore } from 'pinia'

const baseRows = [
  { id: 1, nroOrdenTrabajo: 'ICD12482236', fechaCierre: '18/10/2022 15:24', tareaCodigo: 'RCD13', direccion: 'SOLIS 329', ciudad: 'ROSARIO', provincia: 'SANTA FE', region: 'Litoral', pais: 'ARG', contratista: 'MOVITEL SERVICIOS', tecnicoCierre: '51ROR123', actividades: 'RED - COBRE - PN', sistemaOrigen: 'ICD', errorDescripcion: 'Falta parametrizacion', excluida: 'S', motivoExclusion: 'Parametrización', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 2, nroOrdenTrabajo: 'ICD12273196', fechaCierre: '11/10/2022 12:50', tareaCodigo: 'RCD13', direccion: 'MAGALLANES 283', ciudad: 'ROSARIO', provincia: 'SANTA FE', region: 'Litoral', pais: 'ARG', contratista: 'MOVITEL SERVICIOS', tecnicoCierre: '51ROR123', actividades: 'RED - COBRE - PN', sistemaOrigen: 'ICD', errorDescripcion: 'Falta parametrizacion', excluida: 'S', motivoExclusion: 'Parametrización', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 3, nroOrdenTrabajo: 'J0000000000001', fechaCierre: '18/10/2022 11:01', tareaCodigo: '9CDS0', direccion: 'AV ALTE BROWN 1234', ciudad: 'CARCARAÑÁ', provincia: 'SANTA FE', region: 'Litoral', pais: 'ARG', contratista: 'CONSTRUCCIONES DEL LITORAL', tecnicoCierre: 'u595116', actividades: 'Probar Instalacion', sistemaOrigen: 'ICD', errorDescripcion: 'org.springframework error', excluida: 'S', motivoExclusion: 'Error técnico', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 4, nroOrdenTrabajo: 'ICD12252822', fechaCierre: '08/10/2022 09:24', tareaCodigo: 'RCD13', direccion: 'BERMUDEZ AV 63', ciudad: 'ROSARIO', provincia: 'SANTA FE', region: 'Litoral', pais: 'ARG', contratista: 'MOVITEL SERVICIOS', tecnicoCierre: '51ROR118', actividades: 'RED - COBRE - PN', sistemaOrigen: 'ICD', errorDescripcion: 'Falta parametrizacion', excluida: 'S', motivoExclusion: 'Parametrización', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 5, nroOrdenTrabajo: '707405355', fechaCierre: '13/09/2022 10:04', tareaCodigo: 'GIACN', direccion: 'PERON JUAN DOMINGO 123', ciudad: 'RESISTENCIA', provincia: 'CHACO', region: 'Litoral', pais: 'ARG', contratista: 'BAPIRAM S.A.', tecnicoCierre: 'U917881', actividades: 'Instalar Acometida', sistemaOrigen: 'OPEN', errorDescripcion: 'No se obtuvo provisión', excluida: 'N', motivoExclusion: '', nota: '', tieneNota: false, incluir: '', incluirExp: '' },
  { id: 6, nroOrdenTrabajo: 'LMA00048490', fechaCierre: '08/08/2022 11:24', tareaCodigo: '9AM01', direccion: 'RICARDO GUTIERREZ 456', ciudad: 'ING MASCHWITZ', provincia: 'BUENOS AIRES', region: 'AMBA', pais: 'ARG', contratista: 'OBRA CIVIL INTEGRAL', tecnicoCierre: '23SRR107', actividades: 'Service tecnico dist', sistemaOrigen: 'LMA', errorDescripcion: 'Falta parametrizacion', excluida: 'S', motivoExclusion: 'Parametrización', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 7, nroOrdenTrabajo: '711397914', fechaCierre: '03/10/2022 14:18', tareaCodigo: '9DS02', direccion: 'CHARACATO 5413', ciudad: 'CORDOBA', provincia: 'CORDOBA', region: 'Mediterranea', pais: 'ARG', contratista: 'CARRANZA HECT', tecnicoCierre: '43CSD342', actividades: '595 - Reparar Falla', sistemaOrigen: 'OPEN', errorDescripcion: 'Error al intentar instalar', excluida: 'S', motivoExclusion: 'Instalación', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 8, nroOrdenTrabajo: '706020499', fechaCierre: '13/09/2022 15:15', tareaCodigo: '9DSCP', direccion: 'CHILE 1326', ciudad: 'TIGRE', provincia: 'BUENOS AIRES', region: 'AMBA', pais: 'ARG', contratista: 'BRARTEL S.R.L.', tecnicoCierre: '23SRD210', actividades: 'CONTROL DE CLA', sistemaOrigen: 'OPEN', errorDescripcion: 'Falta parametrizacion', excluida: 'N', motivoExclusion: '', nota: '', tieneNota: false, incluir: '', incluirExp: '' },
  { id: 9, nroOrdenTrabajo: '710079515', fechaCierre: '11/10/2022 15:46', tareaCodigo: '9DSCR', direccion: 'BILLOCH JOSE M', ciudad: 'TIGRE', provincia: 'BUENOS AIRES', region: 'AMBA', pais: 'ARG', contratista: 'BRARTEL S.R.L.', tecnicoCierre: '23SRD210', actividades: 'CONTROL DE CLA', sistemaOrigen: 'OPEN', errorDescripcion: 'Falta parametrizacion', excluida: 'S', motivoExclusion: 'Parametrización', nota: '', tieneNota: false, incluir: 'RECUPERAR', incluirExp: 'RECUPERAR' },
  { id: 10, nroOrdenTrabajo: 'ICD11798207', fechaCierre: '13/09/2022 10:06', tareaCodigo: 'RCD13', direccion: 'ISOLA BIS 141', ciudad: 'ROSARIO', provincia: 'SANTA FE', region: 'Litoral', pais: 'ARG', contratista: 'MOVITEL SERVICIOS', tecnicoCierre: '51ROR122', actividades: 'RED - COBRE - PN', sistemaOrigen: 'ICD', errorDescripcion: 'Falta parametrizacion', excluida: 'N', motivoExclusion: '', nota: '', tieneNota: false, incluir: '', incluirExp: '' },
  { id: 11, nroOrdenTrabajo: 'ICD12001111', fechaCierre: '22/09/2022 08:15', tareaCodigo: 'RCD13', direccion: 'SAN MARTIN 800', ciudad: 'LA PLATA', provincia: 'BUENOS AIRES', region: 'AMBA', pais: 'UY', contratista: 'MOVITEL SERVICIOS', tecnicoCierre: '51ROR125', actividades: 'RED - COBRE - PN', sistemaOrigen: 'ICD', errorDescripcion: 'Falta parametrizacion', excluida: 'N', motivoExclusion: '', nota: '', tieneNota: false, incluir: '', incluirExp: '' },
  { id: 12, nroOrdenTrabajo: 'OPEN884512', fechaCierre: '27/09/2022 17:33', tareaCodigo: '9DSCP', direccion: 'LAPRIDA 450', ciudad: 'MORON', provincia: 'BUENOS AIRES', region: 'AMBA', pais: 'PY', contratista: 'BRARTEL S.R.L.', tecnicoCierre: '23SRD211', actividades: 'CONTROL DE CLA', sistemaOrigen: 'OPEN', errorDescripcion: 'No se obtuvo provisión', excluida: 'N', motivoExclusion: '', nota: '', tieneNota: false, incluir: '', incluirExp: '' }
]

const blankOption = { name: '', code: '' }
const emptyFilters = () => ({ nroOt: '', fechaDesde: null, fechaHasta: null, contratista: null, descripcionError: '', excluida: null, pais: null })
const toOption = (name) => ({ name, code: name })
const uniqueOptions = (field) => [blankOption, ...new Set(baseRows.map((row) => row[field]).filter(Boolean))].map((item) => typeof item === 'string' ? toOption(item) : item)
const contratistaOptions = uniqueOptions('contratista')
const paisOptions = [blankOption, { name: 'ARG', code: 'ARG' }, { name: 'UY', code: 'UY' }, { name: 'PY', code: 'PY' }]
const excluidaOptions = [blankOption, { name: 'Si', code: 'S' }, { name: 'No', code: 'N' }]
const waitForLoader = (ms = 650) => new Promise((resolve) => window.setTimeout(resolve, ms))

const normalizeText = (value) => String(value || '').toLowerCase()
const normalizeRow = (row) => {
  const isExcluded = row.excluida === 'S'
  return {
    ...row,
    tieneNota: Boolean(row.nota),
    incluir: isExcluded ? 'RECUPERAR' : '',
    incluirExp: isExcluded ? 'RECUPERAR' : ''
  }
}

const parseDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (!match) return null
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
}

const isDateInRange = (rowDateValue, fromValue, toValue) => {
  const rowDate = parseDate(rowDateValue)
  const fromDate = parseDate(fromValue)
  const toDate = parseDate(toValue)
  if (!rowDate) return true
  if (fromDate && rowDate < fromDate) return false
  if (toDate && rowDate > toDate) return false
  return true
}

export const useFallidasCtStore = defineStore('fallidasCt', {
  state: () => ({
    loading: false,
    activeTab: ['0', '1'],
    filters: emptyFilters(),
    rows: [],
    selectedRows: [],
    contratistaOptions,
    paisOptions,
    excluidaOptions,
    motivos: [
      { name: 'PAGO DUPLICADO', code: 'PAGO_DUPLICADO' },
      { name: 'Falta parametrización', code: 'PARAM' },
      { name: 'Error técnico', code: 'ERROR_TECNICO' },
      { name: 'No corresponde reproceso', code: 'NO_REPROCESO' }
    ]
  }),
  getters: {
    contratistas: (state) => state.contratistaOptions,
    paises: (state) => state.paisOptions,
    excluidas: (state) => state.excluidaOptions,
    getNotExcluded: (state) => state.rows.filter((row) => state.selectedRows.includes(row.id) && row.excluida !== 'S')
  },
  actions: {
    async setData() {
      this.loading = true
      try {
        await waitForLoader()
        this.rows = baseRows.map((row) => normalizeRow(row))
      } finally {
        this.loading = false
      }
    },

    async setMotivos() {
      return this.motivos
    },

    setSelectedRows(ids) {
      const selectableIds = this.rows.filter((row) => row.excluida !== 'S').map((row) => row.id)
      this.selectedRows = ids.filter((id) => selectableIds.includes(id))
    },

    toggleSelectedRow(row) {
      if (!row || row.excluida === 'S') return
      const index = this.selectedRows.indexOf(row.id)
      if (index >= 0) this.selectedRows.splice(index, 1)
      else this.selectedRows.push(row.id)
    },

    clearFilters() {
      this.filters = emptyFilters()
      this.selectedRows = []
    },

    async search() {
      this.loading = true
      try {
        // ACA TIENE QUE CONECTAR EL BACKEND - BUSCAR OTS FALLIDAS CT
        // Reemplazar el filtro local por la llamada real y mapear la respuesta
        // a la misma estructura de rows usada por columns.js.
        await waitForLoader()
        const f = this.filters
        this.rows = baseRows.filter((row) => {
          return (!f.nroOt || normalizeText(row.nroOrdenTrabajo).includes(normalizeText(f.nroOt)))
            && isDateInRange(row.fechaCierre, f.fechaDesde, f.fechaHasta)
            && (!f.contratista?.code || row.contratista === f.contratista.code)
            && (!f.descripcionError || normalizeText(row.errorDescripcion).includes(normalizeText(f.descripcionError)))
            && (!f.excluida?.code || row.excluida === f.excluida.code)
            && (!f.pais?.code || row.pais === f.pais.code)
        }).map((row) => normalizeRow(row))
        this.selectedRows = []
      } finally {
        this.loading = false
      }
    },

    async updateNota(row, nota) {
      // ACA TIENE QUE CONECTAR EL BACKEND - GUARDAR NOTA DE OT
      const target = this.rows.find((item) => item.id === row?.id)
      if (target) {
        target.nota = nota || ''
        target.tieneNota = Boolean(target.nota)
      }
      return { status: true }
    },

    async sendExcluidas(rows, motivo, comentario) {
      // ACA TIENE QUE CONECTAR EL BACKEND - EXCLUIR OTS
      rows.forEach((row) => {
        const target = this.rows.find((item) => item.id === row.id)
        if (target) {
          target.excluida = 'S'
          target.motivoExclusion = motivo?.name || motivo || ''
          target.nota = comentario || target.nota
          target.tieneNota = Boolean(target.nota)
          target.incluir = 'RECUPERAR'
          target.incluirExp = 'RECUPERAR'
        }
      })
      this.selectedRows = []
      return { status: true }
    },

    async incluir(row, motivo, comentario) {
      // ACA TIENE QUE CONECTAR EL BACKEND - INCLUIR / RECUPERAR OT
      const target = this.rows.find((item) => item.id === row?.id)
      if (target) {
        target.excluida = 'N'
        target.motivoExclusion = ''
        target.nota = comentario || target.nota
        target.tieneNota = Boolean(target.nota)
        target.incluir = ''
        target.incluirExp = ''
      }
      return { status: true }
    },

    async reprocesar() {
      // ACA TIENE QUE CONECTAR EL BACKEND - REPROCESAR OTS
      const selectedOts = this.rows.filter((row) => this.selectedRows.includes(row.id))
      this.selectedRows = []
      return { status: true, rows: selectedOts }
    }
  }
})
