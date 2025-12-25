import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';
import { fetchProducts, type Product } from '../services/api';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(products => {
        setFeaturedProducts(products.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <SEOHead
        title="FakeShop - Premium Products for Everyone"
        description="Discover amazing products at FakeShop. Electronics, accessories, and more with fast shipping."
        ogImage="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200"
      />

      {/* Hero */}
      <section className="text-center py-16 px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to FakeShop</h1>
        <p className="text-xl opacity-90 mb-8">Premium products. Unbeatable prices. (This is a demo)</p>
        <Link
          to="/products"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <strong>API Error:</strong> {error}
            <p className="text-sm mt-2">Make sure json-server is running: <code>pnpm dev</code></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-xl font-bold text-blue-600 mt-2">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
