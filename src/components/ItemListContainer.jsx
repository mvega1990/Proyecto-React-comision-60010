
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { ItemList } from "./ItemList";
import { useList } from "../hooks/useList";

export const ItemListContainer = () => {
  const { id } = useParams();
  const { list, loading } = useList(id);

  if (loading) return <h3>Cargando...</h3>;

  const filteredHerramientas = id
    ? list.filter((herramienta) => herramienta.categoryId === id)
    : list;

  return (
    <Container className="d-flex flex-wrap mt-3 col-lg-10 justify-content-center">
      <ItemList herramientas={filteredHerramientas} />
    </Container>
  );
};