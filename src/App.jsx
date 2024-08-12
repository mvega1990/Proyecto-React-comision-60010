import {useList} from "../src/hooks/useList"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemListContainer } from "./components/ItemListContainer";
import { NavBar } from "./components/NavBar";
import herramientas from "./data/Mockdata.json";
import { ItemDetailContainer } from "./components/ItemDetailContainer";

function App() {
  const {list, loading} = useList(herramientas)

  return loading ?( <h3>Cargando</h3>) :

 (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<ItemListContainer herramientas={list} />}/>
        <Route path="/categoria/:id" element={<ItemListContainer herramientas={list} />}/>
        <Route path="/item/:id" element={<ItemDetailContainer/>}/>
        <Route path="*" element={"ERROR 404"}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
