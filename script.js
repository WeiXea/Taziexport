// Language switching functionality
const languageToggle = document.querySelectorAll('.lang-btn');
let currentLanguage = 'fr';

// Load content from Firebase
let adminContent = null;

async function fetchContent() {
    try {
        // Try loading from Firebase first
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const firebaseConfig = {
            apiKey: "AIzaSyCB4x8O0WkWcqHo2ahYKAkmkWKyl-cHWUI",
            authDomain: "tazi-export.firebaseapp.com",
            projectId: "tazi-export",
            storageBucket: "tazi-export.firebasestorage.app",
            messagingSenderId: "1405653318",
            appId: "1:1405653318:web:d4219d250a93876f375547"
        };
        
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const contentDocRef = doc(db, 'website', 'content');
        
        const docSnap = await getDoc(contentDocRef);
        
        if (docSnap.exists()) {
            adminContent = docSnap.data();
            console.log('Content loaded from Firebase');
        } else {
            console.log('No content found in Firebase');
        }
    } catch (error) {
        console.error('Error loading content from Firebase:', error);
        
        // Fallback to localStorage
        const saved = localStorage.getItem('taziContent');
        if (saved) {
            adminContent = JSON.parse(saved);
            console.log('Content loaded from localStorage (fallback)');
        }
    }
}

// Initialize language
async function initLanguage() {
    // Fetch content from cloud first
    await fetchContent();
    
    updateLanguage(currentLanguage);
    
    // Load admin content if available
    if (adminContent) {
        loadAdminContent();
    }
}

// Load content from admin panel
function loadAdminContent() {
    if (!adminContent) return;
    
    // Update Hero section
    if (adminContent.hero) {
        updateText('.hero-badge', adminContent.hero.badge);
        updateText('.hero-title span:first-child', adminContent.hero.title1);
        updateText('.hero-title .highlight', adminContent.hero.title2);
        updateText('.hero-subtitle', adminContent.hero.subtitle);
        updateText('.btn-primary', adminContent.hero.btn1);
        updateText('.btn-secondary', adminContent.hero.btn2);
        
        // Update hero background image
        if (adminContent.hero.image && adminContent.hero.image !== 'hero.jpg') {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundImage = `linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(44, 62, 80, 0.85) 100%), url('${adminContent.hero.image}')`;
            }
        }
    }
    
    // Update About section
    if (adminContent.about) {
        updateText('.about .section-label', adminContent.about.label);
        updateText('.about .section-header h2', adminContent.about.title);
        
        // Update about image
        if (adminContent.about.image) {
            const aboutImg = document.querySelector('.about-image img');
            if (aboutImg) {
                aboutImg.src = adminContent.about.image;
            }
        }
    }
    
    // Update Mission points
    if (adminContent.mission && adminContent.mission.points) {
        const missionItems = document.querySelectorAll('.mission-item p');
        adminContent.mission.points.forEach((point, index) => {
            if (missionItems[index]) {
                updateElementText(missionItems[index], point);
            }
        });
    }
    
    // Update Values
    if (adminContent.values) {
        const valueCards = document.querySelectorAll('.value-modern-card');
        adminContent.values.forEach((value, index) => {
            if (valueCards[index]) {
                const title = valueCards[index].querySelector('h4');
                const desc = valueCards[index].querySelector('p');
                if (title) updateElementText(title, value.title);
                if (desc) updateElementText(desc, value.desc);
            }
        });
    }
    
    // Update Capabilities
    if (adminContent.capabilities) {
        const capCards = document.querySelectorAll('.capability-card');
        adminContent.capabilities.forEach((cap, index) => {
            if (capCards[index]) {
                const title = capCards[index].querySelector('h3');
                const desc = capCards[index].querySelector('p');
                if (title) updateElementText(title, cap.title);
                if (desc) updateElementText(desc, cap.desc);
            }
        });
    }
    
    // Update Products
    if (adminContent.products) {
        const productCards = document.querySelectorAll('.product-card');
        adminContent.products.forEach((product, index) => {
            if (productCards[index]) {
                const title = productCards[index].querySelector('h3');
                const desc = productCards[index].querySelector('p');
                const tag = productCards[index].querySelector('.product-tag');
                if (title) updateElementText(title, product.title);
                if (desc) updateElementText(desc, product.desc);
                if (tag) updateElementText(tag, product.tag);
                
                // Update product image
                if (product.image) {
                    const img = productCards[index].querySelector('.product-image img');
                    if (img) {
                        img.src = product.image;
                    }
                }
            }
        });
    }
    
    // Update Partners section
    if (adminContent.partners) {
        const partnersTitle = document.querySelector('.clients-suppliers h2');
        if (partnersTitle) {
            updateElementText(partnersTitle, adminContent.partners.title);
        }
        
        const clientsTitle = document.querySelector('.cs-section:first-of-type h3');
        if (clientsTitle) {
            updateElementText(clientsTitle, adminContent.partners.clientsSubtitle);
        }
        
        const suppliersTitle = document.querySelector('.cs-section:last-of-type h3');
        if (suppliersTitle) {
            updateElementText(suppliersTitle, adminContent.partners.suppliersSubtitle);
        }
    }
    
    // Update Client logos
    if (adminContent.clients && adminContent.clients.logos) {
        const clientLogos = document.querySelectorAll('.client-logo');
        adminContent.clients.logos.forEach((logo, index) => {
            if (clientLogos[index] && logo) {
                clientLogos[index].src = logo;
            }
        });
    }
    
    // Update Supplier logos
    if (adminContent.suppliers && adminContent.suppliers.logos) {
        const supplierLogos = document.querySelectorAll('.supplier-logo');
        adminContent.suppliers.logos.forEach((logo, index) => {
            if (supplierLogos[index] && logo) {
                supplierLogos[index].src = logo;
            }
        });
    }
    
    // Update Certifications
    if (adminContent.certifications) {
        const certCards = document.querySelectorAll('.cert-card');
        adminContent.certifications.forEach((cert, index) => {
            if (certCards[index]) {
                const title = certCards[index].querySelector('h3');
                const desc = certCards[index].querySelector('p');
                if (title) updateElementText(title, cert.title);
                if (desc) updateElementText(desc, cert.desc);
                
                // Update certification logo if provided
                if (cert.logo) {
                    const icon = certCards[index].querySelector('.cert-icon');
                    if (icon) {
                        // Replace SVG with uploaded image
                        icon.innerHTML = `<img src="${cert.logo}" alt="${cert.title[currentLanguage]}" style="width: 60px; height: 60px; object-fit: contain;">`;
                    }
                }
            }
        });
    }
    
    // Update Sustainability
    if (adminContent.sustainability) {
        const sustainText = document.querySelector('.sustainability-text p:first-of-type');
        if (sustainText) {
            updateElementText(sustainText, adminContent.sustainability.text);
        }
        
        // Update sustainability image
        if (adminContent.sustainability.image) {
            const sustainImg = document.querySelector('.sustainability-image img');
            if (sustainImg) {
                sustainImg.src = adminContent.sustainability.image;
            }
        }
    }
    
    // Update Contact
    if (adminContent.contact) {
        const contactItems = document.querySelectorAll('.contact-item p');
        if (contactItems[0]) contactItems[0].innerHTML = adminContent.contact.address.replace(/\n/g, '<br>');
        if (contactItems[1]) contactItems[1].textContent = adminContent.contact.email;
        if (contactItems[2]) contactItems[2].textContent = adminContent.contact.phone;
        if (contactItems[3]) contactItems[3].textContent = adminContent.contact.fax;
    }
}

// Helper function to update text based on language
function updateText(selector, content) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        updateElementText(element, content);
    });
}

// Update individual element text
function updateElementText(element, content) {
    if (!content) return;
    
    const lang = currentLanguage;
    const text = content[lang] || content.fr || content.en;
    
    if (text) {
        // Store both languages as data attributes
        element.setAttribute('data-fr', content.fr || text);
        element.setAttribute('data-en', content.en || text);
        element.textContent = text;
    }
}

// Update all translatable elements
function updateLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data-fr and data-en attributes
    const elements = document.querySelectorAll('[data-fr][data-en]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update active button state
    languageToggle.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Language button click handlers
languageToggle.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        updateLanguage(lang);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form button
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = currentLanguage === 'fr' ? 'Envoi en cours...' : 'Sending...';
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            const successMessage = currentLanguage === 'fr' 
                ? 'Merci ! Nous vous contacterons bientôt.' 
                : 'Thank you! We will contact you soon.';
            
            alert(successMessage);
            
            // Reset form and button
            this.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe section elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language and load admin content
    initLanguage();
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        section.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(section);
    });
    
    // Animate cards within sections
    const cards = document.querySelectorAll('.capability-card, .product-card, .sustain-card, .mv-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate hero stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        stat.style.transitionDelay = `${0.5 + index * 0.1}s`;
        
        setTimeout(() => {
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 100);
    });
});

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Toggle mobile menu styles
        if (navMenu.classList.contains('active')) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'rgba(255, 255, 255, 0.98)';
            navMenu.style.padding = '2rem';
            navMenu.style.gap = '1.5rem';
            navMenu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            navMenu.style.backdropFilter = 'blur(10px)';
        } else {
            navMenu.style.display = 'none';
        }
    });
    
    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            navMenu.style.display = 'none';
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');
    
    if (heroPattern && scrolled < window.innerHeight) {
        heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add smooth reveal effect for hero content
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (heroStats) {
        heroStats.style.opacity = '0';
        heroStats.style.transform = 'translateY(20px)';
        heroStats.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroStats.style.opacity = '1';
            heroStats.style.transform = 'translateY(0)';
        }, 600);
    }
});

// Enhanced form validation
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.required && !this.value.trim()) {
            this.style.borderColor = '#C1272D';
        } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#C1272D';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '';
    });
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add active state to current section in navigation
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
