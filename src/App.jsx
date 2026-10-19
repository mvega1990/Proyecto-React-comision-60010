import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemListContainer } from "./components/ItemListContainer";
import { NavBar } from "./components/NavBar";
import { ItemDetailContainer } from "./components/ItemDetailContainer";
import { Provider } from "./Context/itemContext";
import { AuthProvider } from "./Context/authContext";
import { Cart } from "./components/Cart";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Marcas } from "./components/Marcas";
import { MisPedidos } from "./components/MisPedidos";
import { AdminPedidos } from "./components/AdminPedidos";
import { AdminArrepentimientos } from "./components/AdminArrepentimientos";
import { MiCuenta } from "./components/MiCuenta";
import { Nosotros } from "./components/Nosotros";
import { Arrepentimiento } from "./components/Arrepentimiento";
import { Categorias } from "./components/Categorias";
import { Home } from "./components/Home";
import { Footer } from "./components/Footer";
import { WhatsappFloatButton } from "./components/WhatsappFloatButton";

function App() {
  return (
    <AuthProvider>
      <Provider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ItemListContainer />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/categoria/:id" element={<ItemListContainer />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/admin/pedidos" element={<AdminPedidos />} />
            <Route path="/admin/arrepentimientos" element={<AdminArrepentimientos />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/arrepentimiento" element={<Arrepentimiento />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/marca/:brand" element={<ItemListContainer />} />
            <Route path="/buscar/:query" element={<ItemListContainer />} />
            <Route path="/item/:id" element={<ItemDetailContainer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={"ERROR 404"} />
          </Routes>
          <Footer />
          <WhatsappFloatButton />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
}

export default App;
