import { useList } from "../src/hooks/useList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemListContainer } from "./components/ItemListContainer";
import { NavBar } from "./components/NavBar";
import { ItemDetailContainer } from "./components/ItemDetailContainer";
import { Provider } from "./Context/itemContext";
import { Cart } from "./components/Cart";

function App() {
  const { list, loading } = useList();

  return loading ? (
    <h3>Cargando</h3>
  ) : (<Provider>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ItemListContainer herramientas={list} />} />
        <Route path="/cart" element={<Cart/>} />
        <Route
          path="/categoria/:id"
          element={<ItemListContainer herramientas={list} />}
        />
        <Route path="/item/:id" element={<ItemDetailContainer />} />
        <Route path="*" element={"ERROR 404"} />
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
