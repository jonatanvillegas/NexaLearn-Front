import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { capturarOrdenPago } from '../../services/cursoService'
import './PagoConfirmado.css'

export default function PagoConfirmado() {
  const token = useAuth((state) => state.token)
  const orderId = new URLSearchParams(window.location.search).get('token')
  const [mensaje, setMensaje] = useState('Confirmando tu pago...')
  const [correcto, setCorrecto] = useState(false)

  useEffect(() => {
    if (!token) {
      setMensaje('Tu sesión ya no está disponible. Inicia sesión y vuelve a abrir el curso.')
      return
    }
    if (!orderId) {
      setMensaje('No se recibió el identificador de la orden de PayPal.')
      return
    }
    capturarOrdenPago(orderId, token).then(() => {
      setCorrecto(true)
      setMensaje('Pago confirmado. Ya tienes acceso al curso.')
    }).catch((error: unknown) => setMensaje(error instanceof Error ? error.message : 'No se pudo confirmar el pago.'))
  }, [orderId, token])

  return <main className="payment-result"><section><span>{correcto ? '✓' : '…'}</span><h1>{correcto ? 'Compra completada' : 'Procesando pago'}</h1><p>{mensaje}</p><a href={correcto ? '/home' : '/login'}>{correcto ? 'Ir a mis cursos' : 'Volver a iniciar sesión'}</a></section></main>
}
