// Initialize EmailJS
(function() {
    emailjs.init("46VvyhfbARd-xquRP");
})();

// Tailwind CSS configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            colors: {
                'primary': '#b91c1c', // Red 700
                'primary-light': '#ef4444', // Red 500
                'accent': '#dc2626', // Red 600
                'gray-50': '#f9fafb',
                'gray-100': '#f3f4f6',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
            },
        },
    },
}

// IntersectionObserver for slide-up animations (with graceful fallback)
const slideUpObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -150px 0px' })
    : null;

// Form submission handler (EmailJS)
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.company) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // EmailJS template parameters for your notification
    const notificationParams = {
        to_email: 'hanyao.li@bravozoom.io',
        from_name: data.name,
        from_company: data.company,
        from_email: data.email,
        message: data.message || 'No additional message provided.',
        subject: 'New Consultation Request - Bravo Zoom'
    };

    // EmailJS template parameters for customer confirmation
    const customerParams = {
        to_email: data.email,
        customer_name: data.name,
        calendly_link: 'https://calendly.com/hanyao-li-bravozoom/30min',
        subject: 'Thank you for your interest in Bravo Zoom'
    };

    // Send notification email to you
    emailjs.send('service_jpgcb3k', 'template_gu9gonb', notificationParams)
        .then(function(response) {
            console.log('Notification sent!', response.status, response.text);
            
            // Send confirmation email to customer
            return emailjs.send('service_jpgcb3k', 'template_yh56n3l', customerParams);
        })
        .then(function(response) {
            console.log('Confirmation sent!', response.status, response.text);
            alert('Thank you for your interest! Check your email for our Calendly link to schedule your consultation.');
            document.querySelector('form').reset();
        }, function(error) {
            console.log('FAILED...', error);
            alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
        })
        .finally(function() {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
});

// Initialize slide-up elements as invisible
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.animate-slide-up');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        if (slideUpObserver) {
            slideUpObserver.observe(element);
        }
    });

    // Fallback for browsers without IntersectionObserver
    if (!slideUpObserver) {
        const fallback = () => {
            const windowHeight = window.innerHeight;
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        window.addEventListener('scroll', fallback);
        window.addEventListener('load', fallback);
        setTimeout(fallback, 100);
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener('click', () => {
            const isExpanded = mobileButton.getAttribute('aria-expanded') === 'true';
            mobileButton.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a nav link
        const mobileLinks = mobileMenu.querySelectorAll('a[href^="#"]');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
