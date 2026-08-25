
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { ItemList } from "./ItemList";
import { useList } from "../hooks/useList";

export const ItemListContainer = () => {
  const { id, brand, query } = useParams();
  const [sort, setSort] = useState("");
  const { list, loading } = useList(id, sort, brand, query);

  return (
    <Container className="mt-3 col-lg-10">
      {query && <h4 className="mt-3">Resultados para: "{query}"</h4>}
      <div className="d-flex justify-content-end mb-3">
        <Form.Select
          style={{ maxWidth: "260px" }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Ordenar por...</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </Form.Select>
      </div>
      {loading ? (
        <h3>Cargando...</h3>
      ) : (
        <div className="d-flex flex-wrap justify-content-center">
          <ItemList herramientas={list} />
        </div>
      )}
    </Container>
  );
};