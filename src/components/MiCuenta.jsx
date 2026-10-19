import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthContext } from "../Context/authContext";

const tarjeta = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "20px",
};

const fila = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid var(--border)",
  fontSize: "14.5px",
};

export const MiCuenta = () => {
  const { user, loadingAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loadingAuth) return <h3 className="mt-5 text-center">Cargando...</h3>;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: "720px" }}>
      <h2 className="mb-4" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>
        Mi cuenta
      </h2>

      <div style={tarjeta}>
        <div style={fila}>
          <span style={{ color: "var(--text-dim)" }}>Email</span>
          <span>{user.email}</span>
        </div>
        <div style={{ ...fila, borderBottom: "none" }}>
          <span style={{ color: "var(--text-dim)" }}>Tipo de cuenta</span>
          <span>{user.role === "admin" ? "Administrador" : "Cliente"}</span>
        </div>
      </div>

      <div className="d-flex flex-column mt-4" style={{ gap: "10px" }}>
        <Link to="/mis-pedidos" style={{ ...tarjeta, color: "var(--text)", textDecoration: "none" }}>
          Mis pedidos
        </Link>
        <Link to="/" style={{ ...tarjeta, color: "var(--text)", textDecoration: "none" }}>
          Ofertas para socios (las ves en el inicio)
        </Link>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="btn mt-4"
        style={{ border: "1px solid var(--border)", color: "var(--text)", background: "transparent" }}
      >
        Cerrar sesión
      </button>
    </Container>
  );
};
