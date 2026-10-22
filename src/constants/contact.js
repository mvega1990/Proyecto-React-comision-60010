// TODO: completar con los datos bancarios reales antes de salir al público.
// Esto se muestra tal cual en el checkout cuando alguien elige "Transferencia".
export const BANK_DETAILS = {
  alias: "PENDIENTE.COMPLETAR",
  cbu: "0000000000000000000000",
  cuit: "00-00000000-0",
  titular: "COMPLETAR TITULAR",
  banco: "COMPLETAR BANCO",
};

export const WHATSAPP_NUMBER = "5491171002357";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = "https://instagram.com/baherramientas";
export const INSTAGRAM_HANDLE = "@baherramientas";
export const EMAIL = "ventasbaherramientas@gmail.com";
export const ZONA = "Ramos Mejía y Ciudadela, Buenos Aires";
export const HORARIOS = ["Lunes a viernes: 9 a 19 hs", "Sábados: 9 a 16 hs"];

// Dos direcciones reales, con función distinta: el showroom es para ver
// mercadería (con cita previa) y el depósito es SOLO para retiro/entrega,
// no atiende al público. Usado en la página Nosotros/Contacto (mapa +
// horario por ubicación).
export const UBICACIONES = [
  {
    key: "showroom",
    nombre: "Showroom (previa cita)",
    direccion: "Av. Díaz Vélez 1333, Ramos Mejía",
    horario: "Lunes a viernes: 10 a 17 hs",
    mapsQuery: "Av. Díaz Vélez 1333, Ramos Mejía, Buenos Aires",
  },
  {
    key: "deposito",
    nombre: "Depósito (solo entrega de mercadería)",
    direccion: "Alianza 783, depto. 3, Ciudadela Sur",
    horario: "Lunes a viernes: 9 a 18 hs",
    mapsQuery: "Alianza 783, Ciudadela, Buenos Aires",
  },
];
