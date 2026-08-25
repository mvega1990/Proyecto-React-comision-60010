import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Mapea el producto tal como lo devuelve el backend (thumbnail, id) al shape
// que ya esperan los componentes de presentación (image, id) — así no hace
// falta tocar Item.jsx / ItemDetail.jsx.
const mapProduct = (p) => ({ ...p, id: p._id, image: p.thumbnail, marca: p.brand });

export const useList = (category, sort, brand, search) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 100 });
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort); // "asc" | "desc", el backend ya lo soporta
    if (brand) params.set("brand", brand);
    if (search) params.set("search", search);

    fetch(`${API_URL}/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setList((data.payload || []).map(mapProduct));
      })
      .catch((error) => {
        console.error("Error al traer productos: ", error);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, [category, sort, brand, search]);

  return { list, loading };
};
