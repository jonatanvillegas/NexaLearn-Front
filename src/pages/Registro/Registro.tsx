import { useState, type FormEvent } from 'react'
import AuthLayout from '../../components/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import { registrar } from '../../services/authService'
import '../Login/Login.css'
import './Registro.css'

export default function Registro() {
  const guardarSesion = useAuth((state) => state.iniciarSesion)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const datos = new FormData(event.currentTarget)
    setCargando(true)
    setMensaje('')

    try {
      const sesion = await registrar({
        nombre: String(datos.get('nombre') ?? ''),
        apellido: String(datos.get('apellido') ?? ''),
        email: String(datos.get('email') ?? ''),
        password: String(datos.get('password') ?? ''),
      })
      guardarSesion(sesion)
      window.location.assign('/home')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo crear la cuenta.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout title="Crea tu cuenta" description="Solo toma un minuto comenzar a aprender.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="registro-fields">
          <label>Nombre<input name="nombre" placeholder="Tu nombre" autoComplete="given-name" required /></label>
          <label>Apellido<input name="apellido" placeholder="Tu apellido" autoComplete="family-name" required /></label>
        </div>
        <label>Correo electrónico<input type="email" name="email" placeholder="tu@correo.com" autoComplete="email" required /></label>
        <label>Contraseña<span className="auth-password"><input type={mostrarContrasena ? 'text' : 'password'} name="password" placeholder="Mínimo 6 caracteres" minLength={6} autoComplete="new-password" required /><button type="button" onClick={() => setMostrarContrasena(!mostrarContrasena)}>{mostrarContrasena ? 'Ocultar' : 'Ver'}</button></span></label>
        <button type="submit" disabled={cargando}>{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        {mensaje && <p className={`auth-form__message ${mensaje.includes('correctamente') ? 'is-success' : ''}`} role="alert">{mensaje}</p>}
      </form>
      <p className="auth-switch">¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
    </AuthLayout>
  )
}
