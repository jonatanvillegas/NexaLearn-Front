import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { obtenerCategorias } from '../../services/categoriaService'
import { obtenerCursos } from '../../services/cursoService'
import type { Categoria } from '../../types/categoria'
import type { Curso } from '../../types/curso'
import './Home.css'

export default function Home() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [cargandoCategorias, setCargandoCategorias] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerCursos()
      .then(setCursos)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los cursos.'))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    obtenerCategorias()
      .then(setCategorias)
      .finally(() => setCargandoCategorias(false))
  }, [])

  return (
    <div className="home-page">
      <Navbar />
      <main>
        <section className="home-hero">
          <p className="home-hero__tag">Aprende con NexaLearn</p>
          <h1>Conocimiento que te acompaña a crecer.</h1>
          <p>Explora cursos claros, prácticos y creados para avanzar paso a paso.</p>
          <a className="home-hero__button" href="#cursos">Explorar cursos</a>
          <div className="home-hero__stats" aria-label="Beneficios de NexaLearn">
            <article><strong>+20</strong><span>Cursos disponibles</span></article>
            <article><strong>100%</strong><span>A tu propio ritmo</span></article>
            <article><strong>24/7</strong><span>Acceso a tus lecciones</span></article>
          </div>
        </section>

        <section className="courses-section" id="cursos">
          <header className="section-heading"><span>Catálogo</span><h2>Cursos para seguir avanzando</h2><p>Elige el tema que quieres aprender hoy.</p></header>
          {cargando && <p className="courses-status">Cargando cursos...</p>}
          {error && <p className="courses-status courses-status--error">{error}</p>}
          {!cargando && !error && (
            <div className="course-grid">
              {cursos.map((curso) => (
                <article className="course-card" key={curso.id}>
                  <div className="course-card__cover"><span>{curso.titulo.charAt(0).toUpperCase()}</span></div>
                  <div className="course-card__content">
                    <span className="course-card__label">Curso online</span>
                    <h3>{curso.titulo}</h3>
                    <p>{curso.descripcion || 'Aprende con lecciones prácticas y contenido preparado para ti.'}</p>
                    <footer><strong>US$ {curso.precio.toFixed(2)}</strong><button type="button">Ver curso</button></footer>
                  </div>
                </article>
              ))}
              {cursos.length === 0 && <p className="courses-status">Aún no hay cursos disponibles.</p>}
            </div>
          )}
        </section>

        <section className="home-categories"><header className="section-heading"><span>Explora</span><h2>Encuentra tu próximo reto</h2></header><div>
          {cargandoCategorias && <p className="courses-status">Cargando categorías...</p>}
          {!cargandoCategorias && categorias.map((categoria) => <article key={categoria.id}><strong>{categoria.nombre}</strong><span>{categoria.descripcion || 'Explora cursos de esta categoría.'}</span></article>)}
          {!cargandoCategorias && categorias.length === 0 && <p className="courses-status">Aún no hay categorías disponibles.</p>}
        </div></section>
        <section className="home-community" id="comunidad"><header className="section-heading"><span>Comunidad</span><h2>Aprende acompañado</h2></header><div className="community-list"><article><i>AM</i><h3>Avanza a tu ritmo</h3><p>Organiza tu aprendizaje según tu propio tiempo.</p></article><article><i>NL</i><h3>Contenido claro</h3><p>Lecciones directas para aplicar lo aprendido.</p></article><article><i>+</i><h3>Crece cada día</h3><p>Construye nuevas habilidades paso a paso.</p></article></div></section>
      </main>
      <Footer />
    </div>
  )
}
