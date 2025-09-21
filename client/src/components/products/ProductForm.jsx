import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../api.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
export default function ProductForm() {
  const [open,setOpen]=useState(false)
  const [open2,setOpen2]=useState(false)
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState({
    unitName: "",
    unitAbbreviation: "",
  });
  const [product, setProduct] = useState({
    productName: "",
    productCode: "",
    productDescription: "",
    units: [],
  });
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await api.getUnits();
        
        setUnits(data);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    };
    fetchUnits();
  }, []);

  const handleAddUnit = () => {
    setProduct((prev) => ({
      ...prev,
      units: [...prev.units, { unitId: "", price: 0 }]
    }));
  };

  const handleUnitChange = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      units: prev.units.map((unit, i) =>
        i === index ? { ...unit, [field]: value } : unit
      )
    }));
  };
  const handleCreateUnit = async () => {
  try {
    const payload = {
      unitId: 0, 
      unitName: newUnit.unitName,
      unitAbbreviation: newUnit.unitAbbreviation,
      productUnits: []  
    };

    const created = await api.createUnit(payload);

    toast.success(`Unit '${created.unitName}' created successfully!`);
    setOpen2(false)
    setUnits((prev) => [...prev, created]);
    setNewUnit({ unitName: "", unitAbbreviation: "" });
  } catch (error) {
 
    toast.error(error.message);
    setNewUnit({ unitName: "", unitAbbreviation: "" });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct(product);
      setProduct({
        productName: "",
        productCode: "",
        productDescription: "",
        units: []
      });
      toast.success("Product created successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="flex justify-end">
   <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">+ Add Product</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Fill in details and assign units with prices.
          </DialogDescription>
        </DialogHeader>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Product Name"
            value={product.productName}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, productName: e.target.value }))
            }
            required
          />
          <Input
            placeholder="Product Code"
            value={product.productCode}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, productCode: e.target.value }))
            }
            required
          />
          <Input
            placeholder="Product Description"
            value={product.productDescription}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                productDescription: e.target.value,
              }))
            }
            required
          />

          {/* Unit Rows */}
          {product.units.map((unit, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={unit.unitId}
                onChange={(e) =>
                  handleUnitChange(index, "unitId", parseInt(e.target.value))
                }
                required
                className="border rounded p-2 flex-1"
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u.unitId} value={u.unitId}>
                    {u.unitName} ({u.unitAbbreviation})
                  </option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Price"
                value={unit.price}
                onChange={(e) =>
                  handleUnitChange(index, "price", parseFloat(e.target.value))
                }
                required
                step="0.01"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" onClick={handleAddUnit}>
              Add Unit Row
            </Button>

 
            <Dialog open={open2} onOpenChange={setOpen2}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  Create New Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add New Unit</DialogTitle>
                  <DialogDescription>
                    Define a new measurement unit.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <Input
                    placeholder="Unit Name (e.g., Piece)"
                    value={newUnit.unitName}
                    onChange={(e) =>
                      setNewUnit((prev) => ({
                        ...prev,
                        unitName: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Abbreviation (e.g., pcs)"
                    value={newUnit.unitAbbreviation}
                    onChange={(e) =>
                      setNewUnit((prev) => ({
                        ...prev,
                        unitAbbreviation: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleCreateUnit}
                    disabled={!newUnit.unitName || !newUnit.unitAbbreviation}
                  >
                    Save Unit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
}
