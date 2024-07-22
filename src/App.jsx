import { ItemListContainer } from "./components/ItemListContainer";
import { NavBar } from "./components/NavBar";

function App() {
  return (
      <>
      <NavBar/>
      {<ItemListContainer greeting="Bienvenido a mi e-commerce"/>}
      </>)
}

export default App;
