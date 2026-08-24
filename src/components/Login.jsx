import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { AuthContext } from "../Context/authContext";

const initialValue = { email: "", password: "" };

export const Login = () => {
  const [form, setForm] = useState(initialValue);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5 col-lg-4 offset-lg-4">
      <h2>Iniciar sesión</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Ingresar
        </Button>
      </Form>
      <p className="mt-3">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </Container>
  );
};
