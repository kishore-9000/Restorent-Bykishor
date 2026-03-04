document.addEventListener('DOMContentLoaded', () => {
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

    document.querySelectorAll('.menu-item, .contact-container, .about-content, .about-image').forEach(el => {
        observer.observe(el);
    });

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

    // Simple Filtering (Future expansion)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Logic for filtering items would go here
        });
    });
});
