// Sample product data
const products = {
    men: [
        {
            id: 1,
            name: "Classic Leather Oxford",
            price: 129.99,
            image: "images/classic leather oxford.jpg",
            category: "men",
            description: "Premium leather oxford shoes with classic design"
        },
        {
            id: 2,
            name: "Sport Running Shoes",
            price: 89.99,
            image: "images/sports-running.jpg",
            category: "men",
            description: "Lightweight running shoes with advanced cushioning"
        },
        {
            id: 3,
            name: "Casual Sneakers",
            price: 79.99,
            image: "images/casual-sneakers.jpg",
            category: "men",
            description: "Comfortable everyday sneakers with modern design"
        }
    ],
    women: [
        {
            id: 4,
            name: "Elegant Heels",
            price: 99.99,
            image: "images/elegant-heels.jpg",
            category: "women",
            description: "Stylish high heels perfect for formal occasions"
        },
        {
            id: 5,
            name: "Casual Sneakers",
            price: 79.99,
            image: "images/jamie-street-oD5JxhSlt6Q-unsplash.jpg",
            category: "women",
            description: "Trendy sneakers for everyday comfort"
        },
        {
            id: 6,
            name: "Ankle Boots",
            price: 119.99,
            image: "images/ankle-boots.jpg",
            category: "women",
            description: "Fashionable ankle boots for any season"
        }
    ],
    kids: [
        {
            id: 7,
            name: "Kids Running Shoes",
            price: 49.99,
            image: "images/kids running shoes.jpg",
            category: "kids",
            description: "Durable running shoes for active kids"
        },
        {
            id: 8,
            name: "School Shoes",
            price: 39.99,
            image: "images/kids school shoes.jpg",
            category: "kids",
            description: "Comfortable shoes perfect for school"
        },
        {
            id: 9,
            name: "Casual Sneakers",
            price: 44.99,
            image: "images/erik-brolin-15dPd3jY0i4-unsplash.jpg",
            category: "kids",
            description: "Fun and colorful sneakers for everyday wear"
        }
    ]
};

// Cart functionality
let cart = [];

// Load cart from local storage if available
function loadCart() {
    const savedCart = localStorage.getItem('shoeCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartCount();
            updateCartDisplay();
        } catch (e) {
            console.error('Failed to load cart from local storage:', e);
            cart = [];
        }
    }
}

// Save cart to local storage
function saveCart() {
    localStorage.setItem('shoeCart', JSON.stringify(cart));
}

// Function to add product to cart with animation
function addToCart(productId) {
    const product = findProductById(productId);
    if (product) {
        // Find the button that was clicked and add animation
        const buttons = document.querySelectorAll(`.btn[onclick*="${productId}"]`);
        buttons.forEach(button => {
            button.classList.add('item-added');
            setTimeout(() => button.classList.remove('item-added'), 500);
        });
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Increase quantity if product already exists in cart
            existingItem.quantity += 1;
        } else {
            // Add new product to cart with quantity 1
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Save cart to local storage
        saveCart();
        
        // Update UI
        updateCartCount();
        updateCartDisplay();
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

// Function to remove product from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        const product = cart[index];
        cart.splice(index, 1);
        
        // Save cart to local storage
        saveCart();
        
        // Update UI
        updateCartCount();
        updateCartDisplay();
        showNotification(`${product.name} removed from cart`);
    }
}

// Function to update product quantity in cart
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            // Remove item if quantity is zero or negative
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            
            // Save cart to local storage
            saveCart();
            
            // Update UI
            updateCartDisplay();
        }
    }
}

// Function to find product by ID
function findProductById(id) {
    for (const category in products) {
        const product = products[category].find(p => p.id === id);
        if (product) return product;
    }
    return null;
}

// Function to update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalQuantity;
        cartCount.style.display = totalQuantity > 0 ? 'inline-block' : 'none';
    }
}

// Function to calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="#featured-products" class="btn btn-purple">Continue Shopping</a></div>';
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }
    
    let html = '';
    
    // Create cart items HTML
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image.replace(/ /g, '%20')}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <div class="cart-item-remove">
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    // Update cart items
    cartContainer.innerHTML = html;
    
    // Update cart summary
    const cartSummary = document.getElementById('cart-summary');
    if (cartSummary) {
        cartSummary.style.display = 'block';
        
        // Calculate totals
        const subtotal = calculateCartTotal();
        const shipping = subtotal > 0 ? 10 : 0; // $10 shipping fee
        const total = subtotal + shipping;
        
        // Update summary display
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }
}

// Function to clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart has been cleared');
}

// Function to checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real application, this would connect to a payment processor
    showNotification('Order placed successfully!', 'success');
    clearCart();
    
    // Redirect to a thank you page or show a success message
    // For this demo, we'll just clear the cart and show a notification
}

// Function to show notification with enhanced animation
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Performance optimization: Debounce function to limit function calls
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized: Use fewer DOM operations when creating product cards
function createProductCard(product) {
    // URL encode the image path to handle spaces in filenames
    const encodedImagePath = product.image.replace(/ /g, '%20');
    
    return `
        <div class="col-md-4 mb-4">
            <div class="product-card">
                <img src="${encodedImagePath}" alt="${product.name}" 
                     loading="lazy"
                     onerror="handleImageError(this)"
                >
                <h4>${product.name}</h4>
                <p class="description">${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-purple" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Optimized: Simplified image error handling
function handleImageError(img) {
    img.onerror = null; // Prevent infinite loops
    img.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
    img.classList.add('image-error');
}

// Function to load featured products
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        let html = '';
        // Get all products from each category
        for (const category in products) {
            if (products[category].length > 0) {
                // Get the first product from each category
                html += createProductCard(products[category][0]);
            }
        }
        featuredProductsContainer.innerHTML = html;
    }
}

// Function to load category products
function loadCategoryProducts(category, containerId) {
    const container = document.getElementById(containerId);
    if (container && products[category]) {
        let html = '';
        products[category].forEach(product => {
            html += createProductCard(product);
        });
        container.innerHTML = html;
    }
}

// Performance optimization: More efficient product hover effects
function addProductHoverEffects() {
    // Use event delegation instead of multiple event listeners
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            const img = card.querySelector('img');
            const header = card.querySelector('h4');
            if (img) img.style.transform = 'scale(1.05)';
            if (header) header.style.color = 'var(--light-purple)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            const img = card.querySelector('img');
            const header = card.querySelector('h4');
            if (img) img.style.transform = '';
            if (header) header.style.color = '';
        }
    });
}

// Optimized: Simplified animation on scroll with fewer DOM operations
function animateProductsOnScroll() {
    // Only run on desktop, disable on mobile for better performance
    if (window.innerWidth < 768) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-element');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card').forEach(product => {
        observer.observe(product);
    });
}

// Add optimization for the event listeners in the DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from local storage
    loadCart();
    
    // Load products for different sections
    loadFeaturedProducts();
    loadCategoryProducts('men', 'mens-products');
    loadCategoryProducts('women', 'womens-products');
    loadCategoryProducts('kids', 'kids-products');
    
    // Optimize cart badge update
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink && !document.getElementById('cart-count')) {
        const cartCount = document.createElement('span');
        cartCount.id = 'cart-count';
        cartCount.className = 'cart-count';
        cartLink.appendChild(cartCount);
        updateCartCount();
    }
    
    // Optimize smooth scrolling with debouncing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Apply optimized product hover effects
    addProductHoverEffects();
    
    // Apply optimized animation on scroll
    animateProductsOnScroll();
    
    // Add animation style once instead of multiple times
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .image-error {
            border: 1px solid #ff4d4f;
        }
        
        .fade-in-element {
            animation: fadeIn 0.5s forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // Performance: Add resize handler with debounce
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth < 768) {
            // Disable animations on mobile
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }));
    
    // Initial check for mobile devices
    if (window.innerWidth < 768) {
        document.body.classList.add('reduce-motion');
    }
});

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-purple);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-count {
        background-color: var(--primary-purple);
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        margin-left: 5px;
    }
`;
document.head.appendChild(style); 