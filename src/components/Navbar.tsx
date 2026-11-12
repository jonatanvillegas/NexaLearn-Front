import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const usuario = useAuth((state) => state.usuario);
  const cerrarSesion = useAuth((state) => state.cerrarSesion);

  function salir() {
    cerrarSesion();
    window.location.assign("/login");
  }

  return (
    <header className="navbar">
      <a className="navbar__brand" href="/home">
        <span>N</span>NexaLearn
      </a>
      <nav className="navbar__links" aria-label="Navegación principal">
        <a href="/home">Inicio</a>
        <a href="#cursos">Cursos</a>
        <a href="#comunidad">Comunidad</a>
        {usuario?.roles.includes("Admin") && (
          <a href="/admin">Administración</a>
        )}
      </nav>
      <div className="navbar__user">
        {usuario ? (
          <>
            <span>{usuario.email}</span>
            <button type="button" onClick={salir}>
              Salir
            </button>
          </>
        ) : (
          <a href="/login">Iniciar sesión</a>
        )}
      </div>
    </header>
  );
}
