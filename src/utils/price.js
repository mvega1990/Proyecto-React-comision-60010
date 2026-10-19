// Política vigente de la tienda: 30% de descuento pagando en efectivo/transferencia,
// 6 cuotas sin interés calculadas sobre el precio de lista. Confirmado por el dueño
// de la tienda, se muestra siempre en tarjetas y fichas de producto.
export const CASH_DISCOUNT = 0.3;
const INSTALLMENTS = 6;

const fmt = (n) => Math.round(n).toLocaleString("es-AR");

// offerDiscount (opcional, 0-100): si el producto tiene un descuento de
// oferta propio cargado, reemplaza al 30% de siempre solo para ese producto.
export const getPriceBreakdown = (listPrice, offerDiscount) => {
  const discountFraction = offerDiscount ? offerDiscount / 100 : CASH_DISCOUNT;
  return {
    listPrice: fmt(listPrice),
    cashPrice: fmt(listPrice * (1 - discountFraction)),
    installment: fmt(listPrice / INSTALLMENTS),
    installments: INSTALLMENTS,
    discountPercent: discountFraction * 100,
    isOffer: Boolean(offerDiscount),
  };
};
