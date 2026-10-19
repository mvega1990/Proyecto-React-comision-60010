import { getPriceBreakdown } from "../utils/price";

// Orden pedido: precio normal (sin tachar) arriba, cuotas debajo, y el precio con
// descuento de contado resaltado como un cintillo aparte al final.
export const PriceBlock = ({ price, offerDiscount, size = "card" }) => {
  const { listPrice, cashPrice, installment, installments, discountPercent, isOffer } = getPriceBreakdown(price, offerDiscount);
  const big = size === "detail";

  return (
    <div>
      <div style={{ fontSize: big ? "28px" : "19px", fontWeight: 700, lineHeight: 1.3 }}>
        ${listPrice}
      </div>
      <div style={{ fontSize: big ? "13.5px" : "11.5px", color: "var(--text-dim)", marginBottom: "8px" }}>
        {installments} cuotas sin interés de ${installment}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: "6px",
          background: isOffer ? "rgba(245, 166, 35, 0.14)" : "rgba(34, 211, 238, 0.12)",
          border: `1px solid ${isOffer ? "var(--stock-low)" : "var(--accent-2)"}`,
          borderRadius: "8px",
          padding: big ? "8px 12px" : "6px 10px",
        }}
      >
        {isOffer && (
          <span style={{ fontSize: big ? "11px" : "9.5px", fontWeight: 700, color: "var(--stock-low)", textTransform: "uppercase" }}>
            Oferta
          </span>
        )}
        <span style={{ fontSize: big ? "20px" : "15px", fontWeight: 700, color: isOffer ? "var(--stock-low)" : "var(--accent-2)" }}>
          ${cashPrice}
        </span>
        <span style={{ fontSize: big ? "12px" : "10.5px", color: "var(--text-dim)" }}>
          efectivo/transferencia ({discountPercent}% OFF)
        </span>
      </div>
    </div>
  );
};
