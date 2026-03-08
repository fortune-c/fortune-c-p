(() => {
    // ── Overlay for page transitions ────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '9999',
        background: '#031504',
        opacity: '1',
        pointerEvents: 'none',
        transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)',
    });
    document.documentElement.appendChild(overlay);

    // ── Set initial hidden state for all animatable elements ────────
    const animatables = document.querySelectorAll<HTMLElement>('[data-animate]');
    animatables.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';
    });

    // ── Fade in overlay, then stagger-reveal content ────────────────
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Fade the overlay out
            overlay.style.opacity = '0';

            // After overlay fully fades (600ms), start staggering content in
            const BASE_DELAY = 620; // wait for overlay to finish
            const STAGGER = 120;   // ms between each element

            animatables.forEach((el, i) => {
                const delay = BASE_DELAY + i * STAGGER;
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
            });
        });
    });

    // ── Fade out on nav link click ──────────────────────────────────
    function handleLinkClick(e: MouseEvent): void {
        const target = (e.target as HTMLElement).closest('a');
        if (!target) return;

        const href = target.getAttribute('href');
        if (!href) return;

        if (
            href.startsWith('http') ||
            href.startsWith('//') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('javascript:') ||
            target.getAttribute('target') === '_blank'
        ) return;

        e.preventDefault();

        // Fade content out quickly before navigating
        animatables.forEach((el) => {
            el.style.transition = 'opacity 200ms ease, transform 200ms ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-12px)';
        });

        overlay.style.pointerEvents = 'all';
        overlay.style.opacity = '1';

        setTimeout(() => {
            window.location.href = href;
        }, 620);
    }

    document.addEventListener('click', handleLinkClick);
})();
