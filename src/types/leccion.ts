export interface Leccion {
  id: number
  cursoId: number
  titulo: string
  descripcion?: string
  contenido?: string
  videoUrl?: string
  orden: number
  estado: boolean
}
