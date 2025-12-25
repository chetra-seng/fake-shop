import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { fetchProductById, fetchProducts, type Product } from '../services/api';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    Promise.all([
      fetchProductById(productId),
      fetchProducts()
    ])
      .then(([productData, allProducts]) => {
        setProduct(productData);
        if (productData) {
          setRelatedProducts(
            allProducts
              .filter(p => p.id !== productData.id && p.category === productData.category)
              .slice(0, 3)
          );
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Fetching product from API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <strong>API Error:</strong> {error}
        <p className="text-sm mt-2">Make sure json-server is running: <code>pnpm dev</code></p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SEOHead
        title={`${product.name} - FakeShop`}
        description={product.description}
        ogImage={product.image}
        ogType="product"
        canonicalUrl={`https://fakeshop.example.com/products/${product.id}`}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        {' / '}
        <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
        {' / '}
        <span>{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-sm"
          />
        </div>

        <div className="space-y-4">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
          <p className="text-gray-600">{product.description}</p>

          <div className="py-2">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{p.name}</h4>
                  <span className="text-lg font-bold text-blue-600">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
