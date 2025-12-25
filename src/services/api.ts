// =============================================================================
// SECURITY PROBLEM: API Keys Exposed in Client-Side Code!
// =============================================================================
//
// These environment variables are bundled into the JavaScript!
// Open DevTools > Sources > search for "sk_live" to find them.
//
// In Next.js/Remix, you would use:
// - Server Components (keys never reach the browser)
// - API Routes (keys stay on server)
// - Server Actions (keys stay on server)
// =============================================================================

// These are read from .env file - but they're STILL EXPOSED in the bundle!
export const ENV_SECRETS = {
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: import.meta.env.VITE_STRIPE_SECRET_KEY, // DANGER!
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL, // DANGER!
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY, // DANGER!
  SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY, // DANGER!
  AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID, // DANGER!
  AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY, // DANGER!
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

// For backwards compatibility
export const API_KEYS = ENV_SECRETS;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

// =============================================================================
// REAL API CALLS - These work with json-server
// =============================================================================

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${ENV_SECRETS.API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const response = await fetch(`${ENV_SECRETS.API_URL}/products/${id}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
};

export const createOrder = async (order: {
  items: { productId: string; quantity: number }[];
  total: number;
  email: string;
}) => {
  // PROBLEM: This exposes the payment intent creation to the client!
  console.warn('Creating order with exposed API key:', ENV_SECRETS.STRIPE_SECRET_KEY);

  const response = await fetch(`${ENV_SECRETS.API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // DANGER: In a real app, this would expose your secret key!
      'Authorization': `Bearer ${ENV_SECRETS.STRIPE_SECRET_KEY}`,
    },
    body: JSON.stringify({
      ...order,
      createdAt: new Date().toISOString(),
    }),
  });
  return response.json();
};

// =============================================================================
// CORS PROBLEM: External API calls blocked by browser
// =============================================================================

export const fetchFromExternalAPI = async () => {
  // This will fail with CORS error in the browser!
  // The external server doesn't include Access-Control-Allow-Origin header
  const response = await fetch('https://api.stripe.com/v1/products', {
    headers: {
      'Authorization': `Bearer ${ENV_SECRETS.STRIPE_SECRET_KEY}`,
    },
  });
  return response.json();
};

export const fetchFromAnotherExternalAPI = async () => {
  // Another example - GitHub API (will work, but shows the pattern)
  const response = await fetch('https://api.github.com/repos/facebook/react', {
    headers: {
      // If this were a private repo, we'd expose our token!
      'Authorization': `token ${ENV_SECRETS.OPENAI_API_KEY}`,
    },
  });
  return response.json();
};

// =============================================================================
// SIMULATED PAYMENT PROCESSING - Shows what NOT to do
// =============================================================================

export const processPayment = async (cardNumber: string, amount: number) => {
  // PROBLEM: Card numbers visible in Network tab!
  // PROBLEM: Secret key exposed in the request!
  console.warn('INSECURE: Card number in client-side code:', cardNumber);
  console.warn('INSECURE: Using secret key:', ENV_SECRETS.STRIPE_SECRET_KEY);

  // In reality, Stripe.js handles this securely
  // But this demonstrates why you can't do payment processing client-side
  const response = await fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV_SECRETS.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      amount: amount.toString(),
      currency: 'usd',
      source: cardNumber, // NEVER DO THIS!
    }),
  });

  // This will fail with CORS, but the attempt itself is the problem
  return response;
};

// =============================================================================
// SERVER-ONLY OPERATIONS - Impossible in client-side React
// =============================================================================

// These imports would CRASH the app:
// import fs from 'fs';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

export const hashPassword = async (_password: string): Promise<string> => {
  // Can't use bcrypt in the browser!
  // Would need: import bcrypt from 'bcrypt';
  // Instead, we're stuck with weaker alternatives or API calls
  console.warn('Cannot use bcrypt in browser - need server!');
  return 'fake-hash';
};

export const queryDatabase = async (_query: string): Promise<unknown> => {
  // Can't connect to database from browser!
  // Would need: import { PrismaClient } from '@prisma/client';
  console.warn('Cannot query database from browser - need server!');
  console.warn('Database URL exposed anyway:', ENV_SECRETS.DATABASE_URL);
  return null;
};
