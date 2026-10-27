import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { PriceBlock } from "./PriceBlock";
import { etiquetaEnvio } from "../utils/envio";

// Mismo alcance que la franja de promo del header: envío gratis en compras
// +$300.000 en Scanners y Equipos electrónica.
const FREE_SHIPPING_CATEGORIES = ["Scanners", "Equipos electrónica"];

export const Item = ({ herramienta }) => {
  const stock = herramienta.stock ?? 0;
  const stockLabel = stock <= 0 ? "SIN STOCK" : stock === 1 ? "ÚLTIMAS UNIDADES" : "CON STOCK";
  const stockColor = stock <= 0 ? "var(--text-faint)" : stock === 1 ? "var(--stock-low)" : "var(--stock-ok)";
  const hasFreeShipping = FREE_SHIPPING_CATEGORIES.includes(herramienta.category);

  return (
    <Card
      style={{
        width: "18rem",
        padding: "1rem",
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <Link to={`/item/${herramienta.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ position: "relative" }}>
          <Card.Img
            variant="top"
            src={herramienta.image}
            style={{ height: "200px", objectFit: "contain", backgroundColor: "var(--card-bg-alt)" }}
          />
          <span
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: stockColor,
              color: "#0b0b10",
              fontSize: "10px",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            {stockLabel}
          </span>
          {hasFreeShipping && (
            <span
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "linear-gradient(90deg, var(--accent-3), var(--accent-2))",
                color: "#0b0b10",
                fontSize: "10px",
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: "6px",
                boxShadow: "0 3px 10px -2px rgba(34,211,238,0.55)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0b0b10" strokeWidth="2.2">
                <path d="M3 17V9l2-4h9v12M14 9h4l3 3v5h-2M3 17h10M3 17a2 2 0 1 0 4 0M13 17a2 2 0 1 0 4 0M17 17a2 2 0 1 0 4 0" />
              </svg>
              Envío gratis
            </span>
          )}
        </div>
      </Link>
      <Card.Body>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
          {herramienta.marca}
        </div>
        <Link to={`/item/${herramienta.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Card.Title style={{ minHeight: "50px", fontSize: "15px" }}>
            {herramienta.title}
          </Card.Title>
        </Link>
        <div className="mb-2">
          {stock > 0 ? (
            <>
              <PriceBlock price={herramienta.price} offerDiscount={herramienta.offerDiscount} size="card" />
              {etiquetaEnvio(herramienta.weight) && (
                <div style={{ fontSize: "12px", fontWeight: 600, color: etiquetaEnvio(herramienta.weight).color, marginTop: "6px" }}>
                  {etiquetaEnvio(herramienta.weight).texto}
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--text-dim)", fontWeight: 600 }}>Consultar precio</div>
          )}
        </div>
        <Link to={`/item/${herramienta.id}`}>
          <Button className="btn-brand">Mas info</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};
