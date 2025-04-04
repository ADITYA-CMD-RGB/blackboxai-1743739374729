// DOM Elements
const featuredProductsContainer = document.querySelector('.grid');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
});

// Render featured products on home page
function renderFeaturedProducts() {
    if (!featuredProductsContainer) return;
    
    featuredProductsContainer.innerHTML = '';
    
    // Display first 4 products as featured
    const featuredProducts = products.slice(0, 4);
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300';
        productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}">
                <div class="h-48 overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-1">${product.name}</h3>
                    <div class="flex items-center mb-2">
                        ${renderRatingStars(product.rating)}
                        <span class="text-gray-500 text-sm ml-1">(${product.rating})</span>
                    </div>
                    <p class="text-gray-800 font-bold text-lg">$${product.price.toFixed(2)}</p>
                    <button class="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300 add-to-cart" 
                            data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </a>
        `;
        featuredProductsContainer.appendChild(productCard);
    });

    // Add event listeners to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Render rating stars
function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHTML += '<i class="fas fa-star text-yellow-400"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        } else {
            starsHTML += '<i class="far fa-star text-yellow-400"></i>';
        }
    }
    
    return starsHTML;
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('Maximum stock reached for this item');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        if (cartCount > 0) {
            cartIcon.setAttribute('data-count', cartCount);
        } else {
            cartIcon.removeAttribute('data-count');
        }
    }
}

// Utility functions
function getProductById(id) {
    return products.find(product => product.id === id);
}

function getCartItems() {
    return cart;
}

// Expose functions to window for global access
window.app = {
    getProductById,
    getCartItems,
    addToCart,
    updateCartCount
};