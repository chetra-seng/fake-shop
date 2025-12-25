import { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { useCart } from '../context/CartContext';
import { ENV_SECRETS, fetchFromExternalAPI, processPayment, createOrder } from '../services/api';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [corsError, setCorsError] = useState<string | null>(null);
  const [corsLoading, setCorsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    console.log('=== SECURITY PROBLEM DEMO ===');
    console.log('Card number visible in console:', cardNumber);
    console.log('Email:', email);
    console.log('Using exposed API key:', ENV_SECRETS.STRIPE_SECRET_KEY);

    try {
      // This will fail with CORS, but demonstrates the problem
      await processPayment(cardNumber, totalPrice * 100);
    } catch {
      // Expected to fail
    }

    // Create order in json-server (this works)
    try {
      await createOrder({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        total: totalPrice,
        email,
      });
      alert('Order created! (Check db.json for the new order)\nPayment would have failed due to CORS.');
      clearCart();
    } catch (err) {
      alert('Order creation failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const testCorsError = async () => {
    setCorsError(null);
    setCorsLoading(true);
    try {
      await fetchFromExternalAPI();
      setCorsError('Unexpected success - this should have failed!');
    } catch (err) {
      setCorsError(
        `CORS Error: ${(err as Error).message}\n\n` +
        'The browser blocked this request because api.stripe.com did not include ' +
        'the Access-Control-Allow-Origin header.\n\n' +
        'In Next.js/Remix, this request would happen on the server (no CORS restrictions).'
      );
    } finally {
      setCorsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <SEOHead title="Checkout - FakeShop" description="Complete your purchase" />

      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Security Warning - Exposed Secrets */}
      <section className="bg-red-50 border-2 border-red-400 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">Problem 1: API Keys Exposed in Bundle</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Open DevTools → Sources → search for <code className="bg-gray-200 px-2 py-1 rounded">sk_live</code>
          </p>
          <p>These values from <code>.env</code> are bundled into your JavaScript:</p>
          <pre className="bg-gray-900 text-red-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{`VITE_STRIPE_SECRET_KEY = "${ENV_SECRETS.STRIPE_SECRET_KEY}"
VITE_DATABASE_URL      = "${ENV_SECRETS.DATABASE_URL}"
VITE_OPENAI_API_KEY    = "${ENV_SECRETS.OPENAI_API_KEY}"
VITE_AWS_SECRET_KEY    = "${ENV_SECRETS.AWS_SECRET_ACCESS_KEY}"`}
          </pre>
          <p className="text-red-600 font-semibold">
            Attackers can extract and abuse these keys!
          </p>
          <p>
            <strong>Fix:</strong> In Next.js, use Server Components or API Routes.
            Environment variables without <code>NEXT_PUBLIC_</code> prefix stay on the server.
          </p>
        </div>
      </section>

      {/* CORS Demo */}
      <section className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Problem 2: CORS Blocks External API Calls</h2>
        <div className="space-y-4 text-gray-700">
          <p>Try calling the Stripe API directly from the browser:</p>
          <button
            onClick={testCorsError}
            disabled={corsLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {corsLoading ? 'Fetching...' : 'Call api.stripe.com/v1/products'}
          </button>
          {corsError && (
            <pre className="bg-red-100 text-red-700 p-4 rounded-lg text-sm whitespace-pre-wrap border border-red-200">
              {corsError}
            </pre>
          )}
          <p>
            <strong>Fix:</strong> In Next.js, API Routes run on the server where there are no CORS restrictions.
          </p>
        </div>
      </section>

      {/* Checkout Form */}
      {items.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6">
            <strong>Warning:</strong> Don't enter real card info! Everything entered here is visible in:
            <ul className="list-disc list-inside mt-2">
              <li>Browser console (we log it intentionally)</li>
              <li>Network tab (in the request payload)</li>
              <li>React DevTools (component state)</li>
            </ul>
          </div>

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

      {/* Server-only Libraries */}
      <section className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Problem 3: Can't Use Server Libraries</h2>
        <div className="space-y-4 text-gray-700">
          <p>These Node.js libraries are impossible to use in browser JavaScript:</p>
          <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import fs from 'fs';                     // File system access
import { PrismaClient } from '@prisma/client';  // Database ORM
import bcrypt from 'bcrypt';             // Password hashing
import nodemailer from 'nodemailer';     // Send emails
import sharp from 'sharp';               // Image processing`}
          </pre>
          <p>
            To use these, you'd need to build a separate backend API, deploy it,
            maintain it, and handle authentication between frontend and backend.
          </p>
          <p>
            <strong>Fix:</strong> In Next.js, Server Components can use any Node.js library directly.
            No separate backend needed!
          </p>
        </div>
      </section>
    </div>
  );
}
