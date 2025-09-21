import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "../../api.js";
import { toast } from "sonner";

export default function SalesDialog({ products }) {
  const [open, setOpen] = useState(false);
  const [saleItems, setSaleItems] = useState([
    { productId: "", productUnitId: "", quantity: 1, price: 0 },
  ]);

  const handleAddRow = () => {
    setSaleItems((prev) => [
      ...prev,
      { productId: "", productUnitId: "", price: 0, quantity: 1 },
    ]);
  };

  const handleChange = (index, field, value) => {
    
    
    setSaleItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (field === "productId") {
          const selectedProduct = products.find(
            (p) => p.productId === parseInt(value)
          );
          const firstUnit = selectedProduct?.units[0];

          return {
            ...item,
            productId: parseInt(value),
            productUnitId: firstUnit?.productUnitId || "",
            price: firstUnit?.price || 0,
            quantity: 1,
          };
        }

        if (field === "productUnitId") {
          const selectedProduct = products.find(
            (p) => p.productId === parseInt(item.productId)
          );
          
          const selectedUnit = selectedProduct?.units.find(
            (u) => u.productUnitId === parseInt(value)
          );
         
          if (!selectedUnit) return item;

          return {
            ...item,
            productUnitId: selectedUnit.productUnitId,
            price: selectedUnit.price,
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  // Submit the sale
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      productId: parseInt(saleItems[0].productId),
      price: parseFloat(saleItems[0].price),
      taxPercentage: 0,
      saleUnits: [
        {
          productUnitId: parseInt(saleItems[0].productUnitId),
          quantity: parseInt(saleItems[0].quantity),
        },
      ],
    };
    // const formattedData = {
    //   products: saleItems.map((item) => ({
    //     productId: parseInt(item.productId),
    //     price: parseFloat(item.price),
    //     taxPercentage: 0,
    //     saleUnits: [
    //       {
    //         productUnitId: parseInt(item.productUnitId),
    //         quantity: parseInt(item.quantity),
    //       },
    //     ],
    //   })),
    // };
    try {
      const result = await api.createSale(formattedData);

      setSaleItems([
        { productId: "", price: 0, productUnitId: "", quantity: 1 },
      ]);
      toast.success("sales created Successfully");
      setOpen(false);
    } catch (err) {
      console.error("Sale creation failed:", err);
      toast.error("something went wrong");
    }
  };

  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>+ Add Sale</Button>
        </DialogTrigger>

        <DialogContent className="w-full !max-w-4xl p-6">
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
                    value={item.productUnitId}
                    onChange={(e) =>
                      handleChange(index, "productUnitId", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Unit</option>
                    {units.map((u) => (
                      <option key={u.productUnitId} value={u.productUnitId}>
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
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      setSaleItems(saleItems.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
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
    </div>
  );
}
