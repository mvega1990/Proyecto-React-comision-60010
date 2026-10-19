import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const API_URL = import.meta.env.VITE_API_URL;

export const ItemContext = createContext();

export const Provider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  // Mapea el carrito tal como lo devuelve el backend
  // ({ _id, products: [{ product, quantity }] }) al shape plano que ya
  // usaban los componentes (items: [{ ...producto, quantity }]).
  const applyCart = (cart) => {
    setCartId(cart._id);
    setItems(
      (cart.products || [])
        .filter((p) => p.product)
        .map((p) => ({
          ...p.product,
          id: p.product._id,
          image: p.product.thumbnail,
          quantity: p.quantity,
        }))
    );
  };

  // No hace falta estar logueado para tener carrito: si no hay ninguna
  // cookie válida todavía (primera visita, o te deslogueaste), le pedimos
  // uno de invitado al backend y reintentamos. Si hay sesión de verdad,
  // /api/carts/mine ya devuelve el carrito real de la cuenta.
  const fetchCart = async () => {
    try {
      let res = await fetch(`${API_URL}/api/carts/mine`, { credentials: "include" });
      if (res.status === 401) {
        const guestRes = await fetch(`${API_URL}/api/session/guest`, {
          method: "POST",
          credentials: "include",
        });
        if (!guestRes.ok) throw new Error("No se pudo iniciar el carrito");
        res = await fetch(`${API_URL}/api/carts/mine`, { credentials: "include" });
      }
      if (!res.ok) throw new Error("No se pudo traer el carrito");
      applyCart(await res.json());
    } catch (error) {
      console.error("Error al traer el carrito: ", error);
    }
  };

  // Cada vez que cambia quién está logueado, recarga el carrito (fetchCart
  // es async, así que no puede pasarse directo como efecto: React espera que
  // el efecto en sí sea sincrónico y devuelva, como mucho, una función de
  // limpieza).
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addItem = async (item) => {
    if (!cartId) {
      alert("No se pudo identificar tu carrito. Volvé a iniciar sesión e intentá de nuevo.");
      return;
    }
    const current = items.find((i) => i.id === item.id);
    const target = (current?.quantity || 0) + item.quantity;

    // POST siempre suma de a 1 (crea el renglón si no existía). El PUT de
    // después es el que deja la cantidad exacta que eligió el usuario.
    const addRes = await fetch(`${API_URL}/api/carts/${cartId}/product/${item.id}`, {
      method: "POST",
      credentials: "include",
    });
    if (!addRes.ok) {
      alert("No se pudo agregar el producto al carrito. Probá de nuevo.");
      return;
    }
    const putRes = await fetch(`${API_URL}/api/carts/${cartId}/products/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity: target }),
    });
    if (!putRes.ok) {
      alert("No se pudo ajustar la cantidad. Probá de nuevo.");
    }
    await fetchCart();
  };

  // Deja la cantidad de un renglón ya existente en un valor exacto (los +/-
  // del carrito). Optimista: actualiza el estado local ya mismo para que el
  // stepper responda al toque, y sincroniza con fetchCart al final por si el
  // backend recortó la cantidad (ej. no había más stock).
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    const res = await fetch(`${API_URL}/api/carts/${cartId}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      alert("No se pudo ajustar la cantidad. Probá de nuevo.");
    }
    await fetchCart();
  };

  const removeItem = async (id) => {
    await fetch(`${API_URL}/api/carts/${cartId}/product/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchCart();
  };

  const reset = async () => {
    await fetch(`${API_URL}/api/carts/${cartId}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchCart();
  };

  return (
    <ItemContext.Provider
      value={{ addItem, items, reset, removeItem, updateQuantity, cartId, refreshCart: fetchCart }}
    >
      {children}
    </ItemContext.Provider>
  );
};
