import { useEffect, useState, type FormEvent } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  actualizarLeccion,
  crearLeccion,
  obtenerLeccionesAdmin,
} from "../../services/adminService";
import { obtenerCurso } from "../../services/cursoService";
import type { Curso } from "../../types/curso";
import type { Leccion } from "../../types/leccion";
import "./Admin.css";

export default function GestionLecciones({ cursoId }: { cursoId: number }) {
  const token = useAuth((state) => state.token);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [leccionEditar, setLeccionEditar] = useState<Leccion | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function cargarLecciones() {
    if (token)
      obtenerLeccionesAdmin(cursoId, token).then((respuesta) =>
        setLecciones(respuesta.data),
      );
  }

  useEffect(() => {
    obtenerCurso(cursoId)
      .then(setCurso)
      .catch(() => setMensaje("No se encontró el curso."));
    cargarLecciones();
  }, [cursoId, token]);

  function abrirCrear() {
    setLeccionEditar(null);
    setMostrarModal(true);
  }

  async function guardarLeccion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const datos = new FormData(event.currentTarget);
    const leccion = {
      cursoId,
      titulo: datos.get("titulo"),
      descripcion: datos.get("descripcion"),
      contenido: datos.get("contenido"),
      videoUrl: datos.get("videoUrl") || null,
      orden: Number(datos.get("orden")),
      estado: true,
    };
    try {
      if (leccionEditar) {
        await actualizarLeccion(leccionEditar.id, leccion, token);
        setMensaje("Lección actualizada correctamente.");
      } else {
        await crearLeccion(leccion, token);
        setMensaje("Lección creada correctamente.");
      }
      setMostrarModal(false);
      cargarLecciones();
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la lección.",
      );
    }
  }

  return (
    <AdminLayout title="Lecciones del curso">
      <div className="admin-page-head">
        <div>
          <a className="admin-back" href="/admin/cursos">
            ← Cursos
          </a>
          <h2>{curso ? curso.titulo : "Lecciones"}</h2>
          <p>Agrega o edita las lecciones de este curso.</p>
        </div>
        <button onClick={abrirCrear}>+ Crear lección</button>
      </div>
      {mensaje && <p className="admin-message">{mensaje}</p>}
      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {lecciones.map((leccion) => (
              <tr key={leccion.id}>
                <td>{leccion.orden}</td>
                <td>{leccion.titulo}</td>
                <td>{leccion.descripcion || "-"}</td>
                <td className="admin-row-actions">
                  <button
                    onClick={() => {
                      setLeccionEditar(leccion);
                      setMostrarModal(true);
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {lecciones.length === 0 && (
              <tr>
                <td colSpan={4}>Este curso aún no tiene lecciones.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {mostrarModal && (
        <div className="admin-modal-backdrop">
          <form className="admin-form admin-modal" onSubmit={guardarLeccion}>
            <header>
              <h2>{leccionEditar ? "Editar lección" : "Nueva lección"}</h2>
              <button
                type="button"
                className="admin-close"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </header>
            <label>
              Título
              <input
                name="titulo"
                required
                defaultValue={leccionEditar?.titulo}
              />
            </label>
            <label>
              Descripción
              <textarea
                name="descripcion"
                rows={3}
                defaultValue={leccionEditar?.descripcion ?? ""}
              />
            </label>
            <label>
              Contenido
              <textarea
                name="contenido"
                rows={5}
                defaultValue={leccionEditar?.contenido ?? ""}
              />
            </label>
            <label>
              URL de video
              <input
                name="videoUrl"
                type="url"
                defaultValue={leccionEditar?.videoUrl ?? ""}
              />
            </label>
            <label>
              Orden
              <input
                name="orden"
                type="number"
                min="1"
                required
                defaultValue={leccionEditar?.orden ?? lecciones.length + 1}
              />
            </label>
            <div className="admin-actions">
              <button type="submit">Guardar</button>
              <button
                type="button"
                className="admin-button--light"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
