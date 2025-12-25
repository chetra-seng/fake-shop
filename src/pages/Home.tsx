import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';
import { fetchProducts, type Product, ENV_SECRETS } from '../services/api';

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

      {/* SEO Problem Box */}
      <section className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Problem 1: Empty Initial HTML</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Right-click this page and select "View Page Source".</strong>
          </p>
          <p>You'll see something like this:</p>
          <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
  <head>
    <title>FakeShop</title>
  </head>
  <body>
    <div id="root"></div>  <!-- EMPTY! No content! -->
  </body>
</html>`}
          </pre>
          <p>
            Google, Facebook, Twitter, and LinkedIn crawlers see <strong>nothing</strong>.
            Your products won't appear in search results or link previews.
          </p>
        </div>
      </section>

      {/* Featured Products - Fetched from API */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <p className="text-sm text-gray-500 mb-4">
          Fetched from: <code className="bg-gray-200 px-2 py-1 rounded">{ENV_SECRETS.API_URL}/products</code>
        </p>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading from API...</p>
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

      {/* API Call Problem */}
      <section className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Problem 2: Loading States & Waterfalls</h2>
        <div className="space-y-4 text-gray-700">
          <p>Notice the products above showed a <strong>loading spinner</strong> before appearing.</p>
          <p>The request flow:</p>
          <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto">
{`1. Browser downloads HTML (empty)
2. Browser downloads JavaScript bundle
3. React initializes
4. useEffect runs, triggers fetch()
5. Wait for API response...
6. Finally render products!`}
          </pre>
          <p>
            <strong>In Next.js:</strong> Products are fetched on the server and included in the initial HTML.
            No loading spinner, no waterfall, instant content!
          </p>
        </div>
      </section>

      {/* Exposed Secrets */}
      <section className="bg-red-50 border-2 border-red-400 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">Problem 3: Exposed Environment Variables</h2>
        <div className="space-y-4 text-gray-700">
          <p>Open DevTools → Sources → search for <code className="bg-gray-200 px-2 py-1 rounded">sk_live</code></p>
          <p>These "secrets" from <code>.env</code> are in the JavaScript bundle:</p>
          <pre className="bg-gray-900 text-red-400 p-4 rounded-lg text-sm overflow-x-auto">
{`VITE_STRIPE_SECRET_KEY=${ENV_SECRETS.STRIPE_SECRET_KEY}
VITE_DATABASE_URL=${ENV_SECRETS.DATABASE_URL}
VITE_OPENAI_API_KEY=${ENV_SECRETS.OPENAI_API_KEY}`}
          </pre>
          <p className="text-red-600 font-semibold">
            Anyone can extract these and use your APIs!
          </p>
        </div>
      </section>
    </div>
  );
}
