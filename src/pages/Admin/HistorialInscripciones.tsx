import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { obtenerInscripciones, type InscripcionAdmin } from '../../services/adminService'
import './Admin.css'

export default function HistorialInscripciones() {
  const token = useAuth((state) => state.token)
  const [inscripciones, setInscripciones] = useState<InscripcionAdmin[]>([])
  const [pagina, setPagina] = useState(0)
  const [total, setTotal] = useState(0)
  useEffect(() => { if (token) obtenerInscripciones(token, pagina * 6).then((respuesta) => { setInscripciones(respuesta.data); setTotal(respuesta.recordsFiltered) }) }, [pagina, token])
  const paginas = Math.ceil(total / 6)
  return <AdminLayout title="Historial de inscripciones"><div className="admin-table-card"><table><thead><tr><th>Alumno</th><th>Curso</th><th>Categoría</th><th>Fecha</th></tr></thead><tbody>{inscripciones.map((inscripcion) => <tr key={inscripcion.inscripcionId}><td>{inscripcion.nombreCompleto}</td><td>{inscripcion.titulo}</td><td><span className="status">{inscripcion.categoria}</span></td><td>{new Date(inscripcion.fechaInscripcion).toLocaleDateString()}</td></tr>)}{inscripciones.length === 0 && <tr><td colSpan={4}>No hay inscripciones registradas.</td></tr>}</tbody></table>{paginas > 1 && <div className="admin-pagination"><button disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}>Anterior</button><span>{pagina + 1} / {paginas}</span><button disabled={pagina + 1 === paginas} onClick={() => setPagina(pagina + 1)}>Siguiente</button></div>}</div></AdminLayout>
}
