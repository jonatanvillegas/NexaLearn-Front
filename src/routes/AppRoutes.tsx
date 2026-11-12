import Login from '../pages/Login/Login'
import Registro from '../pages/Registro/Registro'
import Home from '../pages/Home/Home'
import CursoDetalle from '../pages/Cursos/CursoDetalle'
import PagoConfirmado from '../pages/Cursos/PagoConfirmado'
import AdminInicio from '../pages/Admin/AdminInicio'
import CrearCurso from '../pages/Admin/CrearCurso'
import GestionLecciones from '../pages/Admin/GestionLecciones'
import HistorialPagos from '../pages/Admin/HistorialPagos'
import HistorialInscripciones from '../pages/Admin/HistorialInscripciones'
import { useAuth } from '../hooks/useAuth'

export default function AppRoutes() {
  const path = window.location.pathname.toLowerCase()
  const usuario = useAuth((state) => state.usuario)
  if (path === '/login') return <Login />
  if (path === '/registro') return <Registro />
  if (path === '/pago/confirmado') return <PagoConfirmado />
  if (path.startsWith('/admin')) {
    if (!usuario?.roles.includes('Admin')) return <p>Esta sección es solo para administradores.</p>
    const lecciones = path.match(/^\/admin\/cursos\/(\d+)\/lecciones$/)
    if (lecciones) return <GestionLecciones cursoId={Number(lecciones[1])} />
    if (path === '/admin/cursos') return <CrearCurso />
    if (path === '/admin/pagos') return <HistorialPagos />
    if (path === '/admin/inscripciones') return <HistorialInscripciones />
    return <AdminInicio />
  }
  const curso = path.match(/^\/cursos\/(\d+)$/)
  if (curso) return <CursoDetalle cursoId={Number(curso[1])} />
  return <Home />
}
