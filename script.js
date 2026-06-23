/* ==========================================================================
   Kylrx AI HRMS - Core Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Mobile Drawer ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // --- HRMS Modules Tabs Showcase ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Toggle active state on buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show current tab panel, hide others
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-${targetTab}`) {
                    panel.classList.add('active');
                }
            });
        });
    });


    // --- Interactive Pricing Slider ---
    const employeeSlider = document.getElementById('employee-slider');
    const selectedTierName = document.getElementById('selected-tier-name');
    const selectedTierDesc = document.getElementById('selected-tier-desc');
    const selectedPrice = document.getElementById('selected-price');
    const sliderLabels = document.querySelectorAll('.slider-label');

    // Pricing Bands — exact tiers as specified
    const pricingPlans = [
        { name: "0–100 Employees",      price: "1,000",  desc: "Perfect for startups and small scale teams." },
        { name: "101–200 Employees",    price: "1,300",  desc: "Fully featured HRMS toolkit for scaling companies." },
        { name: "201–500 Employees",    price: "2,200",  desc: "Comprehensive workflows for mid-sized companies." },
        { name: "501–1000 Employees",   price: "3,500",  desc: "Engineered for high-growth workforce structures." },
        { name: "1001–2000 Employees",  price: "4,000",  desc: "Dedicated resources for large SMB organizations." },
        { name: "Above 2000 Employees", price: "Contact Sales", desc: "Enterprise scale SLA, databases, and custom API syncs." }
    ];

    function updatePricing(index) {
        const plan = pricingPlans[index];
        if (!plan) return;

        const priceContainer = document.querySelector('.price-container');
        const currencySign = priceContainer ? priceContainer.querySelector('.currency') : null;
        const periodLabel = priceContainer ? priceContainer.querySelector('.period') : null;

        // Animate price change with a quick fade
        if (selectedPrice) {
            selectedPrice.style.opacity = '0';
            setTimeout(() => {
                if (plan.price === "Contact Sales") {
                    selectedPrice.textContent = plan.price;
                    selectedPrice.style.fontSize = '2.2rem';
                    if (currencySign) currencySign.style.display = 'none';
                    if (periodLabel) periodLabel.style.display = 'none';
                } else {
                    selectedPrice.textContent = plan.price;
                    selectedPrice.style.fontSize = '';
                    if (currencySign) currencySign.style.display = '';
                    if (periodLabel) periodLabel.style.display = '';
                }
                selectedPrice.style.opacity = '1';
            }, 150);
        }
        if (selectedTierName) selectedTierName.textContent = plan.name;
        if (selectedTierDesc) selectedTierDesc.textContent = plan.desc;

        // Highlight slider labels up to the active index
        sliderLabels.forEach((label, i) => {
            label.classList.toggle('active', i <= index);
        });

        // Update slider fill track color dynamically
        if (employeeSlider) {
            const pct = (index / (pricingPlans.length - 1)) * 100;
            employeeSlider.style.background =
                `linear-gradient(to right, #4DA6FF ${pct}%, #EAF4FF ${pct}%)`;
        }
    }

    if (employeeSlider) {
        employeeSlider.addEventListener('input', (e) => {
            updatePricing(parseInt(e.target.value));
        });
        // Initialize on page load
        updatePricing(parseInt(employeeSlider.value));
    }

    // Allow clicking a label to jump to that tier
    sliderLabels.forEach((label, index) => {
        label.addEventListener('click', () => {
            if (employeeSlider) {
                employeeSlider.value = index;
                updatePricing(index);
            }
        });
    });


    // --- FAQ Accordion behavior ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = faqItem.classList.contains('expanded');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('expanded');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle active state
            if (isExpanded) {
                faqItem.classList.remove('expanded');
                faqAnswer.style.maxHeight = null;
            } else {
                faqItem.classList.add('expanded');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            }
        });
    });


    // --- Call-To-Action Modals Logic ---
    const demoModal = document.getElementById('demo-modal');
    const contactTriggers = document.querySelectorAll('.btn-contact-trigger');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-overlay, .close-success-btn');

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms inside the modal
        const form = modal.querySelector('form');
        const successState = modal.querySelector('.form-success-state');
        if (form) {
            form.reset();
            form.classList.remove('hidden');
        }
        if (successState) {
            successState.classList.remove('active');
        }
    }

    contactTriggers.forEach(btn => {
        btn.addEventListener('click', () => openModal(demoModal));
    });


    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });


    // --- Form Submissions Handler ---
    const demoForm = document.getElementById('demo-form');
    const demoSuccess = document.getElementById('demo-success');

    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Validate form input elements (browser does basic validations, but we secure layout states here)
            demoForm.classList.add('hidden');
            demoSuccess.classList.add('active');
        });
    }



    // --- AI Live Core News Ticker (Hero Dashboard) ---
    const tickerItems = document.querySelectorAll('.ticker-item');
    let activeTickerIndex = 0;

    function rotateTicker() {
        if (tickerItems.length <= 1) return;

        const currentItem = tickerItems[activeTickerIndex];
        currentItem.classList.remove('active');
        currentItem.classList.add('exit');

        activeTickerIndex = (activeTickerIndex + 1) % tickerItems.length;
        const nextItem = tickerItems[activeTickerIndex];
        
        // Prepare next element entry
        nextItem.classList.remove('exit');
        nextItem.classList.add('active');

        // Reset previous exit element class after animation completes
        setTimeout(() => {
            currentItem.classList.remove('exit');
        }, 500);
    }

    setInterval(rotateTicker, 4500);


    // --- Counter Animation for Dashboard Stats ---
    const statsValueContainers = document.querySelectorAll('.stat-val.counter');

    function animateStatsCounter() {
        statsValueContainers.forEach(container => {
            const target = parseFloat(container.getAttribute('data-target'));
            let current = 0;
            const step = target / 50; // animates over ~50 steps
            
            // Checks if it is a percentage or absolute value
            const isPercent = container.textContent.includes('%');

            const counterInterval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counterInterval);
                }

                if (isPercent) {
                    container.textContent = current.toFixed(1) + '%';
                } else {
                    container.textContent = Math.floor(current).toString();
                }
            }, 20);
        });
    }

    // Dynamic Document Modal System
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
                        <div class="blog-meta">Published on June 24, 2026 • By Priya Sharma</div>
                        <p>Traditional HR spends over 40% of their workday answering basic employee questions about payroll structure, taxes, and leave policies. Learn how smart AI assistants resolve these queries in seconds, enhancing employee satisfaction.</p>
                    </div>
                    <div class="blog-item">
                        <div class="blog-title">Understanding real-time TVC dashboard monitoring & labor compliance</div>
                        <div class="blog-meta">Published on June 15, 2026 • By Rahul Mehta</div>
                        <p>Workforce dynamics require compliance at scale. This article outlines the security protocols, SSO protections, and mismatch systems that prevent regulatory fines in scaling startups and medium enterprises.</p>
                    </div>
                    <div class="blog-item">
                        <div class="blog-title">AI-Powered Mismatch Detection: The Future of Payroll Accuracy</div>
                        <div class="blog-meta">Published on June 02, 2026 • By HR Lab Team</div>
                        <p>Manual leave adjustments and clock-in errors lead to an average payroll discrepancy rate of 3.2%. See how automated anomaly detection algorithms match inputs and prevent billing leaks.</p>
                    </div>
                `
            },
            privacy: {
                title: 'Privacy Policy',
                html: `
                    <p><strong>Last Updated: June 27, 2026</strong></p>
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
                    <p><strong>Effective Date: June 27, 2026</strong></p>
                    <p>Welcome to Kylrx AI. By subscribing to our SaaS platform, your organization agrees to be bound by these Terms of Service.</p>
                    <h4>1. Platform License & Access</h4>
                    <p>Kylrx AI grants a non-exclusive, non-transferable, revocable license to access our platform in accordance with the features detailed in your subscribed plan.</p>
                    <h4>2. Data Security & Ownership</h4>
                    <p>Your organization retains complete ownership of all data submitted to the platform. Kylrx AI commits to maintaining robust backup regimes and SOC 2 security standards as outlined in our security protocol.</p>
                    <h4>3. Payments, Cancellations & Strict No-Refund Policy</h4>
                    <p>Billing is managed on a monthly cycle. Subscriptions can be upgraded, downgraded, or canceled with a 30-day notice. All payments are strictly non-refundable. Under no circumstances will refunds, credits, or prorated adjustments be issued for partial months, subscription downgrades, or unused service terms. We offer a guaranteed 99.9% uptime SLA commit for all Scale and Enterprise instances.</p>
                `
            },
            cookies: {
                title: 'Cookie Policy',
                html: `
                    <p><strong>Last Updated: June 27, 2026</strong></p>
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
                title: 'Security & Infrastructure Protocol Whitepaper',
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
                    <p>Calculates and logs accurate deductions for Provident Fund, statutory health allocations, Professional Tax (PT), and tax deductions.</p>
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
                                <li><a href="#features">Core Platform Features</a></li>
                            </ul>
                        </li>
                        <li><strong>Pricing Plans:</strong>
                            <ul>
                                <li><a href="#pricing">Tiered Pricing Calculator</a></li>
                            </ul>
                        </li>
                        <li><strong>Company Resources:</strong>
                            <ul>
                                <li><a href="#" data-doc="about">About Us & Our Mission</a></li>
                                <li><a href="#" data-doc="careers">Careers & Open Roles</a></li>
                                <li><a href="#" data-doc="blog">Insights Blog Articles</a></li>
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

            // Re-wire sitemap modal links
            const modalLinks = modalContent.querySelectorAll('a[data-doc]');
            modalLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const nextDocKey = link.getAttribute('data-doc');
                    openModal(nextDocKey);
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

    // Initialize document modal triggers
    initDocModal();

    // Trigger stat counters animation on load
    setTimeout(animateStatsCounter, 800);

});
