
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { ItemContext } from "../Context/itemContext";
import { ItemDetail } from "./ItemDetail"; // Importa el nuevo componente

export const ItemDetailContainer = () => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { addItem } = useContext(ItemContext);

  useEffect(() => {
    const db = getFirestore();
    const refDoc = doc(db, "Items", id);

    getDoc(refDoc)
      .then((snapshot) => {
        setItem({ id: snapshot.id, ...snapshot.data() });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onAdd = (quantity) => addItem({ ...item, quantity });

  return loading ? (
    <h3>Cargando</h3>
  ) : (
    <ItemDetail item={item} onAdd={onAdd} />
  );
};

