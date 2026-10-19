
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useParams, useSearchParams } from "react-router-dom";
import { ItemList } from "./ItemList";
import { useList } from "../hooks/useList";
import { CategoryGrid } from "./CategoryGrid";
import { Pagination } from "./Pagination";

export const ItemListContainer = () => {
  const { id, brand, query } = useParams();
  // "Ver todas" en Novedades (Home.jsx) linkea acá con ?sort=newest — se lee
  // una sola vez como valor inicial, el desplegable de abajo sigue mandando.
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [page, setPage] = useState(1);

  // Cambió el filtro (categoría/marca/búsqueda/orden) -> volver a la página 1.
  useEffect(() => setPage(1), [id, brand, query, sort]);

  const { list, loading, totalPages } = useList(id, sort, brand, query, { page });

  return (
    <Container fluid className="mt-3 px-4">
      <Row>
        <Col md={3} lg={2} className="mb-4">
          <CategoryGrid categoriaActiva={id} />
        </Col>
        <Col md={9} lg={10}>
          {query && <h4 className="mt-3">Resultados para: &quot;{query}&quot;</h4>}
          {id && (
            <h4 className="mt-3" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "12px" }}>
              {id}
            </h4>
          )}
          {brand && (
            <h4 className="mt-3" style={{ borderLeft: "4px solid var(--accent-2)", paddingLeft: "12px" }}>
              {brand}
            </h4>
          )}
          <div className="d-flex justify-content-end mb-3">
            <Form.Select
              style={{ maxWidth: "260px" }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Ordenar por...</option>
              <option value="newest">Novedades primero</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </Form.Select>
          </div>
          {loading ? (
            <h3>Cargando...</h3>
          ) : (
            <>
              <div className="d-flex flex-wrap justify-content-center">
                <ItemList herramientas={list} />
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};