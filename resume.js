/* ==========================================================================
   Norlan Jan Garcia - Resume/Portfolio Interactions
   This file adds animations and interactivity without touching the
   existing HTML or CSS files. It injects a small stylesheet of its own
   (needed for fade/slide animation states and the scroll-to-top button)
   and then wires up the behavior.
   ========================================================================== */

/* --------------------------------------------------------------------------
   0. Wait for the page to fully load before doing anything
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    injectAnimationStyles();
    setupSectionReveal();
    setupHeroAnimation();
    setupNavActiveLink();
    setupProjectCardInteraction();
    setupSkillsStagger();
    setupScrollToTopButton();
});

/* --------------------------------------------------------------------------
   1. Inject the CSS needed for animation states
   These classes don't exist in the original stylesheet, so we add a
   <style> tag with just what's required. This keeps style.css untouched.
   -------------------------------------------------------------------------- */
function injectAnimationStyles() {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        /* Sections start hidden/shifted, then reveal on scroll */
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Hero elements start hidden, then fade in one by one on load */
        .hero-fade {
            opacity: 0;
            transform: translateY(15px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-fade.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Skill tags stagger in when their section is revealed */
        .skill-fade {
            opacity: 0;
            transform: translateY(15px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .skill-fade.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Highlight the nav link for the section currently in view */
        header nav ul li a.active-link {
            color: #ffffff;
            border-bottom-color: #2563eb;
        }

        /* Scroll-to-top button, created and styled entirely from JS */
        #scrollToTopBtn {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 46px;
            height: 46px;
            border: none;
            border-radius: 50%;
            background-color: #2563eb;
            color: #ffffff;
            font-size: 1.2rem;
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(10, 25, 47, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.25s ease;
            z-index: 1000;
        }
        #scrollToTopBtn.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        #scrollToTopBtn:hover {
            background-color: #1d4ed8;
        }
    `;
    document.head.appendChild(styleTag);
}

/* --------------------------------------------------------------------------
   2. Smooth section reveal on scroll (Intersection Observer)
   Each <section> fades in and slides up slightly when it enters the
   viewport. The Home section is skipped here since it has its own
   load-in animation (see setupHeroAnimation).
   -------------------------------------------------------------------------- */
function setupSectionReveal() {
    const sections = document.querySelectorAll('main section');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // animate once only
            }
        });
    }, {
        threshold: 0.15
    });

    sections.forEach((section) => {
        if (section.id === 'home') return; // handled by hero animation
        section.classList.add('reveal-on-scroll');
        observer.observe(section);
    });
}

/* --------------------------------------------------------------------------
   3. Hero animation on page load
   Name fades in first, then the two subtitle lines, then the button.
   -------------------------------------------------------------------------- */
function setupHeroAnimation() {
    const hero = document.getElementById('home');
    if (!hero) return;

    // Grab the hero's direct children in their existing order
    const heroElements = hero.querySelectorAll('h1, p, a');
    if (!heroElements.length) return;

    heroElements.forEach((el) => el.classList.add('hero-fade'));

    // Reveal each element in sequence with a small delay between them
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('is-visible');
        }, 200 + index * 250);
    });
}

/* --------------------------------------------------------------------------
   4. Highlight the nav link for the section currently in view
   -------------------------------------------------------------------------- */
function setupNavActiveLink() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const sections = document.querySelectorAll('main section[id]');
    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');

                navLinks.forEach((link) => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, {
        // Counts a section as "current" once it reaches the middle of the screen
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. Subtle project card interaction
   The CSS already handles lift + shadow on hover; this adds a slightly
   deeper shadow while the mouse is actively over the card, and removes
   it on mouse leave, without overriding the CSS transform.
   -------------------------------------------------------------------------- */
function setupProjectCardInteraction() {
    const projectCards = document.querySelectorAll('#projects article');
    if (!projectCards.length) return;

    projectCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 14px 30px rgba(10, 25, 47, 0.18)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = ''; // fall back to the CSS default
        });
    });
}

/* --------------------------------------------------------------------------
   6. Staggered skill tag reveal when the Skills section comes into view
   -------------------------------------------------------------------------- */
function setupSkillsStagger() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const skillItems = skillsSection.querySelectorAll('li');
    if (!skillItems.length) return;

    skillItems.forEach((item) => item.classList.add('skill-fade'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, index * 120);
                });
                observer.unobserve(entry.target); // animate once only
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(skillsSection);
}

/* --------------------------------------------------------------------------
   7. Scroll-to-top button
   Created entirely in JavaScript so the HTML doesn't need editing.
   -------------------------------------------------------------------------- */
function setupScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTopBtn';
    button.setAttribute('aria-label', 'Scroll to top');
    button.textContent = '↑';
    document.body.appendChild(button);

    // Show the button only after scrolling down a bit
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });

    // Smoothly scroll back to the top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}