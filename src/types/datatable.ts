export interface ResultadoPaginado<T> {
  recordsTotal: number
  recordsFiltered: number
  data: T[]
}
