import { useEffect, useState, type FormEvent } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import { obtenerCategorias } from "../../services/categoriaService";
import {
  actualizarCurso,
  crearCurso,
  obtenerCursosAdmin,
} from "../../services/adminService";
import type { Categoria } from "../../types/categoria";
import type { Curso } from "../../types/curso";
import "./Admin.css";

export default function CrearCurso() {
  const token = useAuth((state) => state.token);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoEditar, setCursoEditar] = useState<Curso | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(0);

  function cargarCursos(paginaActual = pagina) {
    if (!token) return;
    obtenerCursosAdmin(token, paginaActual * 6).then((respuesta) => {
      setCursos(respuesta.data);
      setTotal(respuesta.recordsFiltered);
    });
  }

  useEffect(() => {
    obtenerCategorias().then((respuesta) => setCategorias(respuesta.data));
  }, []);
  useEffect(() => {
    cargarCursos();
  }, [token, pagina]);

  function abrirCrear() {
    setCursoEditar(null);
    setMostrarModal(true);
  }

  async function guardarCurso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    try {
      const formulario = new FormData(event.currentTarget);
      if (cursoEditar) {
        await actualizarCurso(cursoEditar.id, formulario, token);
        setMensaje("Curso actualizado correctamente.");
      } else {
        await crearCurso(formulario, token);
        setMensaje("Curso creado correctamente.");
      }
      setMostrarModal(false);
      setPagina(0);
      cargarCursos(0);
    } catch (error) {
      setMensaje(
        error instanceof Error ? error.message : "No se pudo guardar el curso.",
      );
    }
  }

  const paginas = Math.ceil(total / 6);

  return (
    <AdminLayout title="Cursos">
      <div className="admin-page-head">
        <div>
          <h2>Listado de cursos</h2>
          <p>Administra el contenido y sus lecciones.</p>
        </div>
        <button onClick={abrirCrear}>+ Crear curso</button>
      </div>
      {mensaje && <p className="admin-message">{mensaje}</p>}
      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.titulo}</td>
                <td>US$ {curso.precio.toFixed(2)}</td>
                <td>
                  <span className="status">
                    {curso.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="admin-row-actions">
                  <button
                    onClick={() => {
                      setCursoEditar(curso);
                      setMostrarModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `/admin/cursos/${curso.id}/lecciones`;
                    }}
                  >
                    Lecciones
                  </button>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan={4}>No hay cursos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
        {paginas > 1 && (
          <div className="admin-pagination">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina(pagina - 1)}
            >
              Anterior
            </button>
            <span>
              {pagina + 1} / {paginas}
            </span>
            <button
              disabled={pagina + 1 === paginas}
              onClick={() => setPagina(pagina + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      {mostrarModal && (
        <div className="admin-modal-backdrop">
          <form className="admin-form admin-modal" onSubmit={guardarCurso}>
            <header>
              <h2>{cursoEditar ? "Editar curso" : "Nuevo curso"}</h2>
              <button
                type="button"
                className="admin-close"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </header>
            <label>
              Categoría
              <select
                name="CategoriaId"
                required
                defaultValue={cursoEditar?.categoriaId ?? ""}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Título
              <input
                name="Titulo"
                required
                defaultValue={cursoEditar?.titulo}
              />
            </label>
            <label>
              Descripción
              <textarea
                name="Descripcion"
                rows={3}
                defaultValue={cursoEditar?.descripcion ?? ""}
              />
            </label>
            <label>
              Precio en USD
              <input
                name="Precio"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={cursoEditar?.precio}
              />
            </label>
            <label>
              Imagen opcional
              <input name="Imagen" type="file" accept="image/png,image/jpeg" />
            </label>
            <input
              name="Estado"
              type="hidden"
              value={String(cursoEditar?.estado ?? true)}
            />
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
