import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useList } from "../hooks/useList";
import { useMemberOffers } from "../hooks/useMemberOffers";
import { Item } from "./Item";
import { Logo } from "./Logo";
import { BRAND_LOGOS } from "../constants/brandLogos";
import { CATEGORY_PHOTOS } from "../constants/categoryPhotos";
import { CategoryTiles } from "./CategoryTiles";

// Selección a mano de 7 categorías para el Home (no las 11) — se sacaron
// "Herramientas manuales" y "Máquinas eléctricas" a pedido del dueño, entra
// "Cargadores y arrancadores" en su lugar. El resto de las categorías se ven
// en /categorias (tarjeta "Ver todas").
const HOME_CATEGORIES = [
  "Herramientas automotor",
  "Mobiliario",
  "Equipos electrónica",
  "Máquinas a batería",
  "Cargadores y arrancadores",
  "Scanners",
  "Cajas de herramientas",
];

const API_URL = import.meta.env.VITE_API_URL;

// Todas las slides son foto real de producto propio a pantalla completa (no
// es material de marketing de ninguna marca, es el mismo uso que ya le damos
// en las tarjetas de producto) + degradado oscuro encima para que el texto
// se lea. Elegidas porque tienen profundidad real (se nota el depósito de
// fondo), no el recorte sobre blanco que tiene la mayoría del catálogo.
//
// La de 30% OFF usa "stat" en vez de "title"+"text": un número grande y
// sólido con su label debajo, más un badge de cuotas — inspirado en cómo lo
// resuelven matiasherramientas.com.ar (bloques de estadística prolijos
// sobre una foto real), no en un degradado de colores con un número
// translúcido gigante (versión anterior, quedaba poco profesional).
const SLIDES = [
  {
    // Cartel de descuento estilo afiche — la línea "6 cuotas" / "30% OFF" en
    // grande, con sombra para que resalte sobre la foto, inspirado en cómo
    // lo resuelven matiasherramientas.com.ar y naranjotools.com.ar (cartel
    // grande sobre foto real + franja de envíos), pero con nuestros colores
    // en vez del amarillo/negro de esas dos.
    kicker: "SIEMPRE VIGENTE",
    poster: [
      { text: "Comprá en la web y pagá en", size: "19px" },
      { text: "6 CUOTAS SIN INTERÉS", size: "40px", big: true },
      { text: "o conseguí", size: "17px" },
      { text: "30% OFF", size: "58px", big: true },
      { text: "pagando en efectivo o transferencia", size: "14.5px", dim: true },
    ],
    shippingBadge: "Envíos a todo el país",
    cta: { label: "Ver catálogo", to: "/productos" },
    // Sin foto: ni matiasherramientas ni naranjotools usan una foto de
    // producto puntual en su cartel de descuento (una foto genérica de
    // mecánico, una textura de metal) — acá va un fondo con textura propia
    // en nuestros colores en vez de forzar una foto de catálogo que no pega.
    textured: true,
  },
  {
    kicker: "SIEMPRE ALGO NUEVO",
    title: "Novedades todas las semanas.",
    text: "Sumamos herramientas y equipamiento nuevo constantemente al catálogo — no te pierdas las últimas incorporaciones.",
    cta: { label: "Ver novedades", to: "/productos?sort=newest" },
    image: "https://res.cloudinary.com/l7bggfei/image/upload/v1788313354/ba-herramientas/productos/ydqhxk2zrusitak8uohj.jpg",
  },
  {
    kicker: "DIAGNÓSTICO",
    title: "Scanners para tu taller.",
    text: "Equipos multimarca para diagnóstico automotriz rápido y preciso.",
    cta: { label: "Ver scanners", to: "/categoria/Scanners" },
    shippingBadge: { title: "Envío gratis", subtitle: ["en Scanners y Electrónica", "en compras desde $300.000"] },
    image: "https://res.cloudinary.com/l7bggfei/image/upload/v1788310360/ba-herramientas/productos/v5cnjsmawhrtikfoyoym.png",
  },
];

const ArrowButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === "prev" ? "Slide anterior" : "Slide siguiente"}
    style={{
      position: "absolute",
      top: "50%",
      [direction === "prev" ? "left" : "right"]: "16px",
      transform: "translateY(-50%)",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(11,11,16,0.35)",
      color: "var(--text-dim)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 2,
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === "prev" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  </button>
);

const HeroCarousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setActive((i) => (i + 1) % SLIDES.length);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "440px",
        background: "#0B0B10",
        overflow: "hidden",
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.kicker}
          className={`hero-slide${i === active ? " active" : ""}`}
          style={{ position: i === 0 ? "relative" : "absolute", inset: 0 }}
        >
          {slide.textured ? (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(155deg, #1a1a3a 0%, #0b0b10 65%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 80% 25%, rgba(34,211,238,0.16) 0%, transparent 55%)",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.5,
                  backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 26px)",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: "-60px",
                  top: "50%",
                  transform: "translateY(-50%) rotate(-8deg)",
                  opacity: 0.16,
                  pointerEvents: "none",
                }}
              >
                <Logo size={420} />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(11,11,16,0.95) 0%, rgba(11,11,16,0.82) 42%, rgba(11,11,16,0.35) 100%)",
                }}
              />
            </>
          )}

          {/* Badge simple (string): flota a la derecha de la foto, como en la
              slide de 30% OFF, que no tiene bloque de texto compitiendo ahí. */}
          {slide.shippingBadge && typeof slide.shippingBadge === "string" && (
            <div
              style={{
                position: "absolute",
                right: "48px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "var(--accent-2)",
                padding: "16px 30px",
                borderRadius: "12px",
                boxShadow: "0 12px 30px -8px rgba(34,211,238,0.5)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b0b10" strokeWidth="1.7" style={{ flexShrink: 0 }}>
                <path d="M3 17V9l2-4h9v12M14 9h4l3 3v5h-2M3 17h10M3 17a2 2 0 1 0 4 0M13 17a2 2 0 1 0 4 0M17 17a2 2 0 1 0 4 0" />
              </svg>
              <span style={{ fontSize: "24px", color: "#0b0b10", fontWeight: 700 }}>{slide.shippingBadge}</span>
            </div>
          )}

          <div style={{ position: "relative", height: "100%", padding: "72px 40px" }}>
            <Container className="d-flex align-items-center h-100">
              <div style={{ maxWidth: "560px" }}>
                <div
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(90deg, var(--accent-3), var(--accent-2))",
                    color: "#0b0b10",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "100px",
                    marginBottom: "18px",
                  }}
                >
                  {slide.kicker}
                </div>

                {slide.poster ? (
                  <div style={{ marginBottom: "22px" }}>
                    {slide.poster.map((line, li) => (
                      <div
                        key={li}
                        style={{
                          fontSize: line.size,
                          fontWeight: line.big ? 700 : 500,
                          color: line.dim ? "var(--text-dim)" : line.big ? "var(--accent-2)" : "var(--text)",
                          lineHeight: line.big ? 1.05 : 1.4,
                          textShadow: line.big ? "0 3px 18px rgba(34,211,238,0.3)" : "none",
                          marginTop: li === 0 ? 0 : "4px",
                        }}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                ) : slide.stat ? (
                  <>
                    <div style={{ fontSize: "56px", fontWeight: 700, color: "var(--accent-2)", lineHeight: 1.05 }}>
                      {slide.stat.value}
                    </div>
                    <p style={{ fontSize: "17px", color: "var(--text)", marginTop: "8px", marginBottom: "18px" }}>
                      {slide.stat.label}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 style={{ fontSize: "42px", fontWeight: 700, color: "var(--text)", marginBottom: "14px", lineHeight: 1.1 }}>
                      {slide.title}
                    </h1>
                    <p style={{ fontSize: "16px", color: "var(--text-dim)", marginBottom: slide.shippingBadge && typeof slide.shippingBadge !== "string" ? "18px" : "26px", maxWidth: "460px" }}>
                      {slide.text}
                    </p>
                  </>
                )}

                {/* Badge de envío detallado (objeto): en el flujo del texto,
                    pegado al párrafo, no flotando en una esquina aparte. */}
                {slide.shippingBadge && typeof slide.shippingBadge !== "string" && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "var(--accent-2)",
                      padding: "14px 22px",
                      borderRadius: "12px",
                      marginBottom: "24px",
                      boxShadow: "0 10px 26px -6px rgba(34,211,238,0.6), 0 0 0 1px rgba(125,247,255,0.5)",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0b0b10" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                      <path d="M3 17V9l2-4h9v12M14 9h4l3 3v5h-2M3 17h10M3 17a2 2 0 1 0 4 0M13 17a2 2 0 1 0 4 0M17 17a2 2 0 1 0 4 0" />
                    </svg>
                    <div>
                      <div style={{ fontSize: "18px", color: "#0b0b10", fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>
                        {slide.shippingBadge.title}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#0b0b10", fontWeight: 600, opacity: 0.78, marginTop: "2px", whiteSpace: "nowrap" }}>
                        {(Array.isArray(slide.shippingBadge.subtitle) ? slide.shippingBadge.subtitle : [slide.shippingBadge.subtitle]).join(" · ")}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Link to={slide.cta.to}>
                    <Button className="btn-brand" style={{ fontSize: "15px", padding: "14px 28px" }}>
                      {slide.cta.label}
                    </Button>
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        </div>
      ))}

      <ArrowButton direction="prev" onClick={goPrev} />
      <ArrowButton direction="next" onClick={goNext} />

      <div style={{ position: "absolute", bottom: "20px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "8px" }}>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.kicker}
            onClick={() => setActive(i)}
            aria-label={`Ver slide ${i + 1}`}
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === active ? "var(--accent-2)" : "var(--border)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const RowArrowButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === "prev" ? "Ver anteriores" : "Ver siguientes"}
    style={{
      position: "absolute",
      top: "50%",
      [direction === "prev" ? "left" : "right"]: "-16px",
      transform: "translateY(-50%)",
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      border: "1px solid var(--border)",
      background: "var(--card-bg)",
      color: "var(--text-dim)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 2,
      boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
    }}
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === "prev" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  </button>
);

const ProductRow = ({ title, list, loading, emptyOk = false, to }) => {
  const scrollRef = useRef(null);

  if (!loading && list.length === 0 && emptyOk) return null;

  // Sin "behavior: smooth": en algunos navegadores el scroll animado por JS
  // no se aplica de forma confiable. El scroll instantáneo siempre funciona.
  const scrollByCards = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 620 });
  };

  const heading = (
    <h2
      style={{
        fontSize: "22px",
        color: "var(--text)",
        marginBottom: "18px",
        borderLeft: "4px solid var(--accent-2)",
        paddingLeft: "14px",
      }}
    >
      {title}
      {to && (
        <span style={{ fontSize: "13px", color: "var(--accent-2)", fontWeight: 500, marginLeft: "10px" }}>
          Ver todas →
        </span>
      )}
    </h2>
  );

  return (
    <Container className="mt-5">
      {to ? (
        <Link to={to} className="link-no-underline">
          {heading}
        </Link>
      ) : (
        heading
      )}
      {loading ? (
        <p style={{ color: "var(--text-dim)" }}>Cargando...</p>
      ) : (
        <div style={{ position: "relative" }}>
          <div className="h-scroll-row" ref={scrollRef}>
            {list.map((item) => (
              <Item key={item.id} herramienta={item} />
            ))}
          </div>
          {list.length > 3 && (
            <>
              <RowArrowButton direction="prev" onClick={() => scrollByCards(-1)} />
              <RowArrowButton direction="next" onClick={() => scrollByCards(1)} />
            </>
          )}
        </div>
      )}
    </Container>
  );
};

const CategoryShowcase = () => {
  const items = HOME_CATEGORIES.map((name) => ({ name, photo: CATEGORY_PHOTOS[name] }));
  const hasMore = Object.keys(CATEGORY_PHOTOS).length > HOME_CATEGORIES.length;

  return (
    <Container className="mt-5">
      <h2
        style={{
          fontSize: "22px",
          color: "var(--text)",
          marginBottom: "18px",
          borderLeft: "4px solid var(--accent-2)",
          paddingLeft: "14px",
        }}
      >
        Categorías
      </h2>
      <CategoryTiles items={items} moreLink={hasMore ? { to: "/categorias", label: "Ver todas" } : null} />
    </Container>
  );
};

const BrandsStrip = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch(() => setBrands([]));
  }, []);

  if (brands.length === 0) return null;

  const brandTile = (brand, key) => {
    const logo = BRAND_LOGOS[brand];
    return (
      <Link key={key} to={`/marca/${brand}`} className="link-no-underline">
        {logo ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              width: "110px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <img src={logo} alt={brand} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
        ) : (
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "14px 22px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "var(--text-dim)",
              whiteSpace: "nowrap",
            }}
          >
            {brand}
          </div>
        )}
      </Link>
    );
  };

  return (
    <Container className="mt-5 mb-5">
      <h2 style={{ fontSize: "18px", color: "var(--text)", marginBottom: "16px" }}>Nuestras marcas</h2>
      <div className="brands-marquee-viewport">
        <div className="brands-marquee-track">
          {brands.map((brand) => brandTile(brand, `a-${brand}`))}
          {/* Copia idéntica pegada atrás: el loop se ve continuo porque cuando
              la primera tanda termina de salir, la segunda ya está calcada en
              su lugar — sin este duplicado se notaría el salto al reiniciar. */}
          {brands.map((brand) => brandTile(brand, `b-${brand}`))}
        </div>
      </div>
    </Container>
  );
};

export const Home = () => {
  const { list: scanners, loading: loadingScanners } = useList("Scanners", null, null, null, { limit: 12 });
  const { list: destacados, loading: loadingDestacados } = useList(null, null, null, null, { featured: true, limit: 12 });
  // Elegidas a mano por el dueño (campo newArrival), no automático por fecha de
  // carga - mientras se termina de migrar el catálogo viejo, "recién
  // cargado" no es lo mismo que "es una novedad real". El sort=newest
  // genérico sigue existiendo en /productos para quien quiera ordenar así.
  const { list: novedades, loading: loadingNovedades } = useList(null, null, null, null, { newArrival: true, limit: 12 });
  const { list: ofertasSocios, loading: loadingOfertasSocios, user } = useMemberOffers();

  return (
    <div>
      <HeroCarousel />
      <CategoryShowcase />
      <ProductRow title="Scanners" list={scanners} loading={loadingScanners} emptyOk to="/categoria/Scanners" />
      <ProductRow title="Destacados" list={destacados} loading={loadingDestacados} emptyOk />
      {user && (
        <ProductRow title="Ofertas para socios" list={ofertasSocios} loading={loadingOfertasSocios} emptyOk />
      )}
      <ProductRow title="Novedades" list={novedades} loading={loadingNovedades} emptyOk />
      <BrandsStrip />
    </div>
  );
};
