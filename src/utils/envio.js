// Etiqueta de envío según el peso cargado en el producto:
// 0 kg = envío gratis; más de 20 kg = se coordina con el local.
export const etiquetaEnvio = (weight) => {
  if (weight === 0) return { texto: "Envío gratis", color: "var(--stock-ok)" };
  if (weight > 20) return { texto: "Envío a convenir", color: "var(--stock-low)" };
  return null;
};
