import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL;

export const Marcas = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch((error) => console.error("Error al traer las marcas: ", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h3 className="mt-5 text-center">Cargando...</h3>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Marcas</h2>
      <div className="d-flex flex-wrap gap-3">
        {brands.map((brand) => (
          <Link key={brand} to={`/marca/${brand}`} className="link-no-underline">
            <Card style={{ width: "12rem" }} className="text-center p-3">
              <Card.Body>
                <Card.Title style={{ fontSize: "1.1rem" }}>{brand}</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
};
