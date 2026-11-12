import { useState, type FormEvent } from 'react'
import AuthLayout from '../../components/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import { iniciarSesion } from '../../services/authService'
import './Login.css'

export default function Login() {
  const guardarSesion = useAuth((state) => state.iniciarSesion)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const datos = new FormData(event.currentTarget)
    setCargando(true)
    setMensaje('')

    try {
      const sesion = await iniciarSesion({
        email: String(datos.get('email') ?? ''),
        password: String(datos.get('password') ?? ''),
      })
      guardarSesion(sesion)
      window.location.assign(sesion.roles.includes('Admin') ? '/admin' : '/home')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back!" description="Ingresa tus credenciales para continuar.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Correo electrónico
          <input type="email" name="email" placeholder="tu@correo.com" autoComplete="email" required />
        </label>
        <label>Contraseña
          <input type="password" name="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" required />
        </label>
        <button type="submit" disabled={cargando}>{cargando ? 'Ingresando...' : 'Iniciar sesión'}</button>
        {mensaje && <p className={`auth-form__message ${mensaje.includes('correctamente') ? 'is-success' : ''}`} role="alert">{mensaje}</p>}
      </form>
      <p className="auth-switch">¿No tienes una cuenta? <a href="/registro">Regístrate ahora</a></p>
    </AuthLayout>
  )
}
