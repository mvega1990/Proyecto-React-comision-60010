import { useContext, useState } from "react";
import { CardPayment } from "@mercadopago/sdk-react";
import { ItemContext } from "../Context/itemContext";
import { AuthContext } from "../Context/authContext";
import { Button, Container, Table, Alert } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_API_URL;

export const Cart = () => {
  const { items, reset, removeItem, cartId, refreshCart } = useContext(ItemContext);
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null); // { status, message }

  const total = items.reduce((acc, act) => acc + act.price * act.quantity, 0);

  // El Brick tokeniza la tarjeta en el navegador (nunca vemos el número acá)
  // y nos entrega esto — se lo pasamos tal cual a nuestro backend, que es
  // quien realmente cobra y recalcula el monto contra la base.
  const handlePaymentSubmit = async (formData) => {
    const res = await fetch(`${API_URL}/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        token: formData.token,
        payment_method_id: formData.payment_method_id,
        installments: formData.installments,
        issuer_id: formData.issuer_id,
      }),
    });
    const data = await res.json();
    const status = data.ticket?.status || "error";

    if (status === "approved") {
      setResult({ status, message: `¡Compra aprobada! Código de tu pedido: ${data.ticket.code}` });
      refreshCart();
    } else if (status === "rejected") {
      setResult({ status, message: "El pago fue rechazado. Probá con otro medio de pago." });
    } else {
      setResult({ status, message: "Tu pago quedó pendiente de confirmación." });
    }
  };

  if (result?.status === "approved") {
    return (
      <Container className="mt-5 col-lg-6 offset-lg-3 text-center">
        <Alert variant="success">{result.message}</Alert>
      </Container>
    );
  }

  if (items.length === 0) {
    return <h3 className="volverInicio">Ir al Inicio para seguir comprando</h3>;
  }

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

      {result && result.status !== "approved" && (
        <Alert variant={result.status === "rejected" ? "danger" : "warning"} className="mt-3">
          {result.message}
        </Alert>
      )}

      <div className="mt-4" style={{ maxWidth: "480px" }}>
        <CardPayment
          initialization={{ amount: total, payer: { email: user?.email } }}
          onSubmit={handlePaymentSubmit}
          onError={(error) => console.error("Error del Brick: ", error)}
        />
      </div>
    </Container>
  );
};
