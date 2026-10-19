import { useState } from "react";
import { MinusIcon, PlusIcon, CartIcon, WhatsappIcon } from "./icons";

// Verde de WhatsApp a propósito: es un código de color tan reconocido que
// dejarlo en la paleta neutra del sitio le resta claridad en vez de sumar
// coherencia — la única excepción a los tokens de acento del resto del sitio.
const WHATSAPP_GREEN = "#25d366";

const whatsappButtonStyle = (primary) => ({
  height: primary ? "48px" : "44px",
  border: primary ? "none" : `1px solid ${WHATSAPP_GREEN}`,
  borderRadius: "10px",
  background: primary ? WHATSAPP_GREEN : "rgba(37, 211, 102, 0.12)",
  color: primary ? "#0b0b10" : WHATSAPP_GREEN,
  fontWeight: 600,
  fontSize: primary ? "14px" : "13.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textDecoration: "none",
});

export const ItemCount = ({ stock, onAdd, whatsappUrl }) => {
  const [count, setCount] = useState(1);
  const sinStock = !stock || stock <= 0;

  const handleIncrease = () => {
    if (count < stock) setCount((prev) => prev + 1);
  };
  const handleDecrease = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };
  const handleAdd = () => {
    onAdd(count);
    setCount(1);
  };

  // Sin stock no hay nada para agregar: la consulta por WhatsApp pasa a ser
  // la acción principal, en el lugar del botón de compra.
  if (sinStock) {
    return (
      <a href={whatsappUrl} target="_blank" rel="noreferrer" style={whatsappButtonStyle(true)}>
        <WhatsappIcon size={17} />
        Consultar por WhatsApp
      </a>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ gap: "10px" }}>
      <div className="d-flex" style={{ gap: "12px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <button
            onClick={handleDecrease}
            style={{ width: "40px", height: "48px", border: "none", background: "var(--card-bg)", color: "var(--text)" }}
          >
            <MinusIcon size={13} />
          </button>
          <span style={{ width: "40px", textAlign: "center", fontWeight: 600, fontSize: "14px" }}>{count}</span>
          <button
            onClick={handleIncrease}
            style={{ width: "40px", height: "48px", border: "none", background: "var(--card-bg)", color: "var(--text)" }}
          >
            <PlusIcon size={13} />
          </button>
        </div>
        <button
          onClick={handleAdd}
          style={{
            flex: 1,
            height: "48px",
            background: "var(--accent)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <CartIcon size={17} />
          Agregar al carrito
        </button>
      </div>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" style={whatsappButtonStyle(false)}>
        <WhatsappIcon size={15} />
        Consultar por WhatsApp
      </a>
    </div>
  );
};
