import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { API_URL } from '../../services/api'
import { crearOrdenPago, obtenerCurso, obtenerLecciones, obtenerMiInscripcion, reanudarOrdenPago } from '../../services/cursoService'
import type { Curso } from '../../types/curso'
import type { Leccion } from '../../types/leccion'
import './CursoDetalle.css'

export default function CursoDetalle({ cursoId }: { cursoId: number }) {
  const token = useAuth((state) => state.token)
  const [curso, setCurso] = useState<Curso | null>(null)
  const [lecciones, setLecciones] = useState<Leccion[]>([])
  const [inscrito, setInscrito] = useState(false)
  const [estado, setEstado] = useState<string | undefined>()
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [mostrarDatosPaypal, setMostrarDatosPaypal] = useState(false)

  useEffect(() => {
    Promise.all([obtenerCurso(cursoId), obtenerLecciones(cursoId)]).then(([cursoActual, resultado]) => {
      setCurso(cursoActual)
      setLecciones(resultado.data)
    }).catch((error: unknown) => setMensaje(error instanceof Error ? error.message : 'No se pudo cargar el curso.')).finally(() => setCargando(false))
  }, [cursoId])

  useEffect(() => {
    if (!token) return
    obtenerMiInscripcion(cursoId, token).then((respuesta) => {
      setInscrito(respuesta.inscrito)
      setEstado(respuesta.estado)
    }).catch(() => undefined)
  }, [cursoId, token])

  async function pagar() {
    if (!token) { window.location.assign('/login'); return }
    setMostrarDatosPaypal(true)
  }

  async function irAPayPal() {
    if (!token) return
    try {
      const orden = await crearOrdenPago(cursoId, token)
      window.location.assign(orden.approvalUrl)
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo crear la orden de pago.')
    }
  }

  async function copiar(texto: string) {
    await navigator.clipboard.writeText(texto)
    setMensaje('Dato copiado. Úsalo en la ventana de PayPal.')
  }

  async function completarPagoPendiente() {
    if (!token) return
    try {
      const orden = await reanudarOrdenPago(cursoId, token)
      if (orden.completado) {
        setEstado(orden.estado)
        setMensaje('Pago confirmado. Ya tienes acceso al curso.')
      } else if (orden.approvalUrl) {
        window.location.assign(orden.approvalUrl)
      }
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo retomar el pago.')
    }
  }

  if (cargando) return <p className="course-detail__status">Cargando curso...</p>
  if (!curso) return <p className="course-detail__status">{mensaje || 'Curso no encontrado.'}</p>

  const pagoPendiente = inscrito && estado === 'PENDIENTE'
  return <div className="course-detail"><Navbar /><main><section className="course-detail__hero"><img src={`${API_URL}/api/cursos/${curso.id}/imagen`} alt={`Imagen de ${curso.titulo}`} /><div><a href="/home">← Volver a cursos</a><span>Curso online</span><h1>{curso.titulo}</h1><p>{curso.descripcion || 'Curso preparado para aprender de forma clara y práctica.'}</p><strong>US$ {curso.precio.toFixed(2)}</strong>{pagoPendiente ? <><p className="course-detail__owned">Tienes un pago pendiente para este curso.</p><button onClick={completarPagoPendiente}>Completar pago pendiente</button></> : inscrito ? <p className="course-detail__owned">Ya tienes este curso{estado ? ` (${estado})` : ''}.</p> : <button onClick={pagar}>{token ? 'Pagar y obtener curso' : 'Inicia sesión para obtenerlo'}</button>}{mensaje && <p className="course-detail__error">{mensaje}</p>}</div></section><section className="course-detail__lessons"><header><span>Contenido</span><h2>Lecciones del curso</h2></header>{lecciones.length === 0 ? <p>No hay lecciones disponibles todavía.</p> : <ol>{lecciones.map((leccion) => <li key={leccion.id}><span>{leccion.orden}</span><div><h3>{leccion.titulo}</h3><p>{leccion.descripcion || 'Lección disponible dentro del curso.'}</p></div></li>)}</ol>}</section></main>{mostrarDatosPaypal && <div className="paypal-modal-backdrop"><section className="paypal-modal"><button className="paypal-modal__close" onClick={() => setMostrarDatosPaypal(false)}>×</button><span>Prueba de PayPal</span><h2>Datos para realizar el pago</h2><p>Usa esta cuenta sandbox únicamente para probar la compra.</p><div><label>Correo<input value="sb-qwufd53800471@personal.example.com" readOnly /><button onClick={() => copiar('sb-qwufd53800471@personal.example.com')}>Copiar</button></label><label>Contraseña<input value="iV2LY.E" readOnly /><button onClick={() => copiar('iV2LY.E')}>Copiar</button></label></div><footer><button className="paypal-modal__cancel" onClick={() => setMostrarDatosPaypal(false)}>Cancelar</button><button onClick={irAPayPal}>Continuar a PayPal</button></footer></section></div>}<Footer /></div>
}
