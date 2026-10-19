import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL;

export const CategoryGrid = ({ categoriaActiva }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products/categories`)
      .then((res) => res.json())
      .then((data) => setCategorias(data.categories || []))
      .catch((error) => console.error("Error al traer las categorías: ", error));
  }, []);

  return (
    <div>
      <h5 className="mb-3" style={{ color: "var(--text)" }}>Categorías</h5>
      <ListGroup className="sidebar-list">
        {categorias.map((categoria) => (
          <ListGroup.Item
            key={categoria}
            as={Link}
            to={`/categoria/${categoria}`}
            active={categoria === categoriaActiva}
            action
          >
            {categoria}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};
