import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <strong>NexaLearn</strong>
      <span>Aprende. Aplica. Crece.</span>
      <small>© {new Date().getFullYear()} NexaLearn</small>
    </footer>
  );
}
