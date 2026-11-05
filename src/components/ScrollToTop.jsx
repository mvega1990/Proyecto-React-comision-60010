import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// React Router no resetea el scroll al navegar (a diferencia de una
// recarga normal de página) - si entrás a un producto estando scrolleado
// abajo del Home, la pantalla nueva arranca en ese mismo scroll en vez de
// arriba. Esto lo corrige en cada cambio de ruta.
//
// De paso, re-dispara el page_view de Analytics en cada cambio de ruta: al
// ser una SPA, gtag('config', ...) solo corre una vez (al cargar la página
// la primera vez, en main.jsx) - sin esto, Analytics vería solo la primera
// página de cada visita, nunca las que siguen navegando sin recargar.
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const esPrimeraRuta = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (esPrimeraRuta.current) {
      esPrimeraRuta.current = false;
      return;
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return null;
};
