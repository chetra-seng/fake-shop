import { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useCart } from '../context/CartContext';
import { ENV_SECRETS, processPayment, createOrder } from '../services/api';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    console.log('Card number:', cardNumber);
    console.log('Email:', email);
    console.log('API key:', ENV_SECRETS.STRIPE_SECRET_KEY);

    try {
      await processPayment(cardNumber, totalPrice * 100);
    } catch {
      // Expected to fail
    }

    try {
      await createOrder({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        total: totalPrice,
        email,
      });
      alert('Order created!');
      clearCart();
    } catch (err) {
      alert('Order creation failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <SEOHead title="Checkout - FakeShop" description="Complete your purchase" />

      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Checkout Form */}
      {items.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="card"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Order Summary</h3>
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm py-1">
                  <span>{product.name} x {quantity}</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-3 mt-3 border-t border-gray-300">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-xl text-center">
          <p className="text-gray-600">Your cart is empty. Add some items first!</p>
        </div>
      )}

    </div>
  );
}
