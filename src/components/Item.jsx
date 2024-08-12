import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"

export const Item = ({herramienta})=>(
    <Card style = {{ width: "18rem", padding:"1rem"}}>
        <Card.Img
        variant= "top"
        src= {herramienta.imagen}
        style={{ height: "200px", objectFit: "contain" }}
        />
        <Card.Body>
            <Card.Title style={{ minHeight: "50px" }}>
                {herramienta.producto}
            </Card.Title>
            <Card.Text>
                Marca: {herramienta.marca}
            </Card.Text>
            <Link to={ `/item/${herramienta.id}`}>
            <Button variant = "primary">Mas info</Button>
            </Link>
        </Card.Body>
    </Card>
)