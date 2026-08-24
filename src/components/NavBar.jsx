import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { CartWidget } from "./CarWidget";
import { AuthContext } from "../Context/authContext";

export const NavBar = () => {
  const { user, loadingAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
        </Nav>
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
