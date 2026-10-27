import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Nav from "./components/Nav";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";
import NewProduct from "./components/NewProduct";
import UpdateProduct from "./components/UpdateProduct";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Electronics from "./components/Electronics";
import Accessories from "./components/Accessories";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Nav />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />}>
              <Route index element={<ProductList />} />
            </Route>
            <Route path="/signup" element={<Signup />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/electronics" element={<Electronics />} />

            <Route path="/login" element={<Login />} />
            <Route path="/newProduct" element={<NewProduct />} />
            <Route path="/update/:id" element={<UpdateProduct />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/accessories" element={<Accessories />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
