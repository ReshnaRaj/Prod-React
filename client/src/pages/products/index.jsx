import ProductList from "@/components/products/ProductList";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import SaleForm from "@/components/sales/SalesForm";
import { api } from "../../api.js";
import { useEffect, useState } from "react";
import SalesDialog from "@/components/sales/SalesDailog.jsx";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4 gap-2">
        <ProductForm />
        <SalesDialog products={products} />
        {/* <Button onClick={() => navigate("/sales")}>View All Sales</Button> */}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        <ProductList />
      </div>
    </div>
  );
}
