import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import "./AdminLayout.css";

export default function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const usuario = useAuth((state) => state.usuario);
  const cerrarSesion = useAuth((state) => state.cerrarSesion);

  function salir() {
    cerrarSesion();
    window.location.assign("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">
          <span>N</span>NexaLearn
        </a>
        <nav>
          <a href="/admin">⌂ Inicio</a>
          <a href="/admin/cursos">▣ Crear curso</a>
          <a href="/admin/pagos">$ Historial de pagos</a>
          <a href="/admin/inscripciones">☷ Inscripciones</a>
        </nav>
      </aside>
      <section className="admin-content">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <div>
            <span>{usuario?.email}</span>
            <button onClick={salir}>Salir</button>
          </div>
        </header>
        <main>{children}</main>
      </section>
    </div>
  );
}
