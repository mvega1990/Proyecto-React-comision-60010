import { Container, Row, Col } from "react-bootstrap";
import { WHATSAPP_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE, EMAIL, UBICACIONES } from "../constants/contact";
import { CartIcon, TruckIcon, WhatsappIcon } from "./icons";

// Cada método tiene su propio color (en vez de repetir el cyan 3 veces), tomado
// de colores que el sitio ya usa en otro lado: el verde es el mismo de los
// botones de WhatsApp del carrito/PDP, el morado y el cyan son --accent-3/--accent-2
// (los mismos de la franja de promos y el carrusel del Home).
const METODOS_ENVIO = [
  {
    icon: <CartIcon size={20} />,
    titulo: "Retiro sin cargo",
    texto:
      "En nuestro showroom de Ramos Mejía (con cita previa) o en el depósito de Ciudadela, coordinando día y horario. Ideal si estás cerca o preferís ver la herramienta antes de retirarla.",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.15)",
  },
  {
    icon: <TruckIcon size={20} />,
    titulo: "Envío a domicilio",
    texto:
      "A cualquier punto del país a través de Andreani. El costo se calcula automáticamente según tu código postal al momento de la compra, sin sorpresas ni cargos adicionales.",
    color: "#22d3ee",
    bg: "rgba(34, 211, 238, 0.12)",
  },
  {
    icon: <WhatsappIcon size={20} />,
    titulo: "Envío a convenir",
    texto:
      "Para herramientas grandes o pesadas (soldadoras, compresores, bancos de trabajo) coordinamos el envío directamente por WhatsApp, buscando la opción más conveniente en cada caso.",
    color: "#25d366",
    bg: "rgba(37, 211, 102, 0.12)",
  },
];

const ShippingMethodCard = ({ metodo }) => (
  <div
    style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "22px",
      height: "100%",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: metodo.bg,
        color: metodo.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "14px",
      }}
    >
      {metodo.icon}
    </div>
    <h5 style={{ color: "var(--text)" }}>{metodo.titulo}</h5>
    <div className="mt-2" style={{ color: "var(--text-dim)", lineHeight: 1.7, fontSize: "14px" }}>
      {metodo.texto}
    </div>
  </div>
);

const LocationCard = ({ ubicacion }) => (
  <div
    style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "24px",
      height: "100%",
    }}
  >
    <h5 style={{ color: "var(--text)" }}>{ubicacion.nombre}</h5>
    <div className="mt-2" style={{ color: "var(--text-dim)", lineHeight: 1.8 }}>
      <div>{ubicacion.direccion}</div>
      <div>{ubicacion.horario}</div>
    </div>
    <div className="mt-3" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)" }}>
      <iframe
        title={`Mapa - ${ubicacion.nombre}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(ubicacion.mapsQuery)}&output=embed`}
        width="100%"
        height="200"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
);

export const Nosotros = () => {
  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4">Quiénes somos</h2>
      <div style={{ fontSize: "16px", color: "var(--text-dim)", lineHeight: 1.8 }}>
        <p>
          Con más de 35 años de trayectoria, en BA Herramientas nos especializamos en equipar
          talleres mecánicos y de chapa y pintura. A lo largo de más de tres décadas acompañamos
          a talleres profesionales e independientes, ofreciendo las herramientas y el
          equipamiento que necesitan para trabajar con precisión, seguridad y eficiencia en el
          día a día.
        </p>
        <p>
          Nuestro catálogo reúne herramientas manuales, máquinas eléctricas, mobiliario de taller
          y equipamiento especializado para el rubro automotor, pensado para las necesidades
          reales de quienes trabajan todos los días con estas herramientas.
        </p>
        <p>
          Tenemos un showroom en Ramos Mejía para ver mercadería en persona (con cita previa), y
          un depósito en Ciudadela Sur para retiro y entrega de pedidos. Atendemos consultas por
          WhatsApp, email o Instagram.
        </p>
      </div>

      {/* Mismo degradé morado→cyan que la franja de promos y el carrusel del
          Home, para que la sección no quede plana como el resto de la página. */}
      <div
        className="mt-5"
        style={{
          background: "linear-gradient(90deg, var(--accent-3), var(--accent-2))",
          borderRadius: "16px",
          padding: "28px 32px",
        }}
      >
        <h2 className="mb-2" style={{ color: "#0b0b10" }}>Cómo recibís tu pedido</h2>
        <p className="mb-0" style={{ color: "#0b0b10", fontSize: "15px", opacity: 0.85 }}>
          Ofrecemos tres formas de envío para que elijas la que mejor se adapte a tu compra.
        </p>
      </div>
      <Row className="mt-4 g-4">
        {METODOS_ENVIO.map((metodo) => (
          <Col md={4} key={metodo.titulo}>
            <ShippingMethodCard metodo={metodo} />
          </Col>
        ))}
      </Row>

      <Row className="mt-5 g-4">
        <Col md={6}>
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "24px",
              height: "100%",
            }}
          >
            <h5 style={{ color: "var(--text)" }}>Contacto</h5>
            <div className="mt-3 d-flex flex-column gap-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent-2)", fontWeight: 600, textDecoration: "none" }}
              >
                WhatsApp: 11 7100-2357
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent-2)", fontWeight: 600, textDecoration: "none" }}
              >
                Instagram: {INSTAGRAM_HANDLE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                style={{ color: "var(--accent-2)", fontWeight: 600, textDecoration: "none" }}
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </Col>

        {UBICACIONES.map((ubicacion) => (
          <Col md={6} key={ubicacion.nombre}>
            <LocationCard ubicacion={ubicacion} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
