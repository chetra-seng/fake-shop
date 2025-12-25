import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';

// =============================================================================
// STATIC EXPORT PROBLEM: Client-Side Routing
// =============================================================================
//
// This entire app is rendered from a SINGLE index.html file.
//
// When you navigate to /products/wireless-headphones:
// 1. The server returns the same index.html (with empty <div id="root">)
// 2. JavaScript loads and parses the URL
// 3. React Router renders the correct component
//
// Problems:
// - Search engines see the same empty HTML for ALL routes
// - Direct links to /products/123 fail on static hosts without rewrites
// - No pre-rendered content for any page
// - Every user downloads the entire app even for one page
//
// In Next.js:
// - Each route gets its own HTML file with pre-rendered content
// - /products/wireless-headphones.html has actual product data
// - Search engines see real content immediately
// =============================================================================

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:productId" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
