import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router no resetea el scroll al navegar (a diferencia de una
// recarga normal de página) - si entrás a un producto estando scrolleado
// abajo del Home, la pantalla nueva arranca en ese mismo scroll en vez de
// arriba. Esto lo corrige en cada cambio de ruta.
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
