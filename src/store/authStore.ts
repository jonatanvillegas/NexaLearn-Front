import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SesionResponse, Usuario } from '../types/usuario'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  expiraEn: string | null
  iniciarSesion: (sesion: SesionResponse) => void
  cerrarSesion: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      expiraEn: null,
      iniciarSesion: (sesion) => set({
        token: sesion.token,
        expiraEn: sesion.expiration,
        usuario: { id: sesion.userId, email: sesion.email, roles: sesion.roles },
      }),
      cerrarSesion: () => set({ token: null, usuario: null, expiraEn: null }),
    }),
    { name: 'nexalearn-auth' },
  ),
)

export default useAuthStore
