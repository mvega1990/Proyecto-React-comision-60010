import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { ItemList } from "./ItemList";

export const ItemListContainer = ({ herramientas }) => {
  const { id } = useParams();

  // Filtra las herramientas según la categoría
  const filteredHerramientas = id
    ? herramientas.filter((herramienta) => herramienta.categoria === id)
    : herramientas;

  return (
    <Container className="d-flex flex-wrap mt-3 col-lg-10 justify-content-center">
      <ItemList herramientas={filteredHerramientas} />
    </Container>
  );
};

