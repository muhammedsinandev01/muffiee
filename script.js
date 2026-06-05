/* ========================================
   ROMANTIC WEBSITE — script.js
   All interactivity, animations, particles
   ======================================== */

(() => {
    'use strict';

    // ── Anniversary Date ──
    const ANNIVERSARY = new Date('2023-12-22T00:00:00');

    // ── DOM Elements ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const loadingScreen = $('#loading-screen');
    const heartsCanvas = $('#hearts-canvas');
    const sparkleContainer = $('#sparkle-container');
    const nav = $('#main-nav');
    const openStoryBtn = $('#open-story-btn');
    const musicToggle = $('#music-toggle');
    const themeToggle = $('#theme-toggle');
    const envelopeWrapper = $('#envelope-wrapper');
    const confettiBtn = $('#confetti-btn');
    const confettiCanvas = $('#confetti-canvas');
    const constellationCanvas = $('#constellation-canvas');

    // ══════════════════════════════════
    // 1. LOADING SCREEN
    // ══════════════════════════════════
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Attempt autoplay when loading finishes
            if (bgMusic) {
                bgMusic.play().then(() => {
                    musicPlaying = true;
                    updateMusicUI();
                }).catch(e => {
                    console.log("Autoplay blocked, waiting for interaction");
                });
            }
        }, 2200);
    });

    // Fallback: Play on first interaction anywhere
    document.addEventListener('click', function initialPlay() {
        if (!musicPlaying && bgMusic) {
            bgMusic.play().then(() => {
                musicPlaying = true;
                updateMusicUI();
            }).catch(e => console.log("Playback failed:", e));
        }
        // Remove listener after first successful play attempt
        if (musicPlaying) document.removeEventListener('click', initialPlay);
    }, { once: true });

    // ══════════════════════════════════
    // 2. NAVIGATION SHOW ON SCROLL
    // ══════════════════════════════════
    let lastScrollY = 0;
    const heroSection = $('#hero');

    function handleNavScroll() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrollY > heroHeight * 0.5) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ══════════════════════════════════
    // 3. SMOOTH SCROLL TO NEXT SECTION
    // ══════════════════════════════════
    if (openStoryBtn) {
        openStoryBtn.addEventListener('click', () => {
            const counterSection = $('#love-counter');
            if (counterSection) {
                counterSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ══════════════════════════════════
    // 4. LOVE COUNTER
    // ══════════════════════════════════
    function updateCounter() {
        const now = new Date();
        const diff = now - ANNIVERSARY;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const daysEl = $('#counter-days');
        const hoursEl = $('#counter-hours');
        const minutesEl = $('#counter-minutes');
        const secondsEl = $('#counter-seconds');

        if (daysEl) daysEl.textContent = days.toLocaleString();
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);

    // ══════════════════════════════════
    // 5. LOVE CARDS FLIP
    // ══════════════════════════════════
    $$('.love-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // ══════════════════════════════════
    // 6. ENVELOPE OPENING
    // ══════════════════════════════════
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', function handler() {
            if (!this.classList.contains('opened')) {
                this.classList.add('opened');
            }
        });
    }

    // ══════════════════════════════════
    // 7. SCROLL ANIMATIONS (IntersectionObserver)
    // ══════════════════════════════════
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Timeline items
        $$('.timeline-item').forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.2}s`;
            observer.observe(item);
        });

        // Polaroids
        $$('.polaroid').forEach((polaroid, i) => {
            polaroid.style.transitionDelay = `${i * 0.15}s`;
            observer.observe(polaroid);
        });

        // Dream cards
        $$('.dream-card').forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.12}s`;
            observer.observe(card);
        });
    }

    setupScrollAnimations();

    // ══════════════════════════════════
    // 8. FLOATING HEARTS ON MOUSE MOVE
    // ══════════════════════════════════
    const ctx = heartsCanvas.getContext('2d');
    let hearts = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function resizeCanvas() {
        heartsCanvas.width = window.innerWidth;
        heartsCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Spawn a heart occasionally
        if (Math.random() > 0.85) {
            hearts.push({
                x: mouseX,
                y: mouseY,
                size: Math.random() * 12 + 6,
                vx: (Math.random() - 0.5) * 2,
                vy: -(Math.random() * 2 + 1),
                opacity: 1,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 4,
                color: ['#f78da7', '#e84393', '#c3a6d8', '#fd79a8', '#fab1a0'][Math.floor(Math.random() * 5)]
            });
        }
    });

    // Also spawn hearts on touch
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;

        if (Math.random() > 0.7) {
            hearts.push({
                x: mouseX,
                y: mouseY,
                size: Math.random() * 12 + 6,
                vx: (Math.random() - 0.5) * 2,
                vy: -(Math.random() * 2 + 1),
                opacity: 1,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 4,
                color: ['#f78da7', '#e84393', '#c3a6d8', '#fd79a8', '#fab1a0'][Math.floor(Math.random() * 5)]
            });
        }
    }, { passive: true });

    function drawHeart(ctx, x, y, size, rotation, color, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        const s = size / 16;
        ctx.moveTo(0, s * 3);
        ctx.bezierCurveTo(0, s * 0, -s * 10, -s * 3, -s * 5, -s * 8);
        ctx.bezierCurveTo(-s * 2, -s * 12, s * 2, -s * 12, s * 5, -s * 8);
        ctx.bezierCurveTo(s * 10, -s * 3, 0, s * 0, 0, s * 3);
        ctx.fill();
        ctx.restore();
    }

    function animateHearts() {
        ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

        hearts = hearts.filter(h => h.opacity > 0);
        hearts.forEach(h => {
            h.x += h.vx;
            h.y += h.vy;
            h.opacity -= 0.012;
            h.rotation += h.rotSpeed;
            h.vy -= 0.01; // float up

            drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.color, Math.max(0, h.opacity));
        });

        // Cap hearts
        if (hearts.length > 80) hearts.splice(0, hearts.length - 80);

        requestAnimationFrame(animateHearts);
    }
    animateHearts();

    // ══════════════════════════════════
    // 9. SPARKLE PARTICLES
    // ══════════════════════════════════
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkleContainer.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 6000);
    }

    setInterval(createSparkle, 400);

    // ══════════════════════════════════
    // 10. CONSTELLATION STARS
    // ══════════════════════════════════
    function createStars() {
        if (!constellationCanvas) return;
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 2) + 's';
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            constellationCanvas.appendChild(star);
        }
    }
    createStars();

    // ══════════════════════════════════
    // 11. CONFETTI ANIMATION
    // ══════════════════════════════════
    let confettiPieces = [];
    let confettiRunning = false;

    function launchConfetti() {
        if (confettiRunning) return;
        
        // Show proposal message and background
        const surpriseTitle = $('.surprise-title');
        const surpriseBg = $('#surprise-bg-image');
        if (surpriseTitle) surpriseTitle.textContent = "Will you be my forever? 💘";
        if (surpriseBg) surpriseBg.classList.add('show');
        
        confettiRunning = true;

        const cCtx = confettiCanvas.getContext('2d');
        confettiCanvas.width = confettiCanvas.parentElement.offsetWidth;
        confettiCanvas.height = confettiCanvas.parentElement.offsetHeight;

        const colors = ['#f78da7', '#e84393', '#c3a6d8', '#f9d56e', '#fd79a8', '#fab1a0', '#ff6b6b', '#a29bfe', '#74b9ff'];

        for (let i = 0; i < 150; i++) {
            confettiPieces.push({
                x: confettiCanvas.width / 2,
                y: confettiCanvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }

        function animateConfetti() {
            cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

            confettiPieces = confettiPieces.filter(p => p.opacity > 0);

            confettiPieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // gravity
                p.vx *= 0.99;
                p.opacity -= 0.005;
                p.rotation += p.rotSpeed;

                cCtx.save();
                cCtx.translate(p.x, p.y);
                cCtx.rotate((p.rotation * Math.PI) / 180);
                cCtx.globalAlpha = Math.max(0, p.opacity);
                cCtx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    cCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    cCtx.beginPath();
                    cCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    cCtx.fill();
                }

                cCtx.restore();
            });

            if (confettiPieces.length > 0) {
                requestAnimationFrame(animateConfetti);
            } else {
                confettiRunning = false;
            }
        }

        animateConfetti();
    }

    if (confettiBtn) {
        confettiBtn.addEventListener('click', launchConfetti);
    }

    // ══════════════════════════════════
    // 12. DARK / LIGHT MODE TOGGLE
    // ══════════════════════════════════
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);

            const lightIcon = themeToggle.querySelector('.icon-light');
            const darkIcon = themeToggle.querySelector('.icon-dark');

            if (next === 'dark') {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'inline';
            } else {
                lightIcon.style.display = 'inline';
                darkIcon.style.display = 'none';
            }
        });
    }

    // ══════════════════════════════════
    // 13. MUSIC TOGGLE (Functional)
    // ══════════════════════════════════
    const bgMusic = $('#bg-music');
    let musicPlaying = false;

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (musicPlaying) {
                bgMusic.pause();
                musicPlaying = false;
            } else {
                bgMusic.play().catch(e => console.log("Playback failed:", e));
                musicPlaying = true;
            }
            updateMusicUI();
        });
    }

    function updateMusicUI() {
        const offIcon = musicToggle.querySelector('.icon-music-off');
        const onIcon = musicToggle.querySelector('.icon-music-on');

        if (musicPlaying) {
            offIcon.style.display = 'none';
            onIcon.style.display = 'inline';
        } else {
            offIcon.style.display = 'inline';
            onIcon.style.display = 'none';
        }
    }

    // Start music on first interaction (Open Our Story)
    if (openStoryBtn) {
        openStoryBtn.addEventListener('click', () => {
            if (!musicPlaying && bgMusic) {
                bgMusic.play().catch(e => console.log("Playback failed:", e));
                musicPlaying = true;
                updateMusicUI();
            }
        });
    }

    // ══════════════════════════════════
    // 14. AUTO-SPAWN AMBIENT HEARTS
    // ══════════════════════════════════
    setInterval(() => {
        hearts.push({
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            size: Math.random() * 10 + 4,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(Math.random() * 1.5 + 0.5),
            opacity: 0.6,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 2,
            color: ['#f78da7', '#e84393', '#c3a6d8'][Math.floor(Math.random() * 3)]
        });
    }, 800);

})();
