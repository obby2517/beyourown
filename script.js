// ===================================
// Be Your Own - Coffee Shop
// JavaScript Interactions
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
});

// ===================================
// Navbar Scroll Effect
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Scroll Animations (AOS-like)
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Intersection Observer config
    const observerConfig = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    // Observer callback
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get delay from data attribute
                const delay = entry.target.dataset.aosDelay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerConfig);
    
    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// Contact Form Handling
// ===================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }
        
        // Email validation
        if (!isValidEmail(data.email)) {
            showNotification('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'กำลังส่ง...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('ส่งข้อความสำเร็จ! เราจะติดต่อกลับเร็วๆ นี้', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===================================
// Utility Functions
// ===================================

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4A7C59' : type === 'error' ? '#C75D5D' : '#8B7355'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-family: 'Kanit', sans-serif;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
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
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;
    
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// ===================================
// Parallax Effect for Hero (Optional)
// ===================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.backgroundPositionY = `${rate}px`;
    }
});

// ===================================
// Active Nav Link on Scroll
// ===================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});
