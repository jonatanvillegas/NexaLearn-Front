import Login from '../pages/Login/Login'
import Registro from '../pages/Registro/Registro'
import Home from '../pages/Home/Home'

export default function AppRoutes() {
  const path = window.location.pathname.toLowerCase()
  if (path === '/login') return <Login />
  if (path === '/registro') return <Registro />
  return <Home />
}
