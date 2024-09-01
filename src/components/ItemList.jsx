import { Item } from "./Item";

export const ItemList = ({ herramientas }) =>
  herramientas.map((herramienta) => (
    <Item key={herramienta.id} herramienta={herramienta} />
  ));
