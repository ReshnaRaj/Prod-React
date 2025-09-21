import { Link } from 'react-router-dom';
import { X, Package, ShoppingCart } from 'lucide-react';

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden" 
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 
        bg-white border-r
        flex flex-col
        h-[calc(100vh-64px)] mt-[64px]
        transform transition-transform duration-200 ease-in-out
        lg:sticky lg:transform-none
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <Link
              to="/products"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Package size={20} />
              <span>Products</span>
            </Link>
            <Link
              to="/sales"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={20} />
              <span>Sales</span>
            </Link>
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="text-sm text-gray-600">
            © 2025 Your Company
          </div>
        </div>
      </aside>
    </>
  );
}