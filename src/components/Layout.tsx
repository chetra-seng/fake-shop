import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            FakeShop
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link
              to="/cart"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cart ({totalItems})
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-gray-300">FakeShop</p>
        <p className="text-gray-500 text-sm mt-2">&copy; 2025 <a href="https://github.com/chetra-seng" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300 transition-colors">Chetra Seng</a></p>
      </footer>
    </div>
  );
}
