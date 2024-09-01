
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ItemContext } from "../Context/itemContext";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const CartWidget = () => {
    const {items} = useContext(ItemContext)
    const quantity = items.reduce((acc, item)=> acc + item.quantity, 0)
    return (
        <Link to="/cart" className="link-no-underline">
       
        <i class="bi bi-cart2" style={{ fontSize: '32px', color: 'white' }}></i>

        <span className = "numerito">{quantity}</span>
        </Link>
    )
}