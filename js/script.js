document.addEventListener('DOMContentLoaded', () => {
    // Header Animation
    const header = document.querySelector('header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        header.style.transition = 'all 0.8s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    // Scroll reveals
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .contact-container, .about-content, .about-image');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Fail-safe: Reveal everything after 3 seconds in case observer fails
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('show'));
    }, 3000);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 5%';
            header.style.background = 'rgba(18, 18, 18, 0.95)';
        } else {
            header.style.padding = '20px 5%';
            header.style.background = 'rgba(18, 18, 18, 0.8)';
        }
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data (simulated)
            const name = contactForm.querySelector('input[type="text"]').value;

            // Show success message
            alert(`Thank you, ${name}! Your message has been sent successfully.`);

            // Clear form
            contactForm.reset();
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // Simple Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.textContent;

            // Filter items
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'All') {
                    item.style.display = 'block';
                } else if (category === 'Non-Veg') {
                    if (item.classList.contains('non-veg')) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    if (itemCategory === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Booking System Logic ---
    let cart = [];
    const cartFab = document.getElementById('cart-fab');
    const cartCount = document.getElementById('cart-count');
    const orderModal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalDisplay = document.getElementById('cart-total');
    const placeOrderBtn = document.getElementById('place-order-btn');

    // Add to Cart
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));

            addToCart(name, price);

            // Animation feedback for button
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            btn.style.background = '#27ae60';
            setTimeout(() => {
                btn.innerHTML = 'Order Now';
                btn.style.background = '';
            }, 1000);
        });
    });

    function addToCart(name, price) {
        cart.push({ id: Date.now(), name, price });
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateCartUI() {
        // Update count
        cartCount.textContent = cart.length;

        // Update items list
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            placeOrderBtn.disabled = true;
            cartTotalDisplay.textContent = '₹0';
        } else {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                total += item.price;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>₹${item.price}</span>
                    </div>
                    <i class="fas fa-trash remove-item" onclick="window.removeItemFromOrder(${item.id})"></i>
                `;
                cartItemsContainer.appendChild(itemEl);
            });

            cartTotalDisplay.textContent = `₹${total}`;
            placeOrderBtn.disabled = false;
        }
    }

    // Expose remove function to window for the onclick handler
    window.removeItemFromOrder = (id) => {
        removeFromCart(id);
    };

    // Modal Controls
    cartFab.addEventListener('click', () => {
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });

    closeModal.addEventListener('click', () => {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Place Order
    placeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const total = cartTotalDisplay.textContent;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        placeOrderBtn.disabled = true;

        setTimeout(() => {
            alert(`🎉 Order Placed Successfully!\n\nThank you for choosing Kishore Cafe. Your delicious meal (Total: ${total}) is being prepared and will be served shortly.`);

            // Reset Cart
            cart = [];
            updateCartUI();
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
            placeOrderBtn.innerHTML = 'Place Order Now';
        }, 1500);
    });
});
