import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import  Container from "react-bootstrap/Container";
import data from "../data/Mockdata.json";

export const ItemDetailContainer = () => {
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
  
    useEffect(() => {
      new Promise((res) => {
        setTimeout(() => res(data), 3000);
      })
        .then((respuesta) => {
          const finded = respuesta.find((i) => i.id === Number(id));
          setItem(finded);
        })
        .finally(() => setLoading(false));
    }, [id]);
  
    if (loading) return <h3>Cargando</h3>;
  
    return <Container className="mt-5 col-lg-4 text-center"><img src= {item.imagen} alt={item.producto}     className="img-fluid"  // Hace que la imagen sea responsive
    style={{ maxWidth: '300px', height: 'auto' }}  // Ajusta el ancho y altura
  /><h1>{item.producto}</h1><h2>Marca: {item.marca}</h2><p>{item.descripcion}</p>
    <br/>
    <b>Precio: ${item.precio}</b></Container>;
  };
  