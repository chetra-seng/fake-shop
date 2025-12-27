# Fake Shop

This project demonstrates the limitations of client-side React applications, particularly around SEO, initial load performance, and data fetching patterns.

## Prerequisites

- Node.js
- pnpm

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Build the project

```bash
pnpm build
```

3. Start json-server (Terminal 1)

```bash
pnpm dev:api
```

4. Preview production build (Terminal 2)

```bash
pnpm preview
```

- App runs at: http://localhost:4173
- JSON Server API runs at: http://localhost:3001

## Exercises

Explore the app and use browser DevTools to discover the limitations of client-side React applications.

### Things to investigate:

1. **View Page Source** - Right-click the page and select "View Page Source". What do you see? How does this affect SEO?

2. **Network Tab** - Open DevTools → Network tab. Refresh the page and observe the request waterfall. What has to load before you see content?

3. **Sources Tab** - Open DevTools → Sources tab. Search for `sk_live` in the JavaScript bundle. What do you find?

4. **Console Tab** - Navigate to Checkout and submit a test order. What appears in the console?

5. **Disable JavaScript** - In DevTools settings, disable JavaScript and refresh the page. What do users (and search engines) see?

6. **Explore the Layout** - Look at `src/components/Layout.tsx` and `src/App.tsx`. How does React Router handle navigation? What happens to the HTML when you navigate between pages?

### Questions to answer:

- Why might search engines have trouble indexing this site?
- What security concerns exist with this architecture?
- How does the loading experience differ from server-rendered apps?
- What happens when you try to share a product page on social media?
- How does client-side routing differ from traditional server routing? What are the trade-offs?
- What is the developer experience like maintaining the routes? What happens as the app grows with more pages?
