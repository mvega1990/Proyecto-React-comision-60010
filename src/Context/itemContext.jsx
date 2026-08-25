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

  const fetchCart = () => {
    if (!user) {
      setItems([]);
      setCartId(null);
      return;
    }
    fetch(`${API_URL}/api/carts/mine`, { credentials: "include" })
      .then((res) => res.json())
      .then((cart) => applyCart(cart))
      .catch((error) => console.error("Error al traer el carrito: ", error));
  };

  // Cada vez que cambia quién está logueado, recarga el carrito (o lo vacía
  // si se deslogueó).
  useEffect(fetchCart, [user]);

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
    fetchCart();
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
      value={{ addItem, items, reset, removeItem, cartId, refreshCart: fetchCart }}
    >
      {children}
    </ItemContext.Provider>
  );
};
