import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Mapea el producto tal como lo devuelve el backend (thumbnail, id) al shape
// que ya esperan los componentes de presentación (image, id) — así no hace
// falta tocar Item.jsx / ItemDetail.jsx.
const mapProduct = (p) => ({ ...p, id: p._id, image: p.thumbnail, marca: p.brand });

export const useList = (category, sort, brand, search, options = {}) => {
  const { onSale, featured, limit = 24, page = 1 } = options;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort); // "asc" | "desc" | "newest", el backend ya lo soporta
    if (brand) params.set("brand", brand);
    if (search) params.set("search", search);
    if (onSale) params.set("onSale", "true");
    if (featured) params.set("featured", "true");

    fetch(`${API_URL}/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setList((data.payload || []).map(mapProduct));
        setTotalPages(data.totalPages || 1);
        setHasNextPage(Boolean(data.hasNextPage));
        setHasPrevPage(Boolean(data.hasPrevPage));
      })
      .catch((error) => {
        console.error("Error al traer productos: ", error);
        setList([]);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPrevPage(false);
      })
      .finally(() => setLoading(false));
  }, [category, sort, brand, search, onSale, featured, limit, page]);

  return { list, loading, totalPages, hasNextPage, hasPrevPage };
};
