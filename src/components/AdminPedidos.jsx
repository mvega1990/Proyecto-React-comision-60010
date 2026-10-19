import { Fragment, useContext, useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { AuthContext } from "../Context/authContext";
import { CheckIcon, TruckIcon } from "./icons";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADOS = {
  approved: { texto: "Aprobado", color: "var(--stock-ok)", bg: "rgba(52, 211, 153, 0.12)" },
  pending: { texto: "Pendiente", color: "var(--stock-low)", bg: "rgba(245, 166, 35, 0.12)" },
  rejected: { texto: "Rechazado", color: "#f56565", bg: "rgba(245, 101, 101, 0.12)" },
};

const METODOS_PAGO = {
  tarjeta: "Tarjeta",
  efectivo: "Efectivo",
  transferencia: "Transferencia",
};

const PUNTOS_RETIRO = { showroom: "Showroom", deposito: "Depósito" };

const describirEnvio = (shipping) => {
  if (!shipping) return "No especificada";
  if (shipping.method === "retiro") return `Retiro en ${PUNTOS_RETIRO[shipping.pickupLocation] || "local"}`;
  if (shipping.method === "domicilio") return "Envío a domicilio";
  if (shipping.method === "convenir") return "A coordinar con el local";
  return "No especificada";
};

// Mismas etapas y orden que ESTADOS_POR_METODO en tickets.service.js (backend).
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

const siguienteEstadoEnvio = (shippingMethod, trackingStatus) => {
  const pasos = PASOS_ENVIO[shippingMethod];
  if (!pasos) return null;
  const actual = pasos.findIndex((p) => p.key === trackingStatus);
  return pasos[actual + 1] || null;
};

const SeguimientoEnvio = ({ shipping, trackingStatus }) => {
  const pasos = PASOS_ENVIO[shipping?.method];
  if (!pasos) return null;
  const actual = pasos.findIndex((p) => p.key === trackingStatus);

  return (
    <div className="d-flex align-items-center flex-wrap" style={{ gap: "4px", marginTop: "10px" }}>
      {pasos.map((paso, i) => (
        <Fragment key={paso.key}>
          <div className="d-flex align-items-center" style={{ gap: "6px" }}>
            <span
              style={{
                width: "18px",
                height: "18px",
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
              {i < actual ? <CheckIcon size={9} /> : <span style={{ fontSize: "9px", fontWeight: 700 }}>{i + 1}</span>}
            </span>
            <span style={{ fontSize: "11px", fontWeight: i === actual ? 700 : 500, color: i <= actual ? "var(--text)" : "var(--text-faint)", whiteSpace: "nowrap" }}>
              {paso.label}
            </span>
          </div>
          {i < pasos.length - 1 && (
            <span style={{ flex: "1 1 12px", minWidth: "12px", height: "1px", background: i < actual ? "var(--accent-2)" : "var(--border)" }} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

const actionButtonStyle = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--bg-alt)",
  color: "var(--text)",
  fontSize: "12.5px",
  fontWeight: 600,
  padding: "8px 14px",
  cursor: "pointer",
};

const selectStyle = {
  height: "36px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--bg-alt)",
  color: "var(--text)",
  fontSize: "13px",
};

export const AdminPedidos = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyCode, setBusyCode] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");

  const cargarPedidos = () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (paymentFilter) params.set("paymentMethod", paymentFilter);
    if (search.trim()) params.set("search", search.trim());

    fetch(`${API_URL}/api/tickets?${params.toString()}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron traer los pedidos");
        return res.json();
      })
      .then((data) => setTickets(data.tickets || []))
      .catch((err) => {
        console.error("Error al traer los pedidos: ", err);
        setError("No se pudieron traer los pedidos.");
      })
      .finally(() => setLoading(false));
  };

  // Un solo efecto para carga inicial y cambios de filtro — con el mismo
  // debounce chico para los dos casos, así no se pide la lista dos veces al
  // entrar a la página (antes había un efecto separado para cada cosa).
  useEffect(() => {
    const timer = setTimeout(cargarPedidos, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, statusFilter, paymentFilter, search]);

  const actualizarTicketEnLista = (ticketActualizado) => {
    setTickets((prev) => prev.map((t) => (t.code === ticketActualizado.code ? ticketActualizado : t)));
  };

  const llamarAccion = async (code, path, body) => {
    setBusyCode(code);
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/api/tickets/${code}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Algo salió mal");
      actualizarTicketEnLista(data.ticket);
    } catch (err) {
      setActionError(`Pedido ${code}: ${err.message}`);
    } finally {
      setBusyCode(null);
    }
  };

  const handleConfirmarPago = (code) => llamarAccion(code, "confirmar-pago");

  const handleCancelar = (code) => {
    if (!window.confirm(`¿Seguro que querés cancelar el pedido ${code}? Se devuelve el stock reservado.`)) return;
    llamarAccion(code, "cancelar");
  };

  const handleAvanzarEnvio = (code, nuevoEstado) => llamarAccion(code, "tracking", { nuevoEstado });

  if (loadingAuth) return <h3 className="mt-5 text-center">Cargando...</h3>;

  if (!user || user.role !== "admin") {
    return (
      <Container className="mt-5 text-center">
        <h3 style={{ color: "var(--text)" }}>No tenés permiso para ver esta página</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "820px" }}>
      <h2 className="mb-4" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>Pedidos</h2>

      <div className="d-flex flex-wrap" style={{ gap: "10px", marginBottom: "18px" }}>
        <Form.Select style={{ ...selectStyle, maxWidth: "180px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="approved">Aprobado</option>
          <option value="rejected">Rechazado</option>
        </Form.Select>
        <Form.Select style={{ ...selectStyle, maxWidth: "180px" }} value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="">Todos los métodos de pago</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </Form.Select>
        <Form.Control
          style={{ ...selectStyle, flex: "1 1 220px" }}
          placeholder="Buscar por código o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {actionError && (
        <div style={{ background: "rgba(245, 101, 101, 0.12)", color: "#f56565", border: "1px solid rgba(245, 101, 101, 0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px" }}>
          {actionError}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-dim)" }}>Cargando pedidos...</p>
      ) : error ? (
        <p style={{ color: "#f56565" }}>{error}</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>No hay pedidos que coincidan con esos filtros.</p>
      ) : (
        <div className="d-flex flex-column" style={{ gap: "14px" }}>
          {tickets.map((ticket) => {
            const estado = ESTADOS[ticket.status] || { texto: ticket.status, color: "var(--text-dim)", bg: "var(--card-bg-alt)" };
            const siguiente = ticket.status === "approved" ? siguienteEstadoEnvio(ticket.shipping?.method, ticket.trackingStatus) : null;
            const esManualPendiente = ticket.status === "pending" && ticket.paymentMethod !== "tarjeta";
            const ocupado = busyCode === ticket.code;

            return (
              <div key={ticket._id} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap" style={{ gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Pedido {ticket.code}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "4px" }}>
                      {new Date(ticket.purchase_datetime).toLocaleDateString("es-AR")} · {ticket.buyer?.name} ({ticket.buyer?.email})
                    </div>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-dim)", background: "var(--card-bg-alt)", padding: "4px 10px", borderRadius: "100px" }}>
                      {METODOS_PAGO[ticket.paymentMethod] || ticket.paymentMethod}
                    </span>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: estado.color, background: estado.bg, padding: "4px 11px", borderRadius: "100px" }}>
                      {estado.texto}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column" style={{ gap: "6px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                  {ticket.items.map((item) => (
                    <div key={item.product?._id || item.product} style={{ fontSize: "13px", color: "var(--text-dim)" }}>
                      {item.quantity} × {item.product?.title || "Producto eliminado"} — ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                  <div className="d-flex align-items-center" style={{ gap: "8px", fontSize: "13px", color: "var(--text-dim)" }}>
                    <TruckIcon size={15} />
                    <span>{describirEnvio(ticket.shipping)}</span>
                    {ticket.shipping?.method === "domicilio" && ticket.shipping.cost > 0 && (
                      <span>· ${ticket.shipping.cost.toLocaleString("es-AR")}</span>
                    )}
                  </div>
                  {ticket.status === "approved" && <SeguimientoEnvio shipping={ticket.shipping} trackingStatus={ticket.trackingStatus} />}
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: "10px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700 }}>${ticket.amount.toLocaleString("es-AR")}</span>

                  <div className="d-flex flex-wrap" style={{ gap: "8px" }}>
                    {esManualPendiente && (
                      <>
                        <button style={actionButtonStyle} disabled={ocupado} onClick={() => handleConfirmarPago(ticket.code)}>
                          Confirmar pago
                        </button>
                        <button style={{ ...actionButtonStyle, color: "#f56565", borderColor: "rgba(245, 101, 101, 0.4)" }} disabled={ocupado} onClick={() => handleCancelar(ticket.code)}>
                          Cancelar pedido
                        </button>
                      </>
                    )}
                    {siguiente && (
                      <button style={{ ...actionButtonStyle, color: "var(--accent-2)", borderColor: "var(--accent-2)" }} disabled={ocupado} onClick={() => handleAvanzarEnvio(ticket.code, siguiente.key)}>
                        Marcar: {siguiente.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};
