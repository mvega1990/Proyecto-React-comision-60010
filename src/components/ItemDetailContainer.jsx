
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemContext } from "../Context/itemContext";
import { AuthContext } from "../Context/authContext";
import { ItemDetail } from "./ItemDetail"; // Importa el nuevo componente

const API_URL = import.meta.env.VITE_API_URL;

export const ItemDetailContainer = () => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { addItem } = useContext(ItemContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem({
          ...data.product,
          id: data.product._id,
          image: data.product.thumbnail,
          marca: data.product.brand,
        });
      })
      .catch((error) => console.error("Error al traer el producto: ", error))
      .finally(() => setLoading(false));
  }, [id]);

  const onAdd = (quantity) => {
    if (!user) {
      alert("Iniciá sesión para agregar productos al carrito");
      navigate("/login");
      return;
    }
    addItem({ ...item, quantity });
  };

  return loading ? (
    <h3>Cargando</h3>
  ) : (
    <ItemDetail item={item} onAdd={onAdd} />
  );
};

