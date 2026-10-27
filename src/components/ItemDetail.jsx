import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { ItemCount } from "./ItemCount";
import { PriceBlock } from "./PriceBlock";
import { etiquetaEnvio } from "../utils/envio";
import { CheckIcon, TruckIcon, InstallmentsIcon, ShieldIcon, WhatsappIcon } from "./icons";
import { WHATSAPP_NUMBER } from "../constants/contact";

// Verde de WhatsApp a propósito, mismo criterio que ItemCount.jsx.
const WHATSAPP_GREEN = "#25d366";

// Las descripciones se escriben en texto plano con una convención simple:
// líneas que empiezan con "•" son ítems de una lista, líneas cortas
// terminadas en ":" son encabezados de sección, y "Etiqueta: resto" en una
// sola línea resalta solo la etiqueta. Esto le da más jerarquía visual sin
// tener que guardar HTML/Markdown en la base.
const parseDescriptionBlocks = (text) => {
  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: "list", items: currentList });
      currentList = null;
    }
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("•")) {
      currentList = currentList || [];
      currentList.push(line.replace(/^•\s*/, ""));
      continue;
    }
    flushList();
    const headerMatch = line.match(/^([^:]{2,60}):$/);
    const labelMatch = line.match(/^([^:]{2,40}):\s+(.+)$/);
    if (headerMatch) {
      blocks.push({ type: "header", text: headerMatch[1] });
    } else if (labelMatch) {
      blocks.push({ type: "label", label: labelMatch[1], rest: labelMatch[2] });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }
  flushList();
  return blocks;
};

const FormattedDescription = ({ text }) => {
  const blocks = parseDescriptionBlocks(text);
  return (
    <div>
      {blocks.map((b, i) => {
        if (b.type === "header") {
          return (
            <h4
              key={i}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                borderLeft: "3px solid var(--accent-2)",
                paddingLeft: "10px",
                margin: i === 0 ? "0 0 12px" : "22px 0 12px",
              }}
            >
              {b.text}
            </h4>
          );
        }
        if (b.type === "list") {
          return (
            <ul
              key={i}
              style={{ listStyle: "none", padding: 0, margin: "0 0 4px", display: "flex", flexDirection: "column", gap: "9px" }}
            >
              {b.items.map((item, j) => (
                <li key={j} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--accent-2)", flexShrink: 0 }}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "label") {
          return (
            <p key={i} style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.75, margin: "0 0 8px" }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>{b.label}:</strong> {b.rest}
            </p>
          );
        }
        return (
          <p key={i} style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.75, margin: i === 0 ? "0 0 16px" : "0 0 8px" }}>
            {b.text}
          </p>
        );
      })}
    </div>
  );
};

export const ItemDetail = ({ item, onAdd }) => {
  // Foto principal + galería opcional (item.images) — la mayoría de los
  // productos solo tiene la principal, así que la galería solo se arma si
  // hay algo más para mostrar.
  const gallery = [item.image, ...(item.images || [])].filter(Boolean);
  const [activeImage, setActiveImage] = useState(item.image);
  const shownImage = gallery.includes(activeImage) ? activeImage : item.image;

  const stock = item.stock ?? 0;
  const stockLabel = stock <= 0 ? "SIN STOCK" : stock === 1 ? "ÚLTIMAS UNIDADES" : "CON STOCK";
  const stockColor = stock <= 0 ? "var(--text-faint)" : stock === 1 ? "var(--stock-low)" : "var(--stock-ok)";
  const stockTint = stock <= 0 ? "rgba(110,110,130,0.14)" : stock === 1 ? "rgba(245,166,35,0.14)" : "rgba(52,211,153,0.14)";

  const whatsappMessage = `Hola! Quería consultar por "${item.title}"${item.code ? ` (código ${item.code})` : ""}.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Los scanners tienen mucha más info técnica de la que entra en la ficha
  // (protocolos, compatibilidad por marca, etc.) — se ofrece pedirla por
  // WhatsApp en vez de volcar todo en la descripción.
  const isScanner = item.category === "Scanners";
  const fichaTecnicaMessage = `Hola! Quería pedir la ficha técnica completa de "${item.title}"${item.code ? ` (código ${item.code})` : ""}.`;
  const fichaTecnicaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fichaTecnicaMessage)}`;

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "1100px" }}>
      <div style={{ fontSize: "12.5px", color: "var(--text-faint)", marginBottom: "24px" }}>
        <Link to="/" style={{ color: "var(--text-faint)" }}>Inicio</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <Link to="/productos" style={{ color: "var(--text-faint)" }}>Productos</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--text-dim)" }}>{item.title}</span>
      </div>

      <div className="d-flex flex-wrap" style={{ gap: "48px", alignItems: "flex-start" }}>
        {/* Columna izquierda: foto + descripción libre (no todo producto tiene ficha técnica completa) */}
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <div
            style={{
              background: "var(--card-bg-alt)",
              borderRadius: "20px",
              padding: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "360px",
            }}
          >
            <img
              src={shownImage}
              alt={item.title}
              style={{ maxWidth: "100%", maxHeight: "290px", objectFit: "contain" }}
            />
          </div>

          {gallery.length > 1 && (
            <div className="d-flex" style={{ gap: "10px", marginTop: "14px" }}>
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImage(src)}
                  style={{
                    width: "64px",
                    height: "64px",
                    padding: "6px",
                    borderRadius: "10px",
                    border: `2px solid ${shownImage === src ? "var(--accent-2)" : "var(--border)"}`,
                    background: "var(--card-bg-alt)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </button>
              ))}
            </div>
          )}

          {item.description && (
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "24px 26px",
                marginTop: "22px",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Descripción</h3>
              <FormattedDescription text={item.description} />

              {isScanner && (
                <a
                  href={fichaTecnicaUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "20px",
                    height: "42px",
                    borderRadius: "10px",
                    border: `1px solid ${WHATSAPP_GREEN}`,
                    background: "rgba(37, 211, 102, 0.12)",
                    color: WHATSAPP_GREEN,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <WhatsappIcon size={15} />
                  Pedir ficha técnica completa
                </a>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: lo justo para decidir y comprar */}
        <div style={{ width: "380px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "11.5px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
              {item.marca}
            </div>
            <h1 style={{ fontSize: "27px", fontWeight: 700, marginTop: "6px", lineHeight: 1.2 }}>{item.title}</h1>
          </div>

          <div className="d-flex align-items-center" style={{ gap: "14px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: stockTint,
                border: `1px solid ${stockColor}`,
                color: stockColor,
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 11px",
                borderRadius: "7px",
              }}
            >
              {stock > 0 && <CheckIcon size={12} />}
              {stockLabel}
            </span>
            {item.code && <span style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>Código: {item.code}</span>}
          </div>

          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 20px" }}>
            {stock > 0 ? (
              <>
                <PriceBlock price={item.price} offerDiscount={item.offerDiscount} size="detail" />
                {etiquetaEnvio(item.weight) && (
                  <div style={{ fontSize: "15px", fontWeight: 600, color: etiquetaEnvio(item.weight).color, marginTop: "10px" }}>
                    {etiquetaEnvio(item.weight).texto}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: "18px", color: "var(--text-dim)", fontWeight: 600 }}>Consultar precio</div>
            )}
          </div>

          <ItemCount stock={item.stock} onAdd={onAdd} whatsappUrl={whatsappUrl} />

          <div className="d-flex" style={{ gap: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <div className="d-flex align-items-center" style={{ gap: "7px" }}>
              <TruckIcon size={18} />
              <span style={{ fontSize: "11.5px", color: "var(--text-dim)" }}>Envíos al país</span>
            </div>
            <div className="d-flex align-items-center" style={{ gap: "7px" }}>
              <InstallmentsIcon size={18} />
              <span style={{ fontSize: "11.5px", color: "var(--text-dim)" }}>6 cuotas s/int.</span>
            </div>
            <div className="d-flex align-items-center" style={{ gap: "7px" }}>
              <ShieldIcon size={18} />
              <span style={{ fontSize: "11.5px", color: "var(--text-dim)" }}>Garantía oficial</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
