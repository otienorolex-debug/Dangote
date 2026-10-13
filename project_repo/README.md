# Dangote Supermarket & Groceries

A small supermarket catalogue where visitors can search for grocery products, see which items are in stock, and add products to a simple cart.

## Technologies used

- **HTML5** builds the page structure and accessible search, product, and cart sections.
- **CSS3** styles the page, product cards, and responsive layout for smaller screens.
- **JavaScript (vanilla JavaScript / ES6+)** handles product searches, displays API results, tracks recent searches, and updates the cart totals without a framework.
- **Fetch API** sends the search request to the product API and reads its JSON response.
- **DummyJSON Products API** supplies sample product data for development. It is a mock/demo catalogue, not a real supermarket's live stock.

## Live API link

[Try the demo product search for milk](https://dummyjson.com/products/search?q=milk&limit=30)

The web app itself is not deployed to a public hosting service yet, so there is no live website link. The link above is to the API used by the app.

## How the code works

The page is in [`index.html`](./index.html), its styling is in [`style.css`](./style.css), and the search and cart behavior is in [`../inventory.js`](../inventory.js).

In `inventory.js`:

- `getElementById` and `querySelector` connect the JavaScript to the existing page elements.
- A click handler and an Enter-key handler both call `runSearch()`, so visitors can use either the button or keyboard.
- `encodeURIComponent(searchTerm)` safely encodes the search text before it is added to the API URL.
- `async`/`await` with `fetch()` makes the API request without blocking the page. The response status and expected JSON shape are checked so failed or unexpected responses can be reported.
- The results are filtered to grocery-category products with stock greater than zero, then rendered as product cards.
- DOM elements are created with `document.createElement()` and product text is assigned with `textContent`. This avoids treating API-provided product text as HTML.
- `latestSearchId` prevents an older, slower request from replacing the results of a more recent search.
- Event delegation on the product grid lets add-to-cart buttons work for both the original cards and cards created dynamically from API results.
- Prices are converted to cents for cart arithmetic to avoid common floating-point rounding errors.
- The status messages use the page's `aria-live` region to announce search and cart updates to assistive technology.

## Run locally

The HTML loads `../inventory.js`, so keep `inventory.js` in the parent directory as it is now. From the project folder, serve the files with a local web server (for example, use the VS Code Live Server extension) and open `index.html` in the browser. Serving the page over HTTP is recommended for reliable API requests.

## Connecting a real supermarket API

Replace `inventoryApiUrl` in `../inventory.js` with the supermarket's product-search endpoint. The current request sends `q` and `limit` query parameters and expects JSON shaped like:

```json
{
  "products": [
    {
      "title": "Milk",
      "price": 3.49,
      "stock": 27,
      "category": "groceries",
      "thumbnail": "https://example.com/milk.jpg"
    }
  ]
}
```

If the real API uses different query parameter names or response fields, update the request and product mapping/filtering to match its documentation. A production API may also require authentication and configuration that should not expose private credentials in browser JavaScript.