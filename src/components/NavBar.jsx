import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { CartWidget } from "./CarWidget";
import { AuthContext } from "../Context/authContext";
import { Logo } from "./Logo";

const API_URL = import.meta.env.VITE_API_URL;

export const NavBar = () => {
  const { user, loadingAuth, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  // Sugerencias mientras se escribe (estilo matiasherramientas.com.ar):
  // debounce corto para no pegarle una request al backend por cada tecla.
  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/products?search=${encodeURIComponent(query)}&limit=6`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.payload || []))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Cierra el dropdown al clickear afuera.
  useEffect(() => {
    const onClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    setShowSuggestions(false);
    navigate(`/buscar/${encodeURIComponent(search.trim())}`);
  };

  const goToSuggestion = (id) => {
    setShowSuggestions(false);
    setSearch("");
    navigate(`/item/${id}`);
  };

  return (
    <>
      {/* Franja de promo, con mensajes rotando (como matiasherramientas.com.ar).
          Nada de envolver esto en un <div> de vuelta: "sticky" solo puede
          "pegarse" dentro de la altura de su contenedor padre — con un div
          angosto (apenas el alto del header) alrededor, se despegaba en
          cuanto pasabas esa altura. Como hijo directo de donde sea que se
          use <NavBar/>, queda pegado en todo el largo real de la página. */}
      <div
        className="promo-bar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "linear-gradient(90deg, var(--accent-3), var(--accent-2))",
          color: "#0b0b10",
          fontSize: "13px",
          fontWeight: 600,
          padding: "6px 0",
        }}
      >
        <div className="promo-bar-slide">
          <span>Hasta 6 cuotas sin interés</span>
        </div>
        <div className="promo-bar-slide">
          <span>30% OFF con transferencia</span>
        </div>
        <div className="promo-bar-slide">
          <span>Envíos a todo el país</span>
        </div>
        <div className="promo-bar-slide">
          <span>Envíos gratis en Scanners y equipos de Electrónica</span>
          <span style={{ opacity: 0.7, fontWeight: 500 }}>|</span>
          <span>Para compras mayores a $300.000</span>
        </div>
      </div>

      {/* Franja logo + buscador + ingresar/carrito */}
      <div
        style={{
          backgroundColor: "var(--bg-alt)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "14px 24px",
        }}
      >
        <NavLink to="/" className="d-flex align-items-center gap-2" style={{ textDecoration: "none" }}>
          <Logo size={40} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--text)" }}>
            BA <span style={{ color: "var(--accent-2)" }}>HERRAMIENTAS</span>
          </span>
        </NavLink>

        <div ref={searchBoxRef} className="d-flex flex-grow-1" style={{ position: "relative" }}>
          <Form className="d-flex flex-grow-1" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="¿Qué herramienta estás buscando?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
              className="search-input-dark"
              style={{ backgroundColor: "#1A1A24", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <Button type="submit" className="btn-brand ms-2">
              Buscar
            </Button>
          </Form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((p) => (
                <div key={p._id} className="search-suggestion-item" onClick={() => goToSuggestion(p._id)}>
                  <img src={p.thumbnail} alt={p.title} />
                  <div className="search-suggestion-text">
                    <div className="search-suggestion-title">{p.title}</div>
                    <div className="search-suggestion-brand">{p.brand}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loadingAuth && (
          user ? (
            <div className="d-flex align-items-center gap-3" style={{ flexShrink: 0 }}>
              <NavLink to="/mi-cuenta" className="nav-link-custom" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
                Mi cuenta
              </NavLink>
              <NavLink to="/mis-pedidos" className="nav-link-custom" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
                Mis pedidos
              </NavLink>
              {user.role === "admin" && (
                <>
                  <NavLink to="/admin/pedidos" className="nav-link-custom" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
                    Pedidos (admin)
                  </NavLink>
                  <NavLink to="/admin/arrepentimientos" className="nav-link-custom" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
                    Arrepentimientos (admin)
                  </NavLink>
                </>
              )}
              <span onClick={handleLogout} className="nav-link-custom" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                Cerrar sesión
              </span>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3" style={{ flexShrink: 0 }}>
              <NavLink to="/login" className="nav-link-custom" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className="nav-link-custom" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
                Registrarse
              </NavLink>
            </div>
          )
        )}
        <CartWidget />
      </div>

      {/* Franja de navegación principal */}
      <div
        style={{
          backgroundColor: "var(--bg-black)",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          padding: "12px 24px",
        }}
      >
        <NavLink
          to="/"
          end
          className="nav-link-custom"
          style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/productos"
          className="nav-link-custom"
          style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
        >
          Productos
        </NavLink>

        <NavLink
          to="/categorias"
          className="nav-link-custom"
          style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
        >
          Categorías
        </NavLink>

        <NavLink
          to="/marcas"
          className="nav-link-custom"
          style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
        >
          Marcas
        </NavLink>

        <NavLink
          to="/nosotros"
          className="nav-link-custom"
          style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
        >
          Contacto y Envíos
        </NavLink>
      </div>
    </>
  );
};
