import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardPayment } from "@mercadopago/sdk-react";
import { ItemContext } from "../Context/itemContext";
import { AuthContext } from "../Context/authContext";
import { Container, Alert, Form } from "react-bootstrap";
import { CASH_DISCOUNT } from "../utils/price";
import { MinusIcon, PlusIcon, TrashIcon, WhatsappIcon } from "./icons";
import { WHATSAPP_NUMBER, UBICACIONES, BANK_DETAILS } from "../constants/contact";

const API_URL = import.meta.env.VITE_API_URL;

const EMPTY_BUYER = {
  name: "",
  phone: "",
  email: "",
  address: { street: "", locality: "", province: "", postalCode: "" },
};

const inputStyle = {
  height: "40px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--bg-alt)",
  color: "var(--text)",
  fontSize: "13.5px",
};

const Field = ({ label, span, ...inputProps }) => (
  <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
    <label style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 500, display: "block", marginBottom: "5px" }}>
      {label}
    </label>
    <Form.Control style={inputStyle} {...inputProps} />
  </div>
);

// Mismo verde reconocible de WhatsApp que ya usa ItemCount.jsx — se repite acá
// a propósito en vez de importarlo, para no acoplar dos componentes que no
// tienen relación entre sí.
const WHATSAPP_GREEN = "#25d366";
const whatsappButtonStyle = {
  height: "44px",
  border: `1px solid ${WHATSAPP_GREEN}`,
  borderRadius: "10px",
  background: "rgba(37, 211, 102, 0.12)",
  color: WHATSAPP_GREEN,
  fontWeight: 600,
  fontSize: "13.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textDecoration: "none",
  width: "100%",
};

const shippingCardStyle = (selected) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "11px 13px",
  borderRadius: "10px",
  border: `1px solid ${selected ? "var(--accent-2)" : "var(--border)"}`,
  background: selected ? "rgba(34, 211, 238, 0.08)" : "var(--bg-alt)",
  cursor: "pointer",
  marginBottom: "8px",
});

export const Cart = () => {
  const { items, reset, removeItem, updateQuantity, cartId, refreshCart } = useContext(ItemContext);
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null); // { status, message }
  // Ni comprando logueado hay dirección guardada en la cuenta todavía, así
  // que el checkout siempre pide estos datos, sea invitado o no.
  const [buyer, setBuyer] = useState(EMPTY_BUYER);
  // Sin nada preseleccionado a propósito: fuerza a elegir método de envío
  // como en cualquier checkout real, en vez de asumir "a domicilio".
  const [shippingMethod, setShippingMethod] = useState(null); // 'retiro' | 'domicilio' | 'convenir'
  const [pickupLocation, setPickupLocation] = useState("");
  // Igual que el envío: nada preseleccionado, obliga a elegir.
  const [paymentMethod, setPaymentMethod] = useState(null); // 'tarjeta' | 'efectivo' | 'transferencia'
  const [shippingEstimate, setShippingEstimate] = useState(null); // { zona, tamano, domicilio, sucursal, esEstimado }
  const [shippingEstimateLoading, setShippingEstimateLoading] = useState(false);
  const [shippingEstimateError, setShippingEstimateError] = useState(null);
  // Checkout en 3 pantallas (carrito -> envío -> pago), como en la referencia
  // que pidió el dueño, en vez de todo junto en una sola pantalla larga.
  const [step, setStep] = useState("carrito"); // 'carrito' | 'envio' | 'pago'

  useEffect(() => {
    if (user?.email) setBuyer((b) => ({ ...b, email: user.email }));
  }, [user]);

  const updateBuyer = (field, value) => setBuyer((b) => ({ ...b, [field]: value }));
  const updateAddress = (field, value) =>
    setBuyer((b) => ({ ...b, address: { ...b.address, [field]: value } }));

  // Estimado de costo de envío: solo se pide para "domicilio", con un
  // pequeño debounce para no golpear el backend en cada tecla del CP.
  useEffect(() => {
    if (shippingMethod !== "domicilio" || !cartId) {
      setShippingEstimate(null);
      setShippingEstimateError(null);
      return;
    }
    const postalCode = buyer.address.postalCode.trim();
    if (!postalCode) {
      setShippingEstimate(null);
      setShippingEstimateError(null);
      return;
    }
    setShippingEstimateLoading(true);
    setShippingEstimateError(null);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/carts/${cartId}/shipping-estimate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ postalCode }),
        });
        if (!res.ok) throw new Error("No se pudo estimar el envío");
        setShippingEstimate(await res.json());
      } catch (err) {
        console.error("Error al estimar el envío:", err);
        setShippingEstimateError("No pudimos estimar el envío para ese código postal.");
        setShippingEstimate(null);
      } finally {
        setShippingEstimateLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [shippingMethod, buyer.address.postalCode, cartId]);

  // Ojo: NO condicionar esto a "!shippingEstimateLoading". El Brick de
  // Mercado Pago se monta/desmonta cada vez que este valor pasa a false, y
  // el SDK no tolera bien que se lo destruya y recree seguido (tipear el CP
  // dispara "loading" en cada tecla) — rompe con un error genérico. Una vez
  // que ya tenemos una estimación previa, el Brick se queda montado con el
  // monto anterior mientras se recalcula, y solo se remonta (por la `key`
  // de más abajo) cuando el total realmente cambia.
  const envioCompleto =
    buyer.name.trim() &&
    buyer.phone.trim() &&
    buyer.email.trim() &&
    shippingMethod &&
    (shippingMethod !== "domicilio" ||
      (buyer.address.street.trim() &&
        buyer.address.locality.trim() &&
        buyer.address.province.trim() &&
        buyer.address.postalCode.trim() &&
        shippingEstimate));
  const buyerComplete = envioCompleto && paymentMethod;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Ahorro estimado pagando en efectivo/transferencia: respeta el offerDiscount
  // propio de cada producto si lo tiene, y el 30% de siempre si no. Es sobre
  // productos únicamente, el envío no tiene descuento.
  const cashTotal = items.reduce((acc, item) => {
    const discount = item.offerDiscount ? item.offerDiscount / 100 : CASH_DISCOUNT;
    return acc + item.price * item.quantity * (1 - discount);
  }, 0);
  const savings = subtotal - cashTotal;

  const shippingCost = shippingMethod === "domicilio" && shippingEstimate ? shippingEstimate.domicilio ?? 0 : 0;
  // Con efectivo/transferencia el total ya sale con el descuento aplicado;
  // con tarjeta (o sin elegir todavía) es el precio de lista. El envío nunca
  // tiene descuento.
  const pagaConDescuento = paymentMethod === "efectivo" || paymentMethod === "transferencia";
  const total = (pagaConDescuento ? cashTotal : subtotal) + shippingCost;

  const whatsappShippingMessage = "Hola! Quería coordinar el envío de mi pedido de BA Herramientas.";
  const whatsappShippingUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappShippingMessage)}`;

  // El Brick tokeniza la tarjeta en el navegador (nunca vemos el número acá)
  // y nos entrega esto — se lo pasamos tal cual a nuestro backend, junto con
  // el método de envío elegido, que es quien realmente cobra y recalcula el
  // monto (incluido el costo de envío) contra la base.
  const handlePaymentSubmit = async (formData) => {
    const res = await fetch(`${API_URL}/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        token: formData.token,
        payment_method_id: formData.payment_method_id,
        installments: formData.installments,
        issuer_id: formData.issuer_id,
        // El Brick pide el DNI del comprador y lo devuelve acá — Mercado
        // Pago lo necesita para procesar el pago (si no se lo mandamos, la
        // API responde con un error interno genérico en vez de un rechazo
        // claro).
        identification: formData.payer?.identification,
        shippingMethod,
        pickupLocation: shippingMethod === "retiro" ? pickupLocation || undefined : undefined,
        buyer: shippingMethod === "domicilio" ? buyer : { ...buyer, address: undefined },
        paymentMethod: "tarjeta",
      }),
    });
    const data = await res.json();
    const status = data.ticket?.status || "error";

    if (status === "approved") {
      setResult({ status, message: `¡Compra aprobada! Código de tu pedido: ${data.ticket.code}` });
      refreshCart();
    } else if (status === "rejected") {
      setResult({ status, message: "El pago fue rechazado. Probá con otro medio de pago." });
    } else {
      setResult({ status, message: "Tu pago quedó pendiente de confirmación." });
    }
  };

  // Efectivo/transferencia: no hay Brick ni token, se arma el pedido
  // directo. El backend recalcula el total con el descuento y reserva el
  // stock; queda "pending" hasta que el dueño confirma el pago a mano.
  const handleManualSubmit = async () => {
    const res = await fetch(`${API_URL}/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        shippingMethod,
        pickupLocation: shippingMethod === "retiro" ? pickupLocation || undefined : undefined,
        buyer: shippingMethod === "domicilio" ? buyer : { ...buyer, address: undefined },
        paymentMethod,
      }),
    });
    const data = await res.json();
    const status = data.ticket?.status;

    if (status === "pending") {
      setResult({ status, code: data.ticket.code, paymentMethod });
      refreshCart();
    } else {
      setResult({ status: "rejected", message: data.error || "No pudimos generar el pedido. Probá de nuevo." });
    }
  };

  if (result?.status === "approved") {
    return (
      <Container className="mt-5 col-lg-6 offset-lg-3 text-center">
        <Alert variant="success">{result.message}</Alert>
      </Container>
    );
  }

  // Pedido en efectivo/transferencia ya creado (queda "pending" hasta que el
  // dueño confirma el pago a mano). El "pending" de tarjeta (in_process del
  // Brick) NO entra acá: sigue mostrándose como alerta abajo, en el carrito.
  if (result?.status === "pending" && result.paymentMethod && result.paymentMethod !== "tarjeta") {
    const whatsappComprobanteMsg = `Hola! Te paso el comprobante de mi pedido ${result.code} de BA Herramientas.`;
    const whatsappComprobanteUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappComprobanteMsg)}`;
    return (
      <Container className="mt-5 col-lg-6 offset-lg-3">
        <Alert variant="info">
          Pedido recibido. Código: <strong>{result.code}</strong>
        </Alert>

        {result.paymentMethod === "efectivo" && (
          <p style={{ color: "var(--text-dim)", fontSize: "13.5px" }}>
            Pagás al retirar en el local/depósito, o al recibir el pedido si es envío a domicilio.
          </p>
        )}

        {result.paymentMethod === "transferencia" && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>Datos para transferir</h4>
            <div style={{ fontSize: "13.5px", color: "var(--text-dim)", lineHeight: 1.9 }}>
              <div>Banco: <span style={{ color: "var(--text)" }}>{BANK_DETAILS.banco}</span></div>
              <div>Alias: <span style={{ color: "var(--text)" }}>{BANK_DETAILS.alias}</span></div>
              <div>CBU: <span style={{ color: "var(--text)" }}>{BANK_DETAILS.cbu}</span></div>
              <div>CUIT: <span style={{ color: "var(--text)" }}>{BANK_DETAILS.cuit}</span></div>
              <div>Titular: <span style={{ color: "var(--text)" }}>{BANK_DETAILS.titular}</span></div>
            </div>
            <a href={whatsappComprobanteUrl} target="_blank" rel="noreferrer" style={{ ...whatsappButtonStyle, marginTop: "16px" }}>
              <WhatsappIcon size={16} /> Mandar comprobante por WhatsApp
            </a>
          </div>
        )}
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h3 style={{ color: "var(--text)" }}>Tu carrito está vacío</h3>
        <Link to="/productos" style={{ color: "var(--accent-2)" }}>Ir a Productos para seguir comprando</Link>
      </Container>
    );
  }

  // Reusado tal cual en las tres pantallas, así los números del pedido no
  // cambian de lugar ni de forma mientras se avanza de paso.
  const resumenPedido = (
    <div
      style={{
        maxWidth: "640px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Resumen del pedido</h3>
      <div className="d-flex justify-content-between" style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "14px" }}>
        <span>Subtotal</span>
        <span style={{ color: "var(--text)" }}>${subtotal.toLocaleString("es-AR")}</span>
      </div>
      <div className="d-flex justify-content-between" style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "6px" }}>
        <span>Envío</span>
        <span style={{ color: "var(--text)" }}>
          {!shippingMethod && "A elegir"}
          {(shippingMethod === "retiro" || shippingMethod === "convenir") && "Gratis"}
          {shippingMethod === "domicilio" &&
            (shippingEstimateLoading
              ? "Calculando…"
              : shippingEstimate?.coordinar
              ? "A convenir"
              : shippingEstimate?.tamano === "Gratis"
              ? "Gratis"
              : shippingEstimate
              ? `$${shippingEstimate.domicilio.toLocaleString("es-AR")}`
              : "Ingresá tu código postal")}
        </span>
      </div>
      <div style={{ height: "1px", background: "var(--border)", margin: "14px 0" }} />
      <div className="d-flex justify-content-between" style={{ fontSize: "18px", fontWeight: 700 }}>
        <span>Total</span>
        <span>${total.toLocaleString("es-AR")}</span>
      </div>
      {savings > 0 && !pagaConDescuento && (
        <div style={{ fontSize: "11.5px", color: "var(--accent-2)", marginTop: "8px" }}>
          Pagando en efectivo o transferencia ahorrás ${Math.round(savings).toLocaleString("es-AR")}
        </div>
      )}
    </div>
  );

  const PASOS = [
    { key: "carrito", label: "Carrito" },
    { key: "envio", label: "Envío" },
    { key: "pago", label: "Pago" },
  ];
  const pasoActualIndex = PASOS.findIndex((p) => p.key === step);
  const stepIndicator = (
    <div className="d-flex align-items-center" style={{ gap: "8px", marginBottom: "24px", fontSize: "12.5px" }}>
      {PASOS.map((p, i) => (
        <span key={p.key} className="d-flex align-items-center" style={{ gap: "8px" }}>
          <span style={{ color: i === pasoActualIndex ? "var(--accent-2)" : i < pasoActualIndex ? "var(--text-dim)" : "var(--text-faint)", fontWeight: i === pasoActualIndex ? 700 : 500 }}>
            {i + 1}. {p.label}
          </span>
          {i < PASOS.length - 1 && <span style={{ color: "var(--text-faint)" }}>→</span>}
        </span>
      ))}
    </div>
  );

  const volverButtonStyle = {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-dim)",
    fontSize: "13px",
    padding: "10px 16px",
    cursor: "pointer",
  };
  const continuarButtonStyle = {
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "13.5px",
    padding: "10px 20px",
  };

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: step === "carrito" ? "1080px" : "640px" }}>
      <div style={{ fontSize: "12.5px", color: "var(--text-faint)", marginBottom: "16px" }}>
        <Link to="/" style={{ color: "var(--text-faint)" }}>Inicio</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--text-dim)" }}>Carrito</span>
      </div>

      {stepIndicator}

      {step === "carrito" && (
        <div>
          <div className="d-flex justify-content-between align-items-baseline">
            <h1 style={{ fontSize: "26px", fontWeight: 700 }}>Tu carrito</h1>
            <button
              onClick={reset}
              style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: "13px", cursor: "pointer" }}
            >
              Vaciar carrito
            </button>
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-faint)", marginTop: "4px" }}>
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </div>

          <div className="d-flex flex-column" style={{ gap: "12px", marginTop: "18px" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center flex-wrap"
                style={{
                  gap: "16px",
                  padding: "16px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    width: "84px",
                    height: "84px",
                    borderRadius: "10px",
                    background: "var(--card-bg-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img src={item.image} alt={item.title} style={{ maxWidth: "64px", maxHeight: "64px", objectFit: "contain" }} />
                </div>

                <div style={{ flex: "1 1 160px", minWidth: 0 }}>
                  {item.marca && (
                    <div style={{ fontSize: "11px", color: "var(--text-faint)", textTransform: "uppercase" }}>{item.marca}</div>
                  )}
                  <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "2px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
                    ${item.price.toLocaleString("es-AR")} c/u
                  </div>
                </div>

                <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{ width: "30px", height: "32px", border: "none", background: "var(--card-bg-alt)", color: "var(--text)" }}
                  >
                    <MinusIcon size={11} />
                  </button>
                  <span style={{ width: "28px", textAlign: "center", fontWeight: 600, fontSize: "13px" }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= (item.stock ?? Infinity)}
                    style={{ width: "30px", height: "32px", border: "none", background: "var(--card-bg-alt)", color: "var(--text)" }}
                  >
                    <PlusIcon size={11} />
                  </button>
                </div>

                <div style={{ width: "86px", textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "15.5px", fontWeight: 700 }}>
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </div>
                  {item.quantity > 1 && (
                    <div style={{ fontSize: "10.5px", color: "var(--text-faint)", marginTop: "2px" }}>
                      {item.quantity} × ${item.price.toLocaleString("es-AR")}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Quitar del carrito"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "7px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-faint)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "12px" }}>{resumenPedido}</div>

          <button
            onClick={() => setStep("envio")}
            className="btn-brand"
            style={{ ...continuarButtonStyle, maxWidth: "640px", width: "100%", height: "46px", marginTop: "16px" }}
          >
            Continuar con la compra
          </button>
        </div>
      )}

      {step === "envio" && (
        <div>
          {resumenPedido}

          <div style={{ marginTop: "16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>Datos de contacto</h4>
          <div className="d-flex flex-column" style={{ gap: "10px", marginBottom: "18px" }}>
            <Field label="Nombre y apellido" value={buyer.name} onChange={(e) => updateBuyer("name", e.target.value)} />
            <Field label="Teléfono" value={buyer.phone} onChange={(e) => updateBuyer("phone", e.target.value)} />
            <Field label="Email" type="email" value={buyer.email} onChange={(e) => updateBuyer("email", e.target.value)} />
          </div>

          <h4 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>Método de envío</h4>
          <div>
            <label style={shippingCardStyle(shippingMethod === "retiro")}>
              <Form.Check type="radio" name="shippingMethod" checked={shippingMethod === "retiro"} onChange={() => setShippingMethod("retiro")} />
              <div className="flex-grow-1">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>Retiro en depósito o local</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Coordinamos día y horario</div>
              </div>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent-2)" }}>Gratis</span>
            </label>

            {shippingMethod === "retiro" && (
              <div className="mb-2" style={{ paddingLeft: "28px" }}>
                {UBICACIONES.map((u) => (
                  <label key={u.key} style={shippingCardStyle(pickupLocation === u.key)}>
                    <Form.Check type="radio" name="pickupLocation" checked={pickupLocation === u.key} onChange={() => setPickupLocation(u.key)} />
                    <div style={{ fontSize: "12px" }}>
                      <div style={{ fontWeight: 600 }}>{u.nombre}</div>
                      <div style={{ color: "var(--text-dim)" }}>{u.direccion} · {u.horario}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <label style={shippingCardStyle(shippingMethod === "domicilio")}>
              <Form.Check type="radio" name="shippingMethod" checked={shippingMethod === "domicilio"} onChange={() => setShippingMethod("domicilio")} />
              <div className="flex-grow-1">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>Envío a domicilio</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Costo calculado según tu código postal</div>
              </div>
            </label>

            {shippingMethod === "domicilio" && (
              <div className="d-flex flex-column mb-2" style={{ gap: "10px", paddingLeft: "28px" }}>
                <Field label="Calle y número" value={buyer.address.street} onChange={(e) => updateAddress("street", e.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Field label="Código postal" value={buyer.address.postalCode} onChange={(e) => updateAddress("postalCode", e.target.value)} />
                  <Field label="Localidad" value={buyer.address.locality} onChange={(e) => updateAddress("locality", e.target.value)} />
                </div>
                <Field label="Provincia" value={buyer.address.province} onChange={(e) => updateAddress("province", e.target.value)} />
                {shippingEstimateError && (
                  <Alert variant="warning" className="mb-0 py-2" style={{ fontSize: "12px" }}>{shippingEstimateError}</Alert>
                )}
              </div>
            )}

            <label style={shippingCardStyle(shippingMethod === "convenir")}>
              <Form.Check type="radio" name="shippingMethod" checked={shippingMethod === "convenir"} onChange={() => setShippingMethod("convenir")} />
              <div className="flex-grow-1">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>Envío a convenir</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Para bultos grandes o pedidos especiales</div>
              </div>
            </label>

            {shippingMethod === "convenir" && (
              <div className="mb-2" style={{ paddingLeft: "28px" }}>
                <a href={whatsappShippingUrl} target="_blank" rel="noreferrer" style={whatsappButtonStyle}>
                  <WhatsappIcon size={16} /> Coordinar envío por WhatsApp
                </a>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button onClick={() => setStep("carrito")} style={volverButtonStyle}>← Volver</button>
            <button
              onClick={() => setStep("pago")}
              disabled={!envioCompleto}
              className="btn-brand"
              style={{ ...continuarButtonStyle, opacity: envioCompleto ? 1 : 0.5, cursor: envioCompleto ? "pointer" : "not-allowed" }}
            >
              Continuar →
            </button>
          </div>
          </div>
        </div>
      )}

      {step === "pago" && (
        <div>
          {resumenPedido}

          <div style={{ marginTop: "16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>Forma de pago</h4>
          <div>
            <label style={shippingCardStyle(paymentMethod === "tarjeta")}>
              <Form.Check type="radio" name="paymentMethod" checked={paymentMethod === "tarjeta"} onChange={() => setPaymentMethod("tarjeta")} />
              <div className="flex-grow-1">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>Tarjeta</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Hasta 6 cuotas sin interés</div>
              </div>
            </label>

            <label style={shippingCardStyle(paymentMethod === "efectivo")}>
              <Form.Check type="radio" name="paymentMethod" checked={paymentMethod === "efectivo"} onChange={() => setPaymentMethod("efectivo")} />
              <div className="flex-grow-1">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>Efectivo</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Pagás al retirar o al recibir el pedido</div>
              </div>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent-2)" }}>-{CASH_DISCOUNT * 100}%</span>
            </label>

            <label style={shippingCardStyle(paymentMethod === "transferencia")}>
              <Form.Check type="radio" name="paymentMethod" checked={paymentMethod === "transferencia"} onChange={() => setPaymentMethod("transferencia")} />
              <div className="flex-grow-1">
                <div style={{ fontSize: "13px", fontWeight: 600 }}>Transferencia bancaria</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Te pasamos los datos al confirmar</div>
              </div>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent-2)" }}>-{CASH_DISCOUNT * 100}%</span>
            </label>
          </div>

          {result && result.status !== "approved" && (
            <Alert variant={result.status === "rejected" ? "danger" : "warning"} className="mt-3 mb-0">
              {result.message}
            </Alert>
          )}

          <div style={{ marginTop: "18px" }}>
            {buyerComplete && paymentMethod === "tarjeta" ? (
              // key fuerza a remontar el Brick si cambia el monto (p. ej. el
              // usuario edita el CP después de que ya se había montado): el
              // SDK de Mercado Pago lee `initialization.amount` una sola vez,
              // al montarse, no reacciona a cambios de props.
              <CardPayment
                key={`brick-${shippingMethod}-${total}`}
                initialization={{ amount: total, payer: { email: buyer.email } }}
                onSubmit={handlePaymentSubmit}
                onError={(error) => console.error("Error del Brick: ", error)}
              />
            ) : buyerComplete ? (
              <button
                onClick={handleManualSubmit}
                className="btn-brand"
                style={{ width: "100%", height: "46px", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px" }}
              >
                Confirmar pedido — ${Math.round(total).toLocaleString("es-AR")}
              </button>
            ) : (
              <div
                style={{
                  fontSize: "12.5px",
                  color: "var(--text-faint)",
                  background: "var(--bg-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                Completá tus datos de envío para continuar con el pago.
              </div>
            )}
          </div>

          <div className="mt-3">
            <button onClick={() => setStep("envio")} style={volverButtonStyle}>← Volver</button>
          </div>
          </div>
        </div>
      )}
    </Container>
  );
};
