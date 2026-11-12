import { API_URL } from './api'
import type { Categoria } from '../types/categoria'
import type { ResultadoPaginado } from '../types/datatable'

export async function obtenerCategorias(start = 0) {
  const response = await fetch(`${API_URL}/api/categorias?start=${start}&length=6`)
  if (!response.ok) throw new Error('No se pudieron cargar las categorías.')
  return response.json() as Promise<ResultadoPaginado<Categoria>>
}
