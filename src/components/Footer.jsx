import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Logo } from "./Logo";
import { TruckIcon, InstallmentsIcon, ShieldIcon, WhatsappIcon } from "./icons";
import { WHATSAPP_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE, EMAIL, ZONA, HORARIOS } from "../constants/contact";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TrustBadge = ({ icon, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {icon}
    <span style={{ fontSize: "13.5px", color: "var(--text-dim)", fontWeight: 500 }}>{children}</span>
  </div>
);

const FooterLink = ({ to, children }) => (
  <Link to={to} style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "13.5px" }}>
    {children}
  </Link>
);

export const Footer = () => (
  <footer style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", marginTop: "40px" }}>
    {/* Franja de confianza */}
    <div style={{ borderBottom: "1px solid var(--border)", padding: "20px 24px" }}>
      <Container className="d-flex flex-wrap justify-content-center gap-4 gap-md-5">
        <TrustBadge icon={<TruckIcon />}>Envíos a todo el país</TrustBadge>
        <TrustBadge icon={<InstallmentsIcon />}>6 cuotas sin interés</TrustBadge>
        <TrustBadge icon={<ShieldIcon />}>Garantía oficial</TrustBadge>
      </Container>
    </div>

    <Container className="py-5">
      <Row className="g-4">
        <Col md={4}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <Logo size={36} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--text)" }}>
              BA <span style={{ color: "var(--accent-2)" }}>HERRAMIENTAS</span>
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--text-dim)", maxWidth: "260px" }}>
            Más de 35 años equipando talleres mecánicos y de chapa y pintura.
          </p>
          <div className="d-flex gap-3 mt-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" style={{ color: "var(--text-dim)" }} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={{ color: "var(--text-dim)" }} aria-label="WhatsApp">
              <WhatsappIcon />
            </a>
          </div>
        </Col>

        <Col md={4}>
          <h6 style={{ color: "var(--text)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>
            Contacto
          </h6>
          <div className="d-flex flex-column gap-2">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "13.5px" }}>
              WhatsApp: 11 7100-2357
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "13.5px" }}>
              Instagram: {INSTAGRAM_HANDLE}
            </a>
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "13.5px" }}>
              {EMAIL}
            </a>
            {HORARIOS.map((h) => (
              <span key={h} style={{ fontSize: "13.5px", color: "var(--text-faint)" }}>{h}</span>
            ))}
            <span style={{ fontSize: "13.5px", color: "var(--text-faint)" }}>{ZONA}</span>
          </div>
        </Col>

        <Col md={4}>
          <h6 style={{ color: "var(--text)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>
            Navegación
          </h6>
          <div className="d-flex flex-column gap-2">
            <FooterLink to="/productos">Todos los productos</FooterLink>
            <FooterLink to="/categorias">Categorías</FooterLink>
            <FooterLink to="/marcas">Marcas</FooterLink>
            <FooterLink to="/mis-pedidos">Mis pedidos</FooterLink>
            <FooterLink to="/nosotros">Contacto y Envíos</FooterLink>
          </div>
        </Col>
      </Row>
    </Container>

    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px" }}>
      <Container className="d-flex flex-wrap justify-content-between align-items-center" style={{ gap: "8px" }}>
        <span style={{ fontSize: "12px", color: "var(--text-faint)" }}>
          © {new Date().getFullYear()} BA Herramientas — {ZONA}
        </span>
        <Link
          to="/arrepentimiento"
          style={{ fontSize: "12px", color: "var(--text-faint)", textDecoration: "underline" }}
        >
          Botón de arrepentimiento
        </Link>
      </Container>
    </div>
  </footer>
);
