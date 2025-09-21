import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Package className="text-primary" size={20} />
          <CardTitle className="text-lg">{product.productName}</CardTitle>
        </div>
        <p className="text-sm text-gray-500">Code: {product.productCode}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 text-sm mb-4">{product.productDescription}</p>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Available Units:</h4>
          <div className="divide-y">
            {product.units.map((unit, index) => (
              <div key={index} className="flex justify-between py-2">
                <span className="text-sm text-gray-600">
                  {unit.unit.unitName} ({unit.unit.unitAbbreviation})
                </span>
                <span className="text-sm">Unit {unit.unitId}</span>
                <span className="font-medium text-primary">
                  ₹{parseFloat(unit.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}