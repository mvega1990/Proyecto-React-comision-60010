import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import {CartWidget} from "./CarWidget"
export const NavBar = () => {
    return (
      
       <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={NavLink} to="/">Herramientas Vega</Navbar.Brand>
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/categoria/Herramientas manuales">Herramientas manuales</Nav.Link>
            <Nav.Link as={NavLink} to="/categoria/Maquinas electricas">Maquinas electricas</Nav.Link>
            <Nav.Link as={NavLink} to="/categoria/Muebleria y equipamiento">Muebleria y equipamiento</Nav.Link>
          </Nav>
          <CartWidget/>
        </Container>
      </Navbar>
        
      
    );
  };