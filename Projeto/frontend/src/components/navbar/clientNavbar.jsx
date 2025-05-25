import { Link } from "react-router-dom";

export default function ClientNavbar() {
  return (
    <nav style={{ padding: "1rem", background: "#007bff", color: "#fff" }}>
      <Link to="/home" style={{ marginRight: "1rem", color: "#fff" }}>Cardápio</Link>
      <Link to="/profile" style={{ marginRight: "1rem", color: "#fff" }}>Meus Pedidos</Link>
      <Link to="/logout" style={{ color: "#fff" }}>Sair</Link>
    </nav>
  );
}