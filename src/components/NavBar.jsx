import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import {CartWidget} from "./CarWidget"
export const NavBar = () => {
    return (
      
       <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Herramientas Vega</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#">Herramientas manuales</Nav.Link>
            <Nav.Link href="#">Maquinas neumaticas</Nav.Link>
            <Nav.Link href="#">Maquinas electricas</Nav.Link>
            <Nav.Link href="#">Muebleria y equipamiento</Nav.Link>
          </Nav>
          <CartWidget/>
        </Container>
      </Navbar>
        
      
    );
  };