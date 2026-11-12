import { API_URL } from './api'
import type { ResultadoPaginado } from '../types/datatable'
import type { Curso } from '../types/curso'
import type { Leccion } from '../types/leccion'

export interface PagoAdmin { cursoId: number; curso: string; guidId: string; cliente: string; montoPagado: number; moneda: string; estado: string; fechaPago?: string }
export interface InscripcionAdmin { inscripcionId: number; userId: string; nombreCompleto: string; cursoId: number; titulo: string; categoria: string; fechaInscripcion: string }

async function solicitud(endpoint: string, token: string) {
  const response = await fetch(`${API_URL}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('No se pudo cargar la información.')
  return response.json()
}

async function enviarCurso(endpoint: string, metodo: 'POST' | 'PUT', formulario: FormData, token: string) {
  const response = await fetch(`${API_URL}${endpoint}`, { method: metodo, headers: { Authorization: `Bearer ${token}` }, body: formulario })
  if (!response.ok) throw new Error('No se pudo guardar el curso.')
  return response.status === 204 ? null : response.json()
}

async function enviarLeccion(endpoint: string, metodo: 'POST' | 'PUT', datos: object, token: string) {
  const response = await fetch(`${API_URL}${endpoint}`, { method: metodo, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(datos) })
  if (!response.ok) throw new Error('No se pudo guardar la lección.')
  return response.status === 204 ? null : response.json()
}

export function obtenerPagos(token: string, start = 0) { return solicitud(`/api/pagos?start=${start}&length=6`, token) as Promise<ResultadoPaginado<PagoAdmin>> }
export function obtenerInscripciones(token: string, start = 0) { return solicitud(`/api/inscripciones?start=${start}&length=6`, token) as Promise<ResultadoPaginado<InscripcionAdmin>> }
export function obtenerCursosAdmin(token: string, start = 0) { return solicitud(`/api/cursos?start=${start}&length=6`, token) as Promise<ResultadoPaginado<Curso>> }
export function obtenerLeccionesAdmin(cursoId: number, token: string) { return solicitud(`/api/cursos/${cursoId}/lecciones?length=6`, token) as Promise<ResultadoPaginado<Leccion>> }
export function crearCurso(formulario: FormData, token: string) { return enviarCurso('/api/cursos', 'POST', formulario, token) as Promise<Curso> }
export function actualizarCurso(id: number, formulario: FormData, token: string) { return enviarCurso(`/api/cursos/${id}`, 'PUT', formulario, token) }
export function crearLeccion(datos: object, token: string) { return enviarLeccion('/api/lecciones', 'POST', datos, token) }
export function actualizarLeccion(id: number, datos: object, token: string) { return enviarLeccion(`/api/lecciones/${id}`, 'PUT', datos, token) }
