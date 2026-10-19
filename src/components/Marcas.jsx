import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { BRAND_LOGOS } from "../constants/brandLogos";

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
    <Container className="mt-5 mb-5">
      <h2 className="mb-4" style={{ color: "var(--text)", borderLeft: "4px solid var(--accent-2)", paddingLeft: "14px" }}>Marcas</h2>
      <div className="d-flex flex-wrap gap-4">
        {brands.map((brand) => {
          const logo = BRAND_LOGOS[brand];
          return (
            <Link key={brand} to={`/marca/${brand}`} className="link-no-underline">
              <Card
                style={{
                  width: "14rem",
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "110px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    padding: "16px",
                  }}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={brand}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#0b0b10" }}>{brand}</span>
                  )}
                </div>
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: "14px", color: "var(--text-dim)", margin: 0 }}>{brand}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
};
