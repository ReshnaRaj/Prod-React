import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Layout from "./components/layout/Layout";
import ProductsPage from "./pages/products";
import SalesPage from "./pages/sales";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          {/* <Route path="/sales" element={<SalesPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
