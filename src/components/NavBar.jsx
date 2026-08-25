import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { CartWidget } from "./CarWidget";
import { AuthContext } from "../Context/authContext";

export const NavBar = () => {
  const { user, loadingAuth, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/buscar/${encodeURIComponent(search.trim())}`);
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Herramientas Vega
        </Navbar.Brand>
        <Nav className="mx-auto">
          <Nav.Link as={NavLink} to="/">
            Inicio
          </Nav.Link>
          <Nav.Link as={NavLink} to="/categoria/Herramientas manuales">
            Herramientas manuales
          </Nav.Link>
          <Nav.Link as={NavLink} to="/categoria/Maquinas electricas">
            Maquinas electricas
          </Nav.Link>
          <Nav.Link as={NavLink} to="/categoria/Muebleria y equipamiento">
            Muebleria y equipamiento
          </Nav.Link>
          <Nav.Link as={NavLink} to="/categoria/Herramientas para talleres mecánicos">
            Talleres mecánicos
          </Nav.Link>
          <Nav.Link as={NavLink} to="/marcas">
            Marcas
          </Nav.Link>
        </Nav>
        <Form className="d-flex me-3" onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "220px" }}
          />
          <Button type="submit" variant="outline-light" className="ms-2">
            Buscar
          </Button>
        </Form>
        {!loadingAuth && (
          user ? (
            <Nav className="align-items-center">
              <Navbar.Text className="me-3">{user.email}</Navbar.Text>
              <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={NavLink} to="/login">
                Ingresar
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Registrarse
              </Nav.Link>
            </Nav>
          )
        )}
        <CartWidget />
      </Container>
    </Navbar>
  );
};
