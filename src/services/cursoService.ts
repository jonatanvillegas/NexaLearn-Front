import { API_URL } from './api'
import type { Curso } from '../types/curso'

export const cursoEndpoint = `${API_URL}/api/cursos`

export async function obtenerCursos() {
  const response = await fetch(cursoEndpoint)
  if (!response.ok) throw new Error('No se pudieron cargar los cursos.')
  return response.json() as Promise<Curso[]>
}
