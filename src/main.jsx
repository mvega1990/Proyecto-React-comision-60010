import React from 'react'
import ReactDOM from 'react-dom/client'
import { initMercadoPago } from '@mercadopago/sdk-react'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

// Para que el dueño (o quien pruebe el sitio desde la compu/celular propios)
// no ensucie las métricas de visitas: entrando una vez a cualquier página con
// ?no-track=1 queda guardado en ese navegador para siempre (hasta que borre
// los datos de navegación), sin afectar a ningún cliente real.
const NO_TRACK_KEY = 'baherramientas_no_track';
try {
  if (new URLSearchParams(window.location.search).get('no-track') === '1') {
    localStorage.setItem(NO_TRACK_KEY, '1');
  }
} catch { /* localStorage puede fallar en navegación privada, no es grave */ }
const sinSeguimiento = (() => {
  try { return localStorage.getItem(NO_TRACK_KEY) === '1'; } catch { return false; }
})();

// Google Analytics (GA4) - solo en build de producción, para no ensuciar las
// estadísticas reales con visitas de desarrollo local. El ID de medición no
// es un dato sensible (queda visible en el HTML de cualquier sitio con
// Analytics), por eso va hardcodeado en vez de en una env var.
if (import.meta.env.PROD && !sinSeguimiento) {
  const GA_MEASUREMENT_ID = 'G-QWBB5K83NZ';
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);

  // window.gtag (no una const local) - así queda expuesta globalmente, como
  // espera el propio script de Google y como haría falta para dispararla a
  // mano desde la consola del navegador al diagnosticar algo.
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => window.dataLayer.push(args);
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

// Microsoft Clarity - mapas de calor y grabaciones de sesión, gratis y sin
// depender de ninguna cuenta de Google (independiente del lío de Analytics).
// Snippet oficial de Clarity, solo en producción por el mismo motivo que GA.
if (import.meta.env.PROD && !sinSeguimiento) {
  const CLARITY_PROJECT_ID = 'zbknq4l72d';
  (function (c, l, a, r, i) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement('script');
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName('script')[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
}

// Cloudflare Web Analytics - visitas/páginas vistas y de dónde viene la
// gente, sin cookies. Gratis, independiente de Google y de Clarity.
if (import.meta.env.PROD && !sinSeguimiento) {
  const cfScript = document.createElement('script');
  cfScript.type = 'module';
  cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cfScript.setAttribute('data-cf-beacon', '{"token": "a482e1ad63b14cb0b67adec9ae977720"}');
  document.head.appendChild(cfScript);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)








