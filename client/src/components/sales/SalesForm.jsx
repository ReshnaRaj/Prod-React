import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "../../api.js";

export default function SaleForm() {
  const [products, setProducts] = useState([]);
  const [saleItems, setSaleItems] = useState([
    { productId: "", unitId: "", quantity: 1, price: 0 },
  ]);

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

  // Add a new row for another product in the sale
  const handleAddRow = () => {
    setSaleItems((prev) => [
      ...prev,
      { productId: "", unitId: "", quantity: 1, price: 0 },
    ]);
  };

  // Handle changes in a row
  const handleChange = (index, field, value) => {
    setSaleItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

    // If product changes, update price automatically based on default unit price
    if (field === "productId") {
      const selectedProduct = products.find(
        (p) => p.productId === parseInt(value)
      );
      if (selectedProduct && selectedProduct.units.length > 0) {
        setSaleItems((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  unitId: selectedProduct.units[0].unit.unitId,
                  price: selectedProduct.units[0].price,
                }
              : item
          )
        );
      }
    }
  };

  // Submit sale
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = saleItems.map((item) => ({
      productId: parseInt(item.productId),
      price: parseFloat(item.price),
      taxPercentage: 0,
      saleUnits: [
        {
          productUnitId: parseInt(item.unitId),
          quantity: parseFloat(item.quantity),
        },
      ],
    }));

    const result = await api.createSale(payload);
    

    setSaleItems([{ productId: "", unitId: "", quantity: 1, price: 0 }]);
  } catch (error) {
    console.error("Failed to create sale:", error);
    toast.error("Failed to create sale. Please try again.");
  }
};


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Sale</Button>
      </DialogTrigger>

      <DialogContent  className="w-full !max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
          <DialogDescription>
            Add products, select units, and adjust prices if needed.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 mt-4 w-full"
        >
          {saleItems.map((item, index) => {
            const selectedProduct = products.find(
              (p) => p.productId === parseInt(item.productId)
            );
            const units = selectedProduct ? selectedProduct.units : [];

            return (
              <div key={index} className="flex gap-2 items-end w-full">
                <select
                  className="border rounded p-2 flex-1"
                  value={item.productId}
                  onChange={(e) =>
                    handleChange(index, "productId", e.target.value)
                  }
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.productId} value={p.productId}>
                      {p.productName} ({p.productCode})
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded p-2 flex-1"
                  value={item.unitId}
                  onChange={(e) =>
                    handleChange(index, "unitId", e.target.value)
                  }
                  required
                >
                  <option value="">Select Unit</option>
                  {units.map((u) => (
                    <option key={u.unit.unitId} value={u.unit.unitId}>
                      {u.unit.unitName} ({u.unit.unitAbbreviation})
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", parseInt(e.target.value))
                  }
                  className="w-20"
                  required
                />

                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    handleChange(index, "price", parseFloat(e.target.value))
                  }
                  className="w-24"
                  required
                />
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <Button type="button" onClick={handleAddRow}>
              + Add Another Product
            </Button>
            <Button type="submit">Save Sale</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
