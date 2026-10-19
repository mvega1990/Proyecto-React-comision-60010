import { useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL;

const EMPTY_FORM = { name: "", email: "", phone: "", orderCode: "", mensaje: "" };

const inputStyle = {
  height: "40px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--bg-alt)",
  color: "var(--text)",
  fontSize: "13.5px",
};

const Field = ({ label, as, ...inputProps }) => (
  <div>
    <label style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 500, display: "block", marginBottom: "5px" }}>
      {label}
    </label>
    <Form.Control as={as} style={as === "textarea" ? { ...inputStyle, height: "80px" } : inputStyle} {...inputProps} />
  </div>
);

export const Arrepentimiento = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [codigo, setCodigo] = useState(null);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/api/arrepentimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos registrar tu solicitud. Probá de nuevo.");
      setCodigo(data.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (codigo) {
    return (
      <Container className="mt-5 mb-5" style={{ maxWidth: "520px" }}>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px", textAlign: "center" }}>
          <h3 style={{ fontSize: "18px" }}>Solicitud recibida</h3>
          <p style={{ color: "var(--text-dim)", fontSize: "13.5px" }}>
            Te mandamos un mail con el detalle. Nos vamos a contactar a la brevedad para coordinar los pasos siguientes.
          </p>
          <div style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-faint)" }}>Código de confirmación</div>
          <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--accent-2)" }}>{codigo}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "520px" }}>
      <h2 className="mb-2" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>
        Botón de arrepentimiento
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: "13.5px", marginBottom: "22px" }}>
        Si compraste algo y te arrepentiste, tenés derecho a hacerlo dentro de los 10 días (Resolución 424/2020).
        Completá tus datos y nos contactamos para coordinar la devolución.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="d-flex flex-column" style={{ gap: "14px" }}>
        <Field label="Nombre y apellido" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
        <Field label="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
        <Field label="Teléfono" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
        <Field
          label="Código de pedido (si lo tenés a mano)"
          value={form.orderCode}
          onChange={(e) => updateField("orderCode", e.target.value)}
        />
        <Field
          label="Contanos qué pasó (opcional)"
          as="textarea"
          value={form.mensaje}
          onChange={(e) => updateField("mensaje", e.target.value)}
        />

        <button
          type="submit"
          disabled={enviando}
          className="btn-brand"
          style={{ height: "46px", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", opacity: enviando ? 0.6 : 1 }}
        >
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </button>
      </Form>
    </Container>
  );
};
