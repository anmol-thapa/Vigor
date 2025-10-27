// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

let animated = false;

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

// Intersection Observer for animations (earlier trigger)
const observerOptions = {
  threshold: 0.01,
  rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      obs.unobserve(entry.target); // animate once
    }
  });
}, observerOptions);

// Observe elements for animation (same list)
document.querySelectorAll(
  '.step, .revenue-column, .rewards-column, .ecosystem-item, .impact-item, .timeline-item, .team-card, .problem-card, .solution-card, .competitive-card'
).forEach(el => observer.observe(el));


// Parallax effect for hero section (disabled to prevent overlay issues)
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const heroImage = document.querySelector('.hero-image');
//     if (heroImage) {
//         heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Counter animation for stats (utility, unchanged)
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

// -------- Start counter ONLY when sentinel is visible --------
const heroStats = document.querySelector('.hero-stats');

if (heroStats) {
  const sentinel = document.createElement('div');
  sentinel.className = 'hero-stats-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  heroStats.insertAdjacentElement('afterend', sentinel);

  const sentinelObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || animated) return;

      const counterElement = document.getElementById('counter');
      if (!counterElement) return;

      // ---- Your original counter logic (unchanged) ----
      animated = true;

      const START = 1_000_000_000_000;   // 1T
      const MID = 3_900_000_000_000;     // 3.9T
      const END = 4_000_000_000_000;     // 4T
      const LAST5_START = END - 5;

      const PHASE1 = 500;   // ms (1T → 3.9T)
      const PHASE2 = 500;   // ms (3.9T → 3,999,999,995)
      const PHASE3 = 500;   // ms (last 5 dollars)

      // Easing
      const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

      // Inverse of easeOutCubic to precompute when each of the 5 dollars should appear
      const cubicInv = y => 1 - Math.cbrt(1 - y);

      // Precompute timestamps for each of the last 5 dollars
      const last5Thresholds = [1, 2, 3, 4, 5].map(k => PHASE3 * cubicInv(k / 5));

      const fmt = n => n.toLocaleString('en-US');

      const t0 = performance.now();
      let shown = START;
      let phase3Started = false;

      const raf = () => {
        const now = performance.now();
        const elapsed = now - t0;

        if (elapsed <= PHASE1) {
          // Phase 1: 1T → 3.9T
          const p1 = Math.min(elapsed / PHASE1, 1);
          const v = START + (MID - START) * easeOutCubic(p1);
          shown = Math.min(Math.floor(v), MID);
          counterElement.textContent = `$${fmt(shown)}`;
          requestAnimationFrame(raf);
          return;
        }

        if (elapsed <= PHASE1 + PHASE2) {
          // Phase 2: 3.9T → 3,999,999,995
          const p2Elapsed = elapsed - PHASE1;
          const p2 = Math.min(p2Elapsed / PHASE2, 1);
          const v = MID + (LAST5_START - MID) * easeOutCubic(p2);
          shown = Math.min(Math.floor(v), LAST5_START);
          counterElement.textContent = `$${fmt(shown)}`;
          requestAnimationFrame(raf);
          return;
        }

        // Phase 3: final 5 dollars (ease-out cubic)
        const p3Elapsed = Math.min(elapsed - (PHASE1 + PHASE2), PHASE3);

        if (!phase3Started) {
          phase3Started = true;
          shown = LAST5_START;
          counterElement.textContent = `$${fmt(shown)}`;
        }

        // How many of the 5 steps should have appeared so far
        let steps = 0;
        for (let i = 0; i < last5Thresholds.length; i++) {
          if (p3Elapsed >= last5Thresholds[i]) steps = i + 1; else break;
        }

        const target = LAST5_START + steps;
        if (target > shown) shown = shown + 1; // advance one dollar per visible step

        counterElement.textContent = `$${fmt(shown)}`;

        if (p3Elapsed < PHASE3 || shown < END) {
          requestAnimationFrame(raf);
        } else {
          counterElement.textContent = `$${fmt(END)}`;
        }
      };

      counterElement.textContent = `$${fmt(START)}`;
      setTimeout(() => requestAnimationFrame(raf), 200);

      // cleanup: we only need to start once
      obs.disconnect();
    });
  }, { threshold: 0 }); // fire as soon as sentinel touches the viewport

  sentinelObserver.observe(sentinel);
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
        }, index + 200);
      });
    }
  });
}, { threshold: 0.1 });

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
