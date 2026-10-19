import { Link } from "react-router-dom";

// Grilla de tarjetas de categoría reutilizada en el Home (recorte a las
// primeras N + tarjeta "Ver todas") y en /categorias (listado completo).
export const CategoryTiles = ({ items, moreLink }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "22px",
    }}
  >
    {items.map(({ name, photo }) => (
      <Link key={name} to={`/categoria/${name}`} className="category-tile link-no-underline">
        {photo ? (
          <img src={photo} alt={name} className="category-tile-img" />
        ) : (
          <div className="category-tile-img" />
        )}
        <span className="category-tile-label">{name}</span>
      </Link>
    ))}
    {moreLink && (
      <Link to={moreLink.to} className="category-tile category-tile-more link-no-underline">
        <span className="category-tile-more-plus">+</span>
        <span className="category-tile-label">{moreLink.label}</span>
      </Link>
    )}
  </div>
);
