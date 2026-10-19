import { WhatsappIcon } from "./icons";
import { WHATSAPP_NUMBER } from "../constants/contact";

// Botón flotante fijo, visible en todas las páginas (mismo patrón que
// mundoobd.com y la mayoría de los ecommerce del rubro) — consulta general,
// separado del botón de "Consultar por WhatsApp" que ya tiene cada producto
// (ese manda el nombre/código puntual; este es para cualquier otra duda).
const MESSAGE = "Hola! Quería hacer una consulta.";
const URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

export const WhatsappFloatButton = () => (
  <a
    href={URL}
    target="_blank"
    rel="noreferrer"
    aria-label="Consultar por WhatsApp"
    style={{
      position: "fixed",
      right: "24px",
      bottom: "24px",
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: "#25d366",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 24px -4px rgba(0,0,0,0.5)",
      zIndex: 1000,
      color: "#fff",
    }}
  >
    <WhatsappIcon size={28} />
  </a>
);
