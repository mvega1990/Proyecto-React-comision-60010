import Container from "react-bootstrap/Container";
import { ItemCount } from "./ItemCount";

export const ItemDetail = ({ item, onAdd }) => {
  return (
    <Container className="mt-5 col-lg-4 text-center">
      <img
        src={item.image}
        alt={item.title}
        className="img-fluid"
        style={{ maxWidth: "300px", height: "auto" }}
      />
      <h1>{item.title}</h1>
      <h2>Marca: {item.marca}</h2>
      <p>{item.description}</p>
      
      <p>Precio: ${item.price}</p>
      
      <p>Stock: {item.stock}</p>
      <ItemCount stock={item.stock} onAdd={onAdd} />
    </Container>
  );
};
