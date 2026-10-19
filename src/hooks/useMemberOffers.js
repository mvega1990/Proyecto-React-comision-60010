import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/authContext";

const API_URL = import.meta.env.VITE_API_URL;

// Ofertas exclusivas para clientes con cuenta. Solo pide la lista si hay sesión.
export const useMemberOffers = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      setList([]);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/api/products/member-offers`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { payload: [] }))
      .then((data) =>
        setList((data.payload || []).map((p) => ({ ...p, id: p._id, image: p.thumbnail, marca: p.brand })))
      )
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [user, loadingAuth]);

  return { list, loading, user };
};
