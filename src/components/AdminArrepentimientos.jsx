import { useContext, useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { AuthContext } from "../Context/authContext";

const API_URL = import.meta.env.VITE_API_URL;

const ESTADOS = {
  pendiente: { texto: "Pendiente", color: "var(--stock-low)", bg: "rgba(245, 166, 35, 0.12)" },
  resuelto: { texto: "Resuelto", color: "var(--stock-ok)", bg: "rgba(52, 211, 153, 0.12)" },
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

export const AdminArrepentimientos = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyCode, setBusyCode] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pendiente");

  const cargar = () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    fetch(`${API_URL}/api/arrepentimiento?${params.toString()}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron traer las solicitudes");
        return res.json();
      })
      .then((data) => setSolicitudes(data.solicitudes || []))
      .catch((err) => {
        console.error("Error al traer las solicitudes de arrepentimiento: ", err);
        setError("No se pudieron traer las solicitudes.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(cargar, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, statusFilter]);

  const handleResolver = async (code) => {
    setBusyCode(code);
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/api/arrepentimiento/${code}/resolver`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Algo salió mal");
      // Si estamos filtrando por "pendiente", la resuelta desaparece sola
      // de la lista en vez de quedar mostrada con el estado cambiado.
      setSolicitudes((prev) =>
        statusFilter === "pendiente" ? prev.filter((s) => s.code !== code) : prev.map((s) => (s.code === code ? data.solicitud : s))
      );
    } catch (err) {
      setActionError(`Solicitud ${code}: ${err.message}`);
    } finally {
      setBusyCode(null);
    }
  };

  if (loadingAuth) return <h3 className="mt-5 text-center">Cargando...</h3>;

  if (!user || user.role !== "admin") {
    return (
      <Container className="mt-5 text-center">
        <h3 style={{ color: "var(--text)" }}>No tenés permiso para ver esta página</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "720px" }}>
      <h2 className="mb-4" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>
        Solicitudes de arrepentimiento
      </h2>

      <div className="d-flex flex-wrap" style={{ gap: "10px", marginBottom: "18px" }}>
        <Form.Select style={{ ...selectStyle, maxWidth: "200px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="resuelto">Resuelto</option>
        </Form.Select>
      </div>

      {actionError && (
        <div style={{ background: "rgba(245, 101, 101, 0.12)", color: "#f56565", border: "1px solid rgba(245, 101, 101, 0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px" }}>
          {actionError}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-dim)" }}>Cargando...</p>
      ) : error ? (
        <p style={{ color: "#f56565" }}>{error}</p>
      ) : solicitudes.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>No hay solicitudes que coincidan con ese filtro.</p>
      ) : (
        <div className="d-flex flex-column" style={{ gap: "14px" }}>
          {solicitudes.map((s) => {
            const estado = ESTADOS[s.status] || { texto: s.status, color: "var(--text-dim)", bg: "var(--card-bg-alt)" };
            const ocupado = busyCode === s.code;

            return (
              <div key={s._id} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap" style={{ gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Solicitud {s.code}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "4px" }}>
                      {new Date(s.createdAt).toLocaleDateString("es-AR")} · {s.buyer.name} ({s.buyer.email}, {s.buyer.phone})
                    </div>
                  </div>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: estado.color, background: estado.bg, padding: "4px 11px", borderRadius: "100px" }}>
                    {estado.texto}
                  </span>
                </div>

                {(s.orderCode || s.mensaje) && (
                  <div className="d-flex flex-column" style={{ gap: "6px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border)", fontSize: "13px", color: "var(--text-dim)" }}>
                    {s.orderCode && <div><strong style={{ color: "var(--text)" }}>Pedido:</strong> {s.orderCode}</div>}
                    {s.mensaje && <div><strong style={{ color: "var(--text)" }}>Mensaje:</strong> {s.mensaje}</div>}
                  </div>
                )}

                {s.status === "pendiente" && (
                  <div className="d-flex justify-content-end" style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                    <button style={actionButtonStyle} disabled={ocupado} onClick={() => handleResolver(s.code)}>
                      Marcar como resuelto
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};
