import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthContext } from "../Context/authContext";
import { CheckIcon, TruckIcon } from "./icons";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADOS = {
  approved: { texto: "Aprobado", color: "var(--stock-ok)", bg: "rgba(52, 211, 153, 0.12)" },
  pending: { texto: "Pendiente", color: "var(--stock-low)", bg: "rgba(245, 166, 35, 0.12)" },
  rejected: { texto: "Rechazado", color: "#f56565", bg: "rgba(245, 101, 101, 0.12)" },
};

const PUNTOS_RETIRO = { showroom: "Showroom", deposito: "Depósito" };

const describirEnvio = (shipping) => {
  if (!shipping) return "No especificada";
  if (shipping.method === "retiro") {
    return `Retiro en ${PUNTOS_RETIRO[shipping.pickupLocation] || "local"}`;
  }
  if (shipping.method === "domicilio") return "Envío a domicilio";
  if (shipping.method === "convenir") return "A coordinar con el local";
  return "No especificada";
};

// Mismas etapas y orden que ESTADOS_POR_METODO en tickets.service.js
// (backend) — si se agrega/saca una etapa ahí, hay que replicarlo acá.
const PASOS_ENVIO = {
  retiro: [
    { key: "preparacion", label: "En preparación" },
    { key: "listo_para_retirar", label: "Listo para retirar" },
    { key: "retirado", label: "Retirado" },
  ],
  domicilio: [
    { key: "preparacion", label: "En preparación" },
    { key: "en_camino", label: "En camino" },
    { key: "entregado", label: "Entregado" },
  ],
  convenir: [
    { key: "coordinado_whatsapp", label: "Coordinado por WhatsApp" },
    { key: "entregado", label: "Entregado" },
  ],
};

const SeguimientoEnvio = ({ shipping, trackingStatus }) => {
  const pasos = PASOS_ENVIO[shipping?.method];
  if (!pasos) return null;
  const actual = pasos.findIndex((p) => p.key === trackingStatus);

  return (
    <div className="d-flex align-items-center flex-wrap" style={{ gap: "4px", marginTop: "14px" }}>
      {pasos.map((paso, i) => (
        <Fragment key={paso.key}>
          <div className="d-flex align-items-center" style={{ gap: "6px" }}>
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: i <= actual ? "var(--accent-2)" : "var(--card-bg-alt)",
                border: i <= actual ? "none" : "1px solid var(--border)",
                color: i <= actual ? "#0b0b10" : "var(--text-faint)",
              }}
            >
              {i < actual ? <CheckIcon size={10} /> : <span style={{ fontSize: "10px", fontWeight: 700 }}>{i + 1}</span>}
            </span>
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: i === actual ? 700 : 500,
                color: i <= actual ? "var(--text)" : "var(--text-faint)",
                whiteSpace: "nowrap",
              }}
            >
              {paso.label}
            </span>
          </div>
          {i < pasos.length - 1 && (
            <span
              style={{
                flex: "1 1 16px",
                minWidth: "16px",
                height: "1px",
                background: i < actual ? "var(--accent-2)" : "var(--border)",
              }}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export const MisPedidos = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/tickets/mine`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .catch((error) => console.error("Error al traer los pedidos: ", error))
      .finally(() => setLoading(false));
  }, [user]);

  if (loadingAuth || loading) return <h3 className="mt-5 text-center">Cargando...</h3>;

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h3 style={{ color: "var(--text)" }}>Iniciá sesión para ver tus pedidos</h3>
        <Link to="/login" style={{ color: "var(--accent-2)" }}>Ir a iniciar sesión</Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "720px" }}>
      <h2 className="mb-4" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>Mis pedidos</h2>

      {tickets.length === 0 ? (
        <div
          className="text-center"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "48px 24px",
          }}
        >
          <TruckIcon size={32} />
          <h4 style={{ marginTop: "14px", fontSize: "16px" }}>Todavía no hiciste ningún pedido</h4>
          <p style={{ color: "var(--text-dim)", fontSize: "13.5px", marginBottom: "18px" }}>
            Cuando compres algo, lo vas a ver acá con el estado de tu envío.
          </p>
          <Link to="/productos" className="btn btn-brand" style={{ border: "none", borderRadius: "8px", padding: "10px 22px" }}>
            Ir a productos
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column" style={{ gap: "14px" }}>
          {tickets.map((ticket) => {
            const estado = ESTADOS[ticket.status] || { texto: ticket.status, color: "var(--text-dim)", bg: "var(--card-bg-alt)" };
            return (
              <div
                key={ticket._id}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "20px",
                }}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap" style={{ gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Pedido {ticket.code}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "4px" }}>
                      {new Date(ticket.purchase_datetime).toLocaleDateString("es-AR")}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: estado.color,
                      background: estado.bg,
                      padding: "4px 11px",
                      borderRadius: "100px",
                    }}
                  >
                    {estado.texto}
                  </span>
                </div>

                <div className="d-flex flex-column" style={{ gap: "10px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  {ticket.items.map((item) => (
                    <div key={item.product?._id || item.product} className="d-flex align-items-center" style={{ gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          background: "var(--card-bg-alt)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {item.product?.thumbnail && (
                          <img src={item.product.thumbnail} alt="" style={{ maxWidth: "32px", maxHeight: "32px", objectFit: "contain" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: "13.5px", color: "var(--text-dim)" }}>
                        {item.quantity} × {item.product?.title || "Producto eliminado"}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text)", flexShrink: 0 }}>
                        ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                  <div className="d-flex align-items-center" style={{ gap: "8px", fontSize: "13.5px", color: "var(--text-dim)" }}>
                    <TruckIcon size={16} />
                    <span>{describirEnvio(ticket.shipping)}</span>
                    {ticket.shipping?.method === "domicilio" && ticket.shipping.cost > 0 && (
                      <span>· ${ticket.shipping.cost.toLocaleString("es-AR")}</span>
                    )}
                  </div>

                  {ticket.status === "approved" && (
                    <SeguimientoEnvio shipping={ticket.shipping} trackingStatus={ticket.trackingStatus} />
                  )}
                </div>

                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}
                >
                  <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>Total</span>
                  <span style={{ fontSize: "17px", fontWeight: 700 }}>${ticket.amount.toLocaleString("es-AR")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};
