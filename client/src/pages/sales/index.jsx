import { useEffect, useState } from "react";
import { api } from "../../api.js";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await api.getSales(); 
         
        setSales(data);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <p>Loading sales...</p>;
  if (!sales.length) return <p>No sales found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales List</h1>

      {sales.map((sale) => (
        <div
          key={sale.saleId}
          className="border rounded p-4 mb-4 shadow-sm bg-white"
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Sale ID: {sale.saleId}</span>
            <span>
              Date: {new Date(sale.saleDate).toLocaleString()}
            </span>
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-left">Unit</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-left">Unit Price</th>
                <th className="border p-2 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {sale.saleUnits.map((unit) => (
                <tr key={unit.saleUnitId}>
                  <td className="border p-2">{unit.productUnit.product.productName}</td>
                  <td className="border p-2">{unit.productUnit.unit.unitName}</td>
                  <td className="border p-2">{unit.quantity}</td>
                  <td className="border p-2">{unit.unitPrice.toFixed(2)}</td>
                  <td className="border p-2">{unit.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 flex justify-end font-semibold">
            Total Amount: {sale.finalAmount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
