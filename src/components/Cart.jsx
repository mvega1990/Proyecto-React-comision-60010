import { useContext, useState } from "react";
import { ItemContext } from "../Context/itemContext";
import { Button, Container, Table, Form } from "react-bootstrap";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import "bootstrap-icons/font/bootstrap-icons.css";

const initialValue = {
  name: "",
  phone: "",
  email: "",
};

export const Cart = () => {
  const [buyer, setBuyer] = useState(initialValue);
  const { items, reset, removeItem } = useContext(ItemContext);

  const total = items.reduce((acc, act) => acc + act.price * act.quantity, 0);

  const sendOrder = () => {
    if (!buyer.name || !buyer.phone || !buyer.email) {
      alert("Por favor, complete todos los campos antes de comprar.");
      return;
    }

    const order = {
      buyer,
      items,
      total,
    };

    const db = getFirestore();
    const orderCollection = collection(db, "orders");

    addDoc(orderCollection, order)
      .then(({ id }) => {
        if (id) {
          alert("Su orden: " + id + " ha sido completada!");
        }
      })
      .finally(() => {
        reset();
        setBuyer(initialValue);
      });
  };

  const handleChange = (event) => {
    setBuyer((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  if (items.length === 0) {
    return <h3 className= "volverInicio">Ir al Inicio para seguir comprando</h3>}

  return (
    <Container className="mt-5 col-lg-8 offset-lg-2">
      <Button variant="danger" onClick={reset}>
        Vaciar
      </Button>
      <Table bordered className="cartTable mt-3">
        <thead>
          <tr className="CartProducto">
            <th>Img Producto</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cant.</th>
            <th>SubTotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="CartProducto">
              <td className="imgProductoCarrito">
                <img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid"
                  style={{ maxWidth: "100px", height: "auto" }}
                />
              </td>
              <td className="descripcionProductoCarrito">
                <div className="CartDescription">
                  <p className="descripcionProductoEspecifico">{item.title}</p>
                </div>
              </td>
              <td className="productoPrecio">
                <p className="productoPrecioCarrito">${item.price}</p>
              </td>
              <td className="car-cant">
                <p className="productoPrecioCarrito">{item.quantity}</p>
              </td>
              <td className="subtotalNumero">${item.price * item.quantity}</td>
              <td className="delete">
                <Button variant="danger" onClick={() => removeItem(item.id)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Form className="mt-4">
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={buyer.name}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
            className="w-50"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={buyer.phone}
            onChange={handleChange}
            placeholder="Ingrese su teléfono"
            className="w-50"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={buyer.email}
            onChange={handleChange}
            placeholder="Ingrese su email"
            className="w-50"
          />
        </Form.Group>
        <Button
          variant="primary"
          className="mt-3"
          type="button"
          onClick={sendOrder}
        >
          Comprar
        </Button>
      </Form>
    </Container>
  );
};
