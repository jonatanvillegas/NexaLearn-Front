import type { ReactNode } from "react";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <section className="auth-layout__welcome">
        <a
          className="brand"
          href="/login"
          aria-label="NexaLearn, ir a iniciar sesión"
        >
          <span className="brand__mark">N</span>
          <span>NexaLearn</span>
        </a>
        <div className="auth-layout__message">
          <span className="auth-layout__eyebrow">Aprende sin límites</span>
          <h1>NexaLearn!</h1>
          <p>
            Descubre cursos prácticos y avanza a tu ritmo, desde cualquier
            lugar.
          </p>
        </div>
      </section>
      <section className="auth-layout__form-area">
        <div className="auth-card">
          <a className="auth-card__mobile-brand brand" href="/login">
            <span className="brand__mark">N</span>
            <span>NexaLearn</span>
          </a>
          <header>
            <h2>{title}</h2>
            <p>{description}</p>
          </header>
          {children}
        </div>
      </section>
    </main>
  );
}
