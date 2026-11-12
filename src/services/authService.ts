import { API_URL } from './api'
import type { LoginRequest, RegistroRequest, SesionResponse } from '../types/usuario'

interface ApiError {
  detail?: string
  mensaje?: string
  errores?: string[]
  errors?: Record<string, string[]>
}

async function obtenerError(response: Response) {
  const error = await response.json().catch(() => ({})) as ApiError
  const validaciones = error.errors ? Object.values(error.errors).flat()[0] : undefined
  return validaciones ?? error.errores?.[0] ?? error.detail ?? error.mensaje ?? 'No se pudo completar la solicitud.'
}

async function enviar<T>(endpoint: string, body: LoginRequest | RegistroRequest) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new Error(await obtenerError(response))
  return response.json() as Promise<T>
}

export function iniciarSesion(input: LoginRequest) {
  return enviar<SesionResponse>('/api/auth/login', input)
}

export function registrar(input: RegistroRequest) {
  return enviar<SesionResponse>('/api/auth/registro', input)
}
