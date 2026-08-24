import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Mapea el producto tal como lo devuelve el backend (thumbnail, id) al shape
// que ya esperan los componentes de presentación (image, id) — así no hace
// falta tocar Item.jsx / ItemDetail.jsx.
const mapProduct = (p) => ({ ...p, id: p._id, image: p.thumbnail, marca: p.brand });

export const useList = (category) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 100 });
    if (category) params.set("category", category);

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
  }, [category]);

  return { list, loading };
};
