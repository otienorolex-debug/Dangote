const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const searchMessage = document.querySelector('.search-message');
const searchHistory = document.getElementById('search-history');
const clearSearchHistoryButton = document.getElementById('clear-search-history');
const productGrid = document.getElementById('images');
const userSearches = [];
const inventoryApiUrl = 'https://dummyjson.com/products/search';
let latestSearchId = 0;

const totalGoodsDisplay = document.getElementById('total-goods');
const totalPriceDisplay = document.getElementById('total-price');
let totalGoods = 0;
let totalPriceCents = 0;

function addToCart(priceInCents, cartMessage) {
    totalGoods += 1;
    totalPriceCents += priceInCents;
    totalGoodsDisplay.textContent = `Total goods: ${totalGoods}`;
    totalPriceDisplay.textContent = `Total price: $${(totalPriceCents / 100).toFixed(2)}`;
    cartMessage.hidden = false;
}

function renderProducts(products) {
    productGrid.replaceChildren();

    products.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';

        if (typeof product.thumbnail === 'string' && product.thumbnail) {
            const image = document.createElement('img');
            image.src = product.thumbnail;
            image.alt = product.title;
            card.appendChild(image);
        }

        const details = document.createElement('div');
        details.className = 'product-details';

        const title = document.createElement('h3');
        title.textContent = product.title;

        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = `$${product.price.toFixed(2)}`;

        const availability = document.createElement('p');
        availability.textContent = `${product.stock} available`;

        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart';
        addButton.type = 'button';
        addButton.dataset.priceCents = String(Math.round(product.price * 100));
        addButton.textContent = 'Add to cart';

        const cartMessage = document.createElement('p');
        cartMessage.className = 'cart-message';
        cartMessage.setAttribute('role', 'status');
        cartMessage.setAttribute('aria-live', 'polite');
        cartMessage.hidden = true;
        cartMessage.textContent = 'Item added to cart';

        details.append(title, price, availability, addButton, cartMessage);
        card.appendChild(details);
        productGrid.appendChild(card);
    });
}

async function searchInventory(searchTerm) {
    const searchId = ++latestSearchId;
    searchMessage.textContent = 'Searching the demo grocery inventory...';
    searchMessage.hidden = false;

    try {
        const response = await fetch(`${inventoryApiUrl}?q=${encodeURIComponent(searchTerm)}&limit=30`);
        if (!response.ok) {
            throw new Error(`Inventory API returned HTTP ${response.status}.`);
        }

        const data = await response.json();
        if (!Array.isArray(data.products)) {
            throw new Error('Inventory API returned an unexpected response.');
        }

        if (searchId !== latestSearchId) {
            return;
        }

        const availableProducts = data.products.filter((product) =>
            product.category === 'groceries' &&
            typeof product.title === 'string' &&
            typeof product.price === 'number' &&
            Number.isFinite(product.price) &&
            typeof product.stock === 'number' &&
            product.stock > 0
        );

        renderProducts(availableProducts);
        searchMessage.textContent = availableProducts.length
            ? `Found ${availableProducts.length} available grocery product${availableProducts.length === 1 ? '' : 's'}.`
            : `No in-stock grocery products found for "${searchTerm}".`;
    } catch (error) {
        if (searchId !== latestSearchId) {
            return;
        }

        console.error('Unable to search the inventory:', error);
        searchMessage.textContent = 'Could not load inventory. Please try again.';
    }
}

function runSearch() {
    const searchTerm = searchBar.value.trim();
    if (!searchTerm) {
        searchMessage.textContent = 'Enter a product to search.';
        searchMessage.hidden = false;
        return;
    }

    userSearches.push(searchTerm);
    const historyItem = document.createElement('li');
    historyItem.textContent = searchTerm;
    searchHistory.appendChild(historyItem);
    searchInventory(searchTerm);
}

searchButton.addEventListener('click', runSearch);
searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        runSearch();
    }
});

clearSearchHistoryButton.addEventListener('click', () => {
    userSearches.length = 0;
    searchHistory.replaceChildren();
});

productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.add-to-cart');
    if (!button) {
        return;
    }

    const cartMessage = button.nextElementSibling;
    addToCart(Number(button.dataset.priceCents), cartMessage);
});
