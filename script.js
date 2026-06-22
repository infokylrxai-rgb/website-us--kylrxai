import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/**
 * Kylrx AI - Landing Page Interactions
 * Handles pricing billing toggle, responsive navbar, hamburger menu, and smooth scrolling.
 */

function init() {
  initNavbarScroll();
  initMobileMenu();
  initBillingToggle();
  initScrollNavigation();
  initDocModal();
  initTestimonialSlider();
  initContactSalesModal();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

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

/**
 * Dynamic Document Modal System
 * Provides rich, high-fidelity popups for Company and Legal links, making the site fully functional.
 */
function initDocModal() {
  const modal = document.getElementById('docModal');
  const overlay = document.getElementById('docModalOverlay');
  const closeBtn = document.getElementById('docModalClose');
  const modalTitle = document.getElementById('docModalTitle');
  const modalContent = document.getElementById('docModalContent');
  
  if (!modal || !overlay || !closeBtn || !modalTitle || !modalContent) return;

  // Rich premium content database
  const docDatabase = {
    about: {
      title: 'About Kylrx AI',
      html: `
        <p><strong>Kylrx AI</strong> is a next-generation, AI-first Human Resource Management System (HRMS) designed to automate operations, eliminate administrative friction, and boost productivity for the modern workforce.</p>
        <h4>Our Mission</h4>
        <p>We are on a mission to free HR professionals and organization leaders from repetitive spreadsheets, manual leave tracking, and error-prone payroll computations. By introducing self-improving artificial intelligence, we enable companies to manage attendance, compliance, and payroll instantly in seconds.</p>
        <h4>Next-Gen HR Technology</h4>
        <p>Built on robust serverless architectures and integrated with state-of-the-art LLMs, Kylrx AI acts as an autonomous HR business partner. It monitors anomalies, provides real-time mismatch alerts, and answers complex employee payroll questions automatically.</p>
        <h4>Our Values</h4>
        <ul>
          <li><strong>Innovation:</strong> Continuously push the boundaries of automated productivity.</li>
          <li><strong>Integrity & Trust:</strong> Keeping your enterprise data secure with bank-grade encryption.</li>
          <li><strong>Empowerment:</strong> Creating solutions that give team leaders real-time visibility and actionable insights.</li>
        </ul>
      `
    },
    careers: {
      title: 'Careers at Kylrx AI',
      html: `
        <p>Join a fast-growing, world-class team of engineers, researchers, and designers building the future of automated enterprise operations. Explore our open roles below:</p>
        <div class="job-item">
          <div>
            <div class="job-title">AI Research Lead (LLMs)</div>
            <div class="job-meta">Remote • Full-Time • Engineering</div>
          </div>
          <button class="job-apply">Apply Now</button>
        </div>
        <div class="job-item">
          <div>
            <div class="job-title">Senior Frontend Engineer (React/CSS)</div>
            <div class="job-meta">Bangalore, IN • Hybrid • Engineering</div>
          </div>
          <button class="job-apply">Apply Now</button>
        </div>
        <div class="job-item">
          <div>
            <div class="job-title">Product Designer (Design Systems)</div>
            <div class="job-meta">Bangalore, IN • On-Site • Design</div>
          </div>
          <button class="job-apply">Apply Now</button>
        </div>
        <div class="job-item">
          <div>
            <div class="job-title">Enterprise Account Executive</div>
            <div class="job-meta">Remote • Full-Time • Sales</div>
          </div>
          <button class="job-apply">Apply Now</button>
        </div>
      `
    },
    blog: {
      title: 'Kylrx AI Blog',
      html: `
        <p>Explore recent insights, research, and best practices in HR tech, automated compliance, and organizational productivity.</p>
        <div class="blog-item">
          <div class="blog-title">How Generative AI is Eliminating the Traditional HR Helpdesk</div>
          <div class="blog-meta">Published on May 24, 2026 • By Priya Sharma</div>
          <p>Traditional HR spends over 40% of their workday answering basic employee questions about payroll structure, taxes, and leave policies. Learn how smart AI assistants resolve these queries in seconds, enhancing employee satisfaction.</p>
        </div>
        <div class="blog-item">
          <div class="blog-title">Understanding real-time TVC dashboard monitoring & labor compliance</div>
          <div class="blog-meta">Published on May 15, 2026 • By Rahul Mehta</div>
          <p>Workforce dynamics require compliance at scale. This article outlines the security protocols, SSO protections, and mismatch systems that prevent regulatory fines in scaling startups and medium enterprises.</p>
        </div>
        <div class="blog-item">
          <div class="blog-title">AI-Powered Mismatch Detection: The Future of Payroll Accuracy</div>
          <div class="blog-meta">Published on May 02, 2026 • By HR Lab Team</div>
          <p>Manual leave adjustments and clock-in errors lead to an average payroll discrepancy rate of 3.2%. See how automated anomaly detection algorithms match inputs and prevent billing leaks.</p>
        </div>
      `
    },

    privacy: {
      title: 'Privacy Policy',
      html: `
        <p><strong>Last Updated: May 27, 2026</strong></p>
        <p>At Kylrx AI, we prioritize the confidentiality and safety of your employee and organizational data. This Privacy Policy details our data collection, usage, and security practices.</p>
        <h4>1. Information We Collect</h4>
        <p>To deliver AI-powered HR and payroll services, we process: employee roster details, secure biometric attendance tokens (where TVC is enabled), clock-in/out stamps, leave entries, and salary calculation parameters.</p>
        <h4>2. Use of AI and Machine Learning</h4>
        <p>We use automated systems to run payroll calculations, evaluate anomaly alerts, and answer questions via our AI Assistant. We do NOT use your private organizational data to train public models. All learning is strictly partitioned to your individual company instance.</p>
        <h4>3. Security Framework</h4>
        <p>We leverage advanced serverless infrastructure and high-fidelity encryption systems (AES-256 and TLS 1.3) to protect data at rest and in transit. Secure logins are supported by Single Sign-On (SSO) protocols.</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      html: `
        <p><strong>Effective Date: May 27, 2026</strong></p>
        <p>Welcome to Kylrx AI. By subscribing to our SaaS platform, your organization agrees to be bound by these Terms of Service.</p>
        <h4>1. Platform License & Access</h4>
        <p>Kylrx AI grants a non-exclusive, non-transferable, revocable license to access our platform in accordance with the features detailed in your subscribed plan (Starter, Growth, Scale, or Enterprise).</p>
        <h4>2. Data Security & Ownership</h4>
        <p>Your organization retains complete ownership of all data submitted to the platform. Kylrx AI commits to maintaining robust backup regimes and SOC 2 security standards as outlined in our security protocol.</p>
        <h4>3. Payments, Cancellations & Service Levels</h4>
        <p>Billing is managed on a monthly or annual cycle. Subscriptions can be upgraded, downgraded, or canceled with a 30-day notice. We offer a guaranteed 99.9% uptime SLA commit for all Scale and Enterprise instances.</p>
      `
    },
    cookies: {
      title: 'Cookie Policy',
      html: `
        <p><strong>Last Updated: May 27, 2026</strong></p>
        <p>Our website and HRMS portal use cookies to provide stable session state, analyze site traffic, and optimize load speeds.</p>
        <h4>Essential Cookies</h4>
        <p>These cookies are required for core security features and platform operations. Without these, secure login states and billing toggles cannot function.</p>
        <h4>Analytical and Performance Cookies</h4>
        <p>These enable us to measure employee activity, identify usage trends, and improve the loading speed of live dashboards.</p>
        <h4>Marketing & Targeting</h4>
        <p>Used to deliver personalized offers and advertisements regarding Kylrx AI pricing plans on external sites. These can be opted out in your profile preferences at any time.</p>
      `
    },
    security: {
      title: 'Security & Infrastructure Protocol',
      html: `
        <p>Security is the foundation of Kylrx AI. We implement rigorous enterprise-grade measures to protect your organization's sensitive human resource and payroll records.</p>
        <h4>SOC 2 and ISO Standards</h4>
        <p>Our operations, data centers, and server architectures are fully SOC 2 Type II certified. All infrastructure resides in Tier-4 hyper-secure cloud facilities featuring physical access guards and automated red-team auditing.</p>
        <h4>Data Encryption Standards</h4>
        <ul>
          <li><strong>In Transit:</strong> Encrypted using TLS 1.3 protocol with secure cipher suites.</li>
          <li><strong>At Rest:</strong> Enforced hardware-level AES-256 volume encryption.</li>
        </ul>
        <h4>SSO Login and IAM controls</h4>
        <p>Keep your platform access secure with robust Single Sign-On (SSO) supporting SAML 2.0 and OIDC. Granular role-based access controls ensure department managers only see authorized parameters.</p>
      `
    },
    compliance: {
      title: 'Labor Law & Compliance Framework',
      html: `
        <p>Our payroll engine is continuously updated to handle local labor codes, tax brackets, and mandatory benefits calculations seamlessly and error-free.</p>
        <h4>Automatic Statutory Calculations</h4>
        <p>Calculates and logs accurate deductions for: Provident Fund (PF), Employee State Insurance (ESIC), Professional Tax (PT), and TDS (Tax Deducted at Source) structures.</p>
        <h4>Audit-Ready Compliance Reporting</h4>
        <p>Generate one-click compliance reports ready for audit. Our mismatch filters actively scan for wage-and-hour compliance issues, ensuring no regulatory fines occur.</p>
      `
    },
    sitemap: {
      title: 'Website Sitemap',
      html: `
        <p>Quick navigation map of all sections, documents, and pricing resources across the Kylrx AI platform:</p>
        <ul>
          <li><strong>Product Platform:</strong>
            <ul>
              <li><a href="#home">Home Landing Page</a></li>
              <li><a href="#why">Core Platform Features</a></li>
              <li><a href="#why">TVC Dashboard &amp; Compliance</a></li>
            </ul>
          </li>
          <li><strong>Pricing Plans:</strong>
            <ul>
              <li><a href="#pricing">Starter Plan Structure</a></li>
              <li><a href="#pricing">Growth Plan Structure (Featured)</a></li>
              <li><a href="#pricing">Scale Plan Structure</a></li>
              <li><a href="#pricing">Enterprise Custom Pricing</a></li>
            </ul>
          </li>
          <li><strong>Company Resources:</strong>
            <ul>
              <li><a href="#" data-doc="about">About Us & Our Mission</a></li>
              <li><a href="#" data-doc="careers">Careers & Open Roles</a></li>
              <li><a href="blog.html">Insights Blog Articles</a></li>
            </ul>
          </li>
          <li><strong>Legal & Compliance Documents:</strong>
            <ul>
              <li><a href="#" data-doc="privacy">Privacy Notice</a></li>
              <li><a href="#" data-doc="terms">Terms of Service License</a></li>
              <li><a href="#" data-doc="cookies">Cookie Settings Policy</a></li>
              <li><a href="#" data-doc="security">Platform Security Whitepaper</a></li>
              <li><a href="#" data-doc="compliance">Compliance Statutory Manual</a></li>
            </ul>
          </li>
        </ul>
      `
    }
  };

  // Open modal handler
  const openModal = (docKey) => {
    const docData = docDatabase[docKey];
    if (!docData) return;

    modalTitle.textContent = docData.title;
    modalContent.innerHTML = docData.html;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent page scroll
    
    // Auto-focus dynamic apply or close button
    const firstFocusable = modalContent.querySelector('button') || closeBtn;
    firstFocusable.focus();

    // Wire newly rendered dynamic apply/download buttons inside content
    const applyButtons = modalContent.querySelectorAll('.job-apply');
    applyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Application successfully submitted! Our recruiting team will contact you shortly.');
      });
    });
  };

  // Close modal handler
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore page scroll
  };

  // Register footer document links click triggers
  document.querySelectorAll('a[data-doc]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const docKey = link.getAttribute('data-doc');
      openModal(docKey);
    });
  });

  // Event Listeners for closing modal
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Testimonial Slider / Carousel
 * Handles smooth sliding transitions, auto-play, responsive card spacing,
 * and elegant pill-expansion indicator dots.
 * Supports exactly 3 navigation dots representing 3 groups of 3 cards (9 cards total).
 */
function initTestimonialSlider() {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  if (!track || !dotsContainer) return;

  const cards = Array.from(track.children);
  
  let currentSlide = 0; // Slide index: 0, 1, or 2
  let autoPlayTimer = null;

  // Generate pagination dots: exactly 3 dots representing groups of 3
  const createDots = () => {
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('button');
      dot.className = `testi-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide group ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateDotsActiveState = () => {
    const dots = dotsContainer.querySelectorAll('.testi-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToSlide = (slideIndex) => {
    // Clamp slideIndex between 0 and 2 for infinite wrap-around
    if (slideIndex > 2) {
      currentSlide = 0;
    } else if (slideIndex < 0) {
      currentSlide = 2;
    } else {
      currentSlide = slideIndex;
    }

    const card = cards[0];
    const cardWidth = card.getBoundingClientRect().width;
    
    // Get actual gap size from computed styles of track (fallback to 32px / 2rem)
    const computedStyle = window.getComputedStyle(track);
    const gap = parseFloat(computedStyle.gap) || 32;

    // Slide in groups of exactly 3 cards
    const translateOffset = currentSlide * 3 * (cardWidth + gap);
    track.style.transform = `translateX(-${translateOffset}px)`;
    
    updateDotsActiveState();
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, 5000); // Slide every 5 seconds
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  // Initialization
  createDots();
  startAutoPlay();

  // Recalculate on window resize to ensure sizes and offsets stay perfect
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      goToSlide(currentSlide); // Recalculate track position
    }, 100);
  });

  // Touch Swipe Support for Mobile/Tablets
  let startX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    clearInterval(autoPlayTimer);
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    // Swipe left (next)
    if (diff > 50) {
      goToSlide(currentSlide + 1);
      isSwiping = false;
      resetAutoPlay();
    }
    // Swipe right (prev)
    else if (diff < -50) {
      goToSlide(currentSlide - 1);
      isSwiping = false;
      resetAutoPlay();
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isSwiping = false;
  }, { passive: true });
}

/**
 * Contact Sales & Razorpay Integration Modal
 */
function initContactSalesModal() {
  const modal = document.getElementById('contactSalesModal');
  const overlay = document.getElementById('contactSalesOverlay');
  const closeBtn = document.getElementById('contactSalesClose');
  const form = document.getElementById('contactSalesForm');
  const submitBtn = document.getElementById('contactSalesSubmitBtn');
  const planInput = document.getElementById('contactPlanInput');
  const modalSub = document.getElementById('contactSalesSub');
  
  if (!modal || !overlay || !closeBtn || !form || !submitBtn || !planInput || !modalSub) return;

  let activeRazorpayUrl = '';

  // Intercept clicks on the pricing cards
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    const btn = card.querySelector('.btn-card');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const planName = card.querySelector('.plan-name').textContent.trim();
        activeRazorpayUrl = btn.getAttribute('href');
        
        planInput.value = planName;
        modalSub.textContent = `Fill out your details to secure your ${planName} and proceed to payment.`;
        
        // Open Modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Auto-focus first input
        const firstInput = document.getElementById('contactName');
        if (firstInput) firstInput.focus();
      });
    }
  });

  // Close modal helper
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Submit Handler using Web3Forms & Redirect to Razorpay
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "87322638-b287-40fd-a6e8-fef7d943e863");

    const submitSpan = submitBtn.querySelector('span');
    const originalText = submitSpan ? submitSpan.textContent : "Proceed to Payment";

    if (submitSpan) submitSpan.textContent = "Processing...";
    submitBtn.disabled = true;

    try {
      // 1. Submit to Web3Forms for email notifications
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Save lead data directly to Firebase Firestore
        try {
          await addDoc(collection(db, "leads"), {
            name: formData.get("name") || "",
            email: formData.get("email") || "",
            phone: formData.get("phone") || "",
            plan: formData.get("plan") || planInput.value || "Unknown",
            createdAt: serverTimestamp(),
            source: "marketing_website",
            status: "New"
          });
          console.log("✅ Lead successfully saved to Firebase Firestore backend");
        } catch (firestoreError) {
          console.error("Firestore lead save failed:", firestoreError);
        }

        // 3. Open Razorpay link in a new tab and close modal
        if (activeRazorpayUrl) {
          window.open(activeRazorpayUrl, '_blank', 'noopener,noreferrer');
        }
        
        alert("Success! Your details have been submitted. Redirecting to payment...");
        closeModal();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      if (submitSpan) submitSpan.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

