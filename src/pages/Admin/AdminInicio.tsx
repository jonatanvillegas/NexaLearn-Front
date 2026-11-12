import AdminLayout from '../../components/AdminLayout'
import './Admin.css'

export default function AdminInicio() {
  return <AdminLayout title="Panel administrativo"><section className="admin-summary"><article><span>▣</span><div><strong>Cursos</strong><p>Crea cursos y agrega lecciones.</p></div></article><article><span>$</span><div><strong>Pagos</strong><p>Revisa las compras confirmadas.</p></div></article><article><span>☷</span><div><strong>Inscripciones</strong><p>Consulta el historial de alumnos.</p></div></article></section><section className="admin-welcome"><span>NexaLearn</span><h2>Administra tu plataforma desde un solo lugar.</h2><p>Usa el menú lateral para crear contenido o revisar el historial de pagos e inscripciones.</p></section></AdminLayout>
}
