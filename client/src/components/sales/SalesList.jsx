import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SalesList() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await api.getSales();
        setSales(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };
    fetchSales();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sale ID</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.id}</TableCell>
            <TableCell>
              {sale.items.map((item) => (
                <div key={item.productId}>
                  {item.productName} - {item.quantity} {item.unitType}
                </div>
              ))}
            </TableCell>
            <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
            <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}