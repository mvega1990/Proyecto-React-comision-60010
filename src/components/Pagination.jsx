// Paginación numerada simple, con elipsis cuando hay muchas páginas.
// Estilo a mano (no react-bootstrap Pagination) para que combine con el
// tema oscuro del resto del sitio, mismo patrón de tokens que ArrowButton
// en Home.jsx.
const pageButtonStyle = (active) => ({
  minWidth: "36px",
  height: "36px",
  padding: "0 8px",
  borderRadius: "8px",
  border: `1px solid ${active ? "var(--accent-2)" : "var(--border)"}`,
  background: active ? "var(--accent-2)" : "var(--card-bg-alt)",
  color: active ? "#0b0b10" : "var(--text)",
  fontWeight: active ? 700 : 500,
  fontSize: "14px",
  cursor: "pointer",
  transition: "background 0.15s, border-color 0.15s",
});

const navButtonStyle = (disabled) => ({
  ...pageButtonStyle(false),
  opacity: disabled ? 0.35 : 1,
  cursor: disabled ? "default" : "pointer",
  color: "var(--text)",
});

const buildPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withGaps = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withGaps.push("...");
    withGaps.push(p);
  });
  return withGaps;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap mt-4 mb-2">
      <button style={navButtonStyle(currentPage === 1)} disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)} aria-label="Página anterior">
        ‹
      </button>
      {buildPageList(currentPage, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} style={{ color: "var(--text-faint)", padding: "0 4px" }}>…</span>
        ) : (
          <button key={p} style={pageButtonStyle(p === currentPage)} onClick={() => goTo(p)}>
            {p}
          </button>
        )
      )}
      <button style={navButtonStyle(currentPage === totalPages)} disabled={currentPage === totalPages} onClick={() => goTo(currentPage + 1)} aria-label="Página siguiente">
        ›
      </button>
    </div>
  );
};
