export const ENV_SECRETS = {
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: import.meta.env.VITE_STRIPE_SECRET_KEY,
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY,
  AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

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
  console.warn('Creating order with API key:', ENV_SECRETS.STRIPE_SECRET_KEY);

  const response = await fetch(`${ENV_SECRETS.API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV_SECRETS.STRIPE_SECRET_KEY}`,
    },
    body: JSON.stringify({
      ...order,
      createdAt: new Date().toISOString(),
    }),
  });
  return response.json();
};

export const fetchFromExternalAPI = async () => {
  const response = await fetch('https://api.stripe.com/v1/products', {
    headers: {
      'Authorization': `Bearer ${ENV_SECRETS.STRIPE_SECRET_KEY}`,
    },
  });
  return response.json();
};

export const fetchFromAnotherExternalAPI = async () => {
  const response = await fetch('https://api.github.com/repos/facebook/react', {
    headers: {
      'Authorization': `token ${ENV_SECRETS.OPENAI_API_KEY}`,
    },
  });
  return response.json();
};

export const processPayment = async (cardNumber: string, amount: number) => {
  console.warn('Card number in client-side code:', cardNumber);
  console.warn('Using secret key:', ENV_SECRETS.STRIPE_SECRET_KEY);

  const response = await fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV_SECRETS.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      amount: amount.toString(),
      currency: 'usd',
      source: cardNumber,
    }),
  });

  return response;
};

export const hashPassword = async (_password: string): Promise<string> => {
  console.warn('Cannot use bcrypt in browser');
  return 'fake-hash';
};

export const queryDatabase = async (_query: string): Promise<unknown> => {
  console.warn('Cannot query database from browser');
  console.warn('Database URL:', ENV_SECRETS.DATABASE_URL);
  return null;
};
