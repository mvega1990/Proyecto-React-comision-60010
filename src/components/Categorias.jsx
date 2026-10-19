import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { CATEGORY_PHOTOS } from "../constants/categoryPhotos";
import { CategoryTiles } from "./CategoryTiles";

const API_URL = import.meta.env.VITE_API_URL;

export const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products/categories`)
      .then((res) => res.json())
      .then(async (data) => {
        const nombres = data.categories || [];
        // Traemos una foto real representativa por categoría (si hay).
        const conFoto = await Promise.all(
          nombres.map(async (nombre) => {
            if (CATEGORY_PHOTOS[nombre]) {
              return { name: nombre, photo: CATEGORY_PHOTOS[nombre] };
            }
            const res = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(nombre)}&limit=1`);
            const productos = await res.json();
            return { name: nombre, photo: productos.payload?.[0]?.thumbnail || null };
          })
        );
        setCategorias(conFoto);
      })
      .catch((error) => console.error("Error al traer las categorías: ", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h3 className="mt-5 text-center">Cargando...</h3>;

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-4" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>Categorías</h2>
      <CategoryTiles items={categorias} />
    </Container>
  );
};
