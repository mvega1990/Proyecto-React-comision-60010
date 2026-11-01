import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { CartWidget } from "./CarWidget";
import { AuthContext } from "../Context/authContext";
import { Logo } from "./Logo";
import { MenuIcon, CloseIcon } from "./icons";

const API_URL = import.meta.env.VITE_API_URL;

export const NavBar = () => {
  const { user, loadingAuth, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  // Cierra el menú mobile solo al cambiar de pantalla (no al abrir/cerrar
  // sesión desde ahí mismo, eso lo maneja handleLogout).
  const closeMenu = () => setMenuOpen(false);

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
    closeMenu();
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
        className="navbar-top-row"
        style={{
          backgroundColor: "var(--bg-alt)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "14px 24px",
        }}
      >
        <NavLink to="/" className="d-flex align-items-center gap-2" style={{ textDecoration: "none", flexShrink: 0 }}>
          <Logo size={40} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--text)" }}>
            BA <span style={{ color: "var(--accent-2)" }}>HERRAMIENTAS</span>
          </span>
        </NavLink>

        {/* minWidth:0 es necesario en los 2 niveles: un hijo flex no se achica
            más chico que su contenido por default, aunque tenga flex-grow-1 -
            sin esto, el buscador empujaba a toda la barra (y por lo tanto a
            toda la página) más ancha que la pantalla en mobile. */}
        <div ref={searchBoxRef} className="d-flex flex-grow-1" style={{ position: "relative", minWidth: 0 }}>
          <Form className="d-flex flex-grow-1" style={{ minWidth: 0 }} onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="¿Qué herramienta estás buscando?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
              className="search-input-dark"
              style={{ backgroundColor: "#1A1A24", borderColor: "var(--border)", color: "var(--text)", minWidth: 0 }}
            />
            <Button type="submit" className="btn-brand ms-2 d-none d-sm-inline-block">
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
            <div className="d-none d-md-flex align-items-center gap-3" style={{ flexShrink: 0 }}>
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
            <div className="d-none d-md-flex align-items-center gap-3" style={{ flexShrink: 0 }}>
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

        {/* Hamburguesa: solo visible debajo de "md" (768px), reemplaza a la
            franja de navegación de abajo y a los links de cuenta de arriba,
            que en mobile se esconden (d-none d-md-flex). */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="d-flex d-md-none align-items-center justify-content-center"
          style={{
            flexShrink: 0,
            background: "transparent",
            border: "none",
            color: "var(--text)",
            padding: "4px",
          }}
        >
          {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Franja de navegación principal - escondida en mobile, reemplazada
          por el menú desplegable de la hamburguesa. */}
      <div
        className="d-none d-md-flex"
        style={{
          backgroundColor: "var(--bg-black)",
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

      {/* Menú desplegable mobile: mismos links que la franja de navegación +
          los de cuenta, todos juntos acá porque en mobile no hay lugar para
          tenerlos separados como en desktop. */}
      {menuOpen && (
        <div
          className="d-md-none"
          style={{
            backgroundColor: "var(--bg-black)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            padding: "8px 24px 16px",
          }}
        >
          <NavLink to="/" end onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
            Inicio
          </NavLink>
          <NavLink to="/productos" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
            Productos
          </NavLink>
          <NavLink to="/categorias" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
            Categorías
          </NavLink>
          <NavLink to="/marcas" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
            Marcas
          </NavLink>
          <NavLink to="/nosotros" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
            Contacto y Envíos
          </NavLink>

          <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }} />

          {!loadingAuth && (
            user ? (
              <>
                <NavLink to="/mi-cuenta" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                  Mi cuenta
                </NavLink>
                <NavLink to="/mis-pedidos" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                  Mis pedidos
                </NavLink>
                {user.role === "admin" && (
                  <>
                    <NavLink to="/admin/pedidos" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                      Pedidos (admin)
                    </NavLink>
                    <NavLink to="/admin/arrepentimientos" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                      Arrepentimientos (admin)
                    </NavLink>
                  </>
                )}
                <span onClick={handleLogout} className="nav-link-custom" style={{ cursor: "pointer", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                  Cerrar sesión
                </span>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                  Ingresar
                </NavLink>
                <NavLink to="/register" onClick={closeMenu} className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 0" }}>
                  Registrarse
                </NavLink>
              </>
            )
          )}
        </div>
      )}
    </>
  );
};
