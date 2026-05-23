/**
 * Kylrx AI - Landing Page Interactions
 * Handles pricing billing toggle, responsive navbar, hamburger menu, and Razorpay popup checkout.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initBillingToggle();
  initRazorpayCheckout();
  initScrollNavigation();
});

/**
 * Adds a modern glassmorphism effect to the navbar when the user scrolls down.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run on initial load and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Handles the responsive hamburger navigation menu.
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const toggleMenu = (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close the menu when any link is clicked
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
}

/**
 * Handles the Monthly / Annually billing pricing toggle.
 */
function initBillingToggle() {
  const toggleTrack = document.getElementById('toggleTrack');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');
  
  if (!toggleTrack || !labelMonthly || !labelAnnual) return;

  let isAnnual = false;

  const updatePricing = () => {
    // 1. Toggle visual track classes
    if (isAnnual) {
      toggleTrack.classList.add('active');
      labelAnnual.classList.add('active');
      labelMonthly.classList.remove('active');
    } else {
      toggleTrack.classList.remove('active');
      labelAnnual.classList.remove('active');
      labelMonthly.classList.add('active');
    }

    // 2. Loop through all pricing cards and update values
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
      // Find the main pricing display span
      const priceSpan = card.querySelector('.price-main span[data-monthly]');
      const periodSpan = card.querySelector('.price-main span[data-period]');
      const monthlyDisplay = card.querySelector('.monthly-display');
      const annualDisplay = card.querySelector('.annual-display');

      if (priceSpan) {
        const monthlyVal = priceSpan.getAttribute('data-monthly');
        const annualVal = priceSpan.getAttribute('data-annual');
        
        // Dynamic price update with smooth text fade
        priceSpan.style.opacity = 0;
        setTimeout(() => {
          priceSpan.textContent = isAnnual ? annualVal : monthlyVal;
          priceSpan.style.opacity = 1;
        }, 150);
      }

      if (periodSpan) {
        periodSpan.textContent = isAnnual ? '/year' : '/month';
      }

      // 3. Toggle alternative pricing display
      if (monthlyDisplay && annualDisplay) {
        if (isAnnual) {
          monthlyDisplay.classList.remove('show');
          annualDisplay.classList.add('show');
        } else {
          monthlyDisplay.classList.add('show');
          annualDisplay.classList.remove('show');
        }
      }
    });
  };

  // Click handler for toggle elements
  const toggleState = () => {
    isAnnual = !isAnnual;
    updatePricing();
  };

  toggleTrack.addEventListener('click', toggleState);
  labelMonthly.addEventListener('click', () => {
    if (isAnnual) {
      isAnnual = false;
      updatePricing();
    }
  });
  labelAnnual.addEventListener('click', () => {
    if (!isAnnual) {
      isAnnual = true;
      updatePricing();
    }
  });
}

/**
 * Handles centered popup Razorpay checkout window logic.
 * Avoids browser iframe blocker issues.
 */
function initRazorpayCheckout() {
  const checkoutButtons = document.querySelectorAll('.razorpay-btn');
  
  checkoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const checkoutUrl = button.getAttribute('data-url');
      if (!checkoutUrl) {
        console.warn('Razorpay checkout URL not found on button.');
        return;
      }

      // Popup dimensions
      const width = 600;
      const height = 700;
      
      // Calculate coordinates for centered window
      const left = window.top.outerWidth / 2 + window.top.screenX - width / 2;
      const top = window.top.outerHeight / 2 + window.top.screenY - height / 2;

      // Open centered window
      const popupWindow = window.open(
        checkoutUrl,
        'KylrxAICheckout',
        `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes`
      );

      if (popupWindow) {
        popupWindow.focus();
      } else {
        // Fallback if popup blocker is active
        window.location.href = checkoutUrl;
      }
    });
  });
}

/**
 * Handles smooth, offset-aware navigation scroll for all anchor links.
 * Prevents URL hash jumping, reloads, and ensures content is not covered by the fixed navbar.
 */
function initScrollNavigation() {
  const navbar = document.getElementById('navbar');
  
  // Select all links that have a hash target (e.g. href="#...")
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // If it's a simple placeholder link, prevent default and stay on page
      if (href === '#' || href === '') {
        e.preventDefault();
        // If it's the brand logo or a main login button, scroll smoothly to the top
        if (link.classList.contains('nav-brand') || link.classList.contains('btn-login')) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        return;
      }
      
      // Attempt to find the target element
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset (navbar height) dynamically
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        
        // Calculate element position relative to the document
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        
        // Subtract navbar height so section titles are not cut off, plus extra padding
        const offsetPosition = elementPosition - navbarHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

