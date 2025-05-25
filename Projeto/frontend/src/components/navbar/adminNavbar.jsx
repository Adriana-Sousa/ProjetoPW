import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff" }}>
      <Link to="/plates" style={{ marginRight: "1rem", color: "#fff" }}>Dashboard</Link>
      <Link to="/plates" style={{ marginRight: "1rem", color: "#fff" }}>Gerenciar Pratos</Link>
      <Link to="/profile" style={{ color: "#fff" }}>Sair</Link>
    </nav>
  );
}