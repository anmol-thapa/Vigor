// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Scroll arrow functionality
const scrollArrow = document.querySelector('.scroll-arrow');

if (scrollArrow) {
  scrollArrow.addEventListener('click', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      // adjust this based on your fixed header or desired stop position
      const yOffset = -80;

      // calculate element's position relative to the document top
      const y = heroStats.getBoundingClientRect().top + window.scrollY + yOffset;

      // scroll smoothly with precise control
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  });
}


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step, .revenue-column, .rewards-column, .ecosystem-item, .impact-item, .timeline-item').forEach(el => {
  observer.observe(el);
});

// Parallax effect for hero section (disabled to prevent overlay issues)
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const heroImage = document.querySelector('.hero-image');
//     if (heroImage) {
//         heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statElement = entry.target.querySelector('h3');
      if (statElement && statElement.textContent.includes('$')) {
        const value = statElement.textContent.replace('$', '').replace('T', '');
        if (!isNaN(value)) {
          // Start counting from 1 to 4 over 1.5 seconds
          let currentValue = 1;
          const targetValue = 4;
          const duration = 500; // .5 seconds
          const increment = (targetValue - currentValue) / (duration / 16); // 60fps

          const countUp = () => {
            currentValue += increment;
            if (currentValue < targetValue) {
              statElement.textContent = `$${Math.floor(currentValue)}T`;
              requestAnimationFrame(countUp);
            } else {
              statElement.textContent = '$4T';
            }
          };

          // Start the animation
          statElement.textContent = '$1T';
          setTimeout(() => {
            countUp();
          }, 200);
        }
      }
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Add hover effects to cards
document.querySelectorAll('.step, .revenue-column, .rewards-column, .ecosystem-item, .impact-item').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-10px) scale(1.02)';
    this.style.transition = 'all 0.3s ease';
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Timeline animation
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const timelineItems = entry.target.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('fade-in-up');
        }, index * 200);
      });
    }
  });
}, { threshold: 0.3 });

const timeline = document.querySelector('.timeline');
if (timeline) {
  timelineObserver.observe(timeline);
}

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Animate hero elements
  const heroText = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image');

  if (heroText) {
    setTimeout(() => {
      heroText.classList.add('fade-in-left');
    }, 300);
  }

  if (heroImage) {
    // Slide in from right to left after a short delay
    setTimeout(() => {
      heroImage.classList.add('slide-in');
    }, 500);
  }
});

// Button click animations
document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button').forEach(button => {
  button.addEventListener('click', function (e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// Form validation (if forms are added later)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-orange);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.visibility = 'visible';
  } else {
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.visibility = 'hidden';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Add hover effect to scroll button
scrollToTopBtn.addEventListener('mouseenter', function () {
  this.style.transform = 'scale(1.1)';
  this.style.background = 'var(--secondary-orange)';
});

scrollToTopBtn.addEventListener('mouseleave', function () {
  this.style.transform = 'scale(1)';
  this.style.background = 'var(--primary-orange)';
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
  // Navbar background change
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }

  // Scroll to top button visibility
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.visibility = 'visible';
  } else {
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.visibility = 'hidden';
  }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('Vigor website loaded successfully! 🚀');
