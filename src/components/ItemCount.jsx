import { useState } from "react"
import { Button } from "react-bootstrap"

export const ItemCount = ({stock, onAdd}) =>{

    const [count, setCount] = useState(1)
    const handleIncrease = () => {
        if(count < stock) setCount((prev) => prev + 1)
    }
    const handleDecrease = () => {
        if(count > 1) setCount((prev) => prev - 1)
    }

    const handleAdd = () => {
        onAdd(count)
        setCount (1)
    }

    return(
        <>
        <div>
            <button className="botonMasMenos" onClick={handleDecrease}>-</button>
            <span className="cantidadCompra">{count}</span>
            <button className="botonMasMenos" onClick={handleIncrease}>+</button>
                </div>
            
                <Button onClick={handleAdd}  style={{ marginBottom: '20px' }}>Comprar</Button>
                </>
    )
}