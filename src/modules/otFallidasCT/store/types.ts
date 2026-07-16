export interface Filters {
    nroOT: string
    fechaDesde: Date | null
    fechaHasta: Date | null
    contratista: string
    descError: string
    excluida: string
    pais: string
}
export interface Row {
    id: number
    nroOrdenTrabajo: string
    fechaCierre: string
    tareaCodigo: string
    direccion: string
    ciudad: string
    provincia: string
    region: string
    pais: string
    contratista: string
    tecnicoCierre: string
    actividades: string
    sistemaOrigen: string
    errorDescripcion: string
    excluida: string
    motivoExclusion: string
    nota: string
    tieneNota: string
    incluirExp: string
    incluir: string
}

export interface Motivo {
    name: string
}

export interface StoreState {
  activeTab: string[]  
  filters: Filters
  validFilters: boolean
  rows: Row[]
  motivos: Motivo[]
  selectedRows: number[]
  loading: boolean
}
export interface ActionResponse {
    status: boolean
    respuesta: string
}

export const emptyFilters = (): Filters => ({
  nroOT: '',
  fechaDesde: null,
  fechaHasta: null,
  contratista: '',
  descError: '',
  excluida: '',
  pais: '',
})
