import React from 'react'
import ReactDOM from 'react-dom/client'
import { initMercadoPago } from '@mercadopago/sdk-react'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

// Google Analytics (GA4) - solo en build de producción, para no ensuciar las
// estadísticas reales con visitas de desarrollo local. El ID de medición no
// es un dato sensible (queda visible en el HTML de cualquier sitio con
// Analytics), por eso va hardcodeado en vez de en una env var.
if (import.meta.env.PROD) {
  const GA_MEASUREMENT_ID = 'G-3F6TS3MPCV';
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args) => window.dataLayer.push(args);
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)








