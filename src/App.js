import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

//auth pages
import Register from "./Auth/Register";

import { Navbar, Sidebar, Footer } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home, About, Error, Products, SingleProduct, Cart } from "./pages";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="register" element={<Register />} />

        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<SingleProduct />} />
          <Route path="*" element={<Error />} />
          {/* <Route path="checkout" element={<Checkout />} /> */}
        </Route>
      </Routes>
      <Footer />
      <ToastContainer position="top-center" limit={1} autoClose={1500} />
    </Router>
  );
}

export default App;
