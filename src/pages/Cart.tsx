import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="space-y-8">
      <SEOHead title="Your Cart - FakeShop" description="Review items in your shopping cart" />

      <h1 className="text-3xl font-bold">Shopping Cart ({totalItems} items)</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${product.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-500 text-sm">${product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold w-24 text-right">
                  ${(product.price * quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
