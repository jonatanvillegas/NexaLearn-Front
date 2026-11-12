import { API_URL } from './api'
import type { Categoria } from '../types/categoria'

export async function obtenerCategorias() {
  const response = await fetch(`${API_URL}/api/categorias`)
  if (!response.ok) throw new Error('No se pudieron cargar las categorías.')
  return response.json() as Promise<Categoria[]>
}
