export interface Usuario {
  id: string
  email: string
  roles: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroRequest extends LoginRequest {
  nombre: string
  apellido: string
}

export interface SesionResponse {
  token: string
  expiration: string
  userId: string
  email: string
  roles: string[]
}
