// ===================================
// Some Women Fashion - MAIN JAVASCRIPT
// ===================================

// ===================================
// NAVBAR FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    // Sticky navbar on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navbarToggle?.addEventListener('click', function () {
        navbarMenu?.classList.toggle('active');

        // Animate hamburger icon
        const spans = this.querySelectorAll('span');
        spans[0].style.transform = navbarMenu?.classList.contains('active')
            ? 'rotate(45deg) translateY(8px)'
            : 'none';
        spans[1].style.opacity = navbarMenu?.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navbarMenu?.classList.contains('active')
            ? 'rotate(-45deg) translateY(-8px)'
            : 'none';
    });

    // Close mobile menu when link is clicked
    navbarLinks.forEach(link => {
        link.addEventListener('click', function () {
            navbarMenu?.classList.remove('active');

            // Reset hamburger icon
            const spans = navbarToggle?.querySelectorAll('span');
            if (spans) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navbarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.card, .service-item, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ===================================
// WHATSAPP BUTTON
// ===================================
function openWhatsApp() {
    const phoneNumber = '919030600126'; 
    const message = encodeURIComponent('Hello! I would like to inquire about your services at Women Fashion.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// ===================================
// GALLERY LIGHTBOX
// ===================================
let currentImageIndex = 0;
let galleryImages = [];

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        currentImageIndex = index;
        lightboxImg.src = galleryImages[index];
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.src = galleryImages[currentImageIndex];
    }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryImages = Array.from(galleryItems).map(img => img.src);

    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function (e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        }
    });
});

// ===================================
// FORM VALIDATION
// ===================================
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--color-error)';

            // Remove error styling on input
            input.addEventListener('input', function () {
                this.style.borderColor = '';
            }, { once: true });
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }

    return isValid;
}

// ===================================
// SHOPPING CART FUNCTIONALITY
// ===================================
let cart = JSON.parse(localStorage.getItem('womenCart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id && item.size === product.size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: product.size,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('womenCart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item added to cart!');
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('womenCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, size, newQuantity) {
    if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        removeFromCart(productId, size);
        return;
    }

    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('womenCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalFinal = document.getElementById('cart-total-final');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center" style="color: var(--color-gray-600); padding: var(--space-8);">Your cart is empty.</p>';
        if (cartTotal) cartTotal.textContent = '₹0';
        if (cartTotalFinal) cartTotalFinal.textContent = '₹0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>Size: ${item.size}</p>
          <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.quantity} = ₹${itemTotal.toLocaleString('en-IN')}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}', '${item.size}')">×</button>
      </div>
    `;
    });

    cartContainer.innerHTML = html;
    if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (cartTotalFinal) cartTotalFinal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-tooltip);
    animation: slideInRight 0.3s ease-out;
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// LAZY LOADING IMAGES
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCart();
});

// ===================================
// PRODUCT QUICK VIEW
// ===================================
function showProductQuickView(productId) {
    // This would open a modal with product details
    console.log('Quick view for product:', productId);
    // Implementation would depend on product data structure
}

// ===================================
// SIZE GUIDE MODAL
// ===================================
function showSizeGuide() {
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSizeGuide() {
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===================================
// APPOINTMENT BOOKING
// ===================================
function bookAppointment() {
    const phone = '919030600126';
    const message = encodeURIComponent('Hello! I would like to book an appointment for stitching services at Women Fashion.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// ===================================
// CALL NOW FUNCTION
// ===================================
function callNow() {
    window.location.href = 'tel:+919030600126';
}
