document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Header scroll effect ─────────────────────────────
    const header = document.getElementById('main-header');

    const checkScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    // ── 2. Mobile Menu Toggle ───────────────────────────────
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu      = document.getElementById('nav-menu');
    const navLinks     = document.querySelectorAll('.nav-link');
    const toggleIcon   = mobileToggle.querySelector('i');

    const closeMenu = () => {
        navMenu.classList.remove('active');
        toggleIcon.className = 'fa-solid fa-bars';
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        navMenu.classList.add('active');
        toggleIcon.className = 'fa-solid fa-xmark';
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    // ── 3. Scroll Reveal ────────────────────────────────────
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Skip animations when user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ── 4. Project Card Spotlight (mouse-move glow) ─────────
    if (!prefersReducedMotion) {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--y', `${e.clientY - rect.top}px`);
            });
        });
    }

    // ── 5. Copy email button ────────────────────────────────
    const copyBtn = document.getElementById('btn-copy-email');
    const EMAIL   = 'hatimnoor9678@gmail.com';

    // Create toast element once
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    let toastTimer = null;

    const showToast = (msg) => {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(EMAIL)
                    .then(() => showToast('Email copied!'))
                    .catch(() => showToast('Could not copy — try manually.'));
            } else {
                // Fallback for older browsers
                const ta = document.createElement('textarea');
                ta.value = EMAIL;
                ta.style.position = 'fixed';
                ta.style.opacity  = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try {
                    document.execCommand('copy');
                    showToast('Email copied!');
                } catch {
                    showToast('Copy failed — please copy manually.');
                }
                document.body.removeChild(ta);
            }
        });
    }

});
