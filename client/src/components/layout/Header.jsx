import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-primary">Product Management</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/sales" className="hover:text-primary transition-colors">
                  Sales
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}