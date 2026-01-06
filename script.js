// ========================================
// BOOT ANIMATION TIMING CONFIGURATION
// ========================================
//
// All boot sequence timings in one place for easy tweaking.
//
// IMPORTANT: When changing text fade-in delays (line2, line3, line4),
// you MUST also update the corresponding CSS animation-delay values
// in the .boot-text.line-X styles above.
//
// All values in milliseconds.
// ========================================
const BOOT_TIMING = {
    // Text fade-in delays (must match CSS animation-delay values)
    line2: 375,       // "Stealth is over." (25% faster from original: 500 * 0.75)
    line3: 1500,     // "Intelligence requires power." (25% faster from original: 2000 * 0.75)
    line4: 2625,    // Highlighted line with cursor (25% faster from original: 3500 * 0.75)

    // Cursor movement delays - add blink time at line-4 before moving
    cursorBlinkAtLine4: 6500,  // Blink 3 times at end of line-4 (3 cycles at 500ms each = 1500ms)
    cursorMoveLine5: 6500,     // Move to empty line 5
    cursorMoveLine6: 6700,     // Move to empty line 6

    // Typing animation
    typingStart: 6900,         // When typing "jmachina.io" begins
    typingSpeed: 150,          // Milliseconds per character

    // Calculated: logo typing end = typingStart + (11 chars * typingSpeed)
    // = 6900 + (11 * 150) = 6900 + 1650 = 8550
    // Blink cycles (1.5 cycles at 1000ms each) = 1500ms
    // Navigation animation starts at 8550 + 1500 = 10050ms
    navAnimationStart: 10050,  // Start revealing nav menu
    navItemDelay: 250,        // Delay between each menu item reveal
};

// Theme Toggle
const lightThemeBtn = document.querySelector('.light-theme-btn');
const darkThemeBtn = document.querySelector('.dark-theme-btn');
const body = document.body;

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    lightThemeBtn.classList.remove('active');
    darkThemeBtn.classList.add('active');
}

// Theme toggle handlers
lightThemeBtn.addEventListener('click', () => {
    body.classList.remove('dark-theme');
    lightThemeBtn.classList.add('active');
    darkThemeBtn.classList.remove('active');
    localStorage.setItem('theme', 'light');
});

darkThemeBtn.addEventListener('click', () => {
    body.classList.add('dark-theme');
    darkThemeBtn.classList.add('active');
    lightThemeBtn.classList.remove('active');
    localStorage.setItem('theme', 'dark');
});

// Cursor and logo animation
const logoText = document.getElementById('logo-text');
const edgeCursor = document.getElementById('edge-cursor');
const cursorLine5 = document.getElementById('cursor-line5');
const cursorLine6 = document.getElementById('cursor-line6');
const logoCursor = document.getElementById('logo-cursor');

// Clear logo text for typewriter animation (text is in HTML for no-JS fallback)
logoText.textContent = '';

// Track if animation is complete
let bootAnimationComplete = false;
let allowUrlUpdates = false; // Prevent URL updates until user scrolls or animation completes

// Function to skip to final state
function completeBootAnimation() {
    if (bootAnimationComplete) return;
    bootAnimationComplete = true;

    // Add class to trigger instant completion
    document.body.classList.add('boot-complete');

    // Hide all boot animation cursors immediately
    document.querySelectorAll('.cursor:not(.footer-cursor), .nav-cursor').forEach(cursor => {
        cursor.classList.remove('visible', 'blinking');
        cursor.classList.add('hidden');
        cursor.style.display = 'none';  // Force hide with inline style
    });

    // Fade in all boot text smoothly
    document.querySelectorAll('.boot-text').forEach(el => {
        el.classList.add('skip-animation');
    });

    // Complete logo typing with fade
    logoText.textContent = "jmachina.io";

    // Fade in all nav items
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible-nav-item');
        }, index * 50); // Stagger by 50ms each
    });

    // Reveal all content sections when animation is skipped
    document.querySelectorAll('.reveal').forEach(element => {
        element.classList.add('active');
    });
}

// Cache DOM elements for performance
const nav = document.querySelector('nav');
const revealElements = document.querySelectorAll('.reveal');
const cachedSections = [
    document.querySelector('.boot-screen'),
    document.getElementById('about'),
    document.getElementById('problem'),
    document.getElementById('capabilities'),
    document.getElementById('contact')
];

// Consolidated scroll handler for all scroll-based animations
function handleScroll() {
    const scrollY = window.scrollY;

    // Enable URL updates on first scroll
    if (!allowUrlUpdates && scrollY > 10) {
        allowUrlUpdates = true;
    }

    // Complete boot animation on scroll
    if (!bootAnimationComplete && scrollY > 10) {
        completeBootAnimation();
    }

    // Nav stuck detection
    const navRect = nav.getBoundingClientRect();
    if (navRect.top <= 1) {
        nav.classList.add('stuck');
    } else {
        nav.classList.remove('stuck');
    }

    // Reveal animations
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Keep cursor at line-4 blinking for a moment, then move to line-5
setTimeout(() => {
    if (bootAnimationComplete) return;
    edgeCursor.classList.add('hidden');
    cursorLine5.classList.add('visible');
    document.querySelector('.boot-text.line-5').classList.add('visible-line');
}, BOOT_TIMING.cursorMoveLine5);

// Move to line-6
setTimeout(() => {
    if (bootAnimationComplete) return;
    cursorLine5.classList.add('hidden');
    cursorLine6.classList.add('visible');
    document.querySelector('.boot-text.line-6').classList.add('visible-line');
}, BOOT_TIMING.cursorMoveLine6);

// Start typing the logo after line-6
setTimeout(() => {
    if (bootAnimationComplete) return;
    // Hide line-6 cursor, show logo cursor
    cursorLine6.classList.add('hidden');
    logoCursor.classList.add('visible', 'typing');

    const text = "jmachina.io";
    let charIndex = 0;

    function typeCharacter() {
        if (bootAnimationComplete) return;
        if (charIndex < text.length) {
            logoText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, BOOT_TIMING.typingSpeed);
        } else {
            // Resume blinking after typing is done
            logoCursor.classList.remove('typing');
            logoCursor.classList.add('blinking');
        }
    }

    typeCharacter();
}, BOOT_TIMING.typingStart);

// Animate navigation menu after logo completes and 3 blink cycles
setTimeout(() => {
    if (bootAnimationComplete) return;
    const navItems = document.querySelectorAll('nav ul li');
    const navCursors = [
        document.getElementById('nav-cursor-0'),
        document.getElementById('nav-cursor-1'),
        document.getElementById('nav-cursor-2'),
        document.getElementById('nav-cursor-3')
    ];

    // Hide the logo cursor
    logoCursor.classList.add('hidden');

    // Animate through each menu item
    let currentNavItem = 0;

    function revealNextNavItem() {
        if (bootAnimationComplete) return;
        if (currentNavItem < navItems.length) {
            // Make the current nav item visible
            navItems[currentNavItem].classList.add('visible-nav-item');

            // Show cursor next to the current item
            navCursors[currentNavItem].classList.add('visible', 'blinking');

            // Move to next item after delay
            setTimeout(() => {
                if (bootAnimationComplete) return;

                currentNavItem++;

                if (currentNavItem < navItems.length) {
                    // Hide current cursor completely
                    navCursors[currentNavItem - 1].classList.add('hidden');
                    // Continue to next item
                    setTimeout(revealNextNavItem, BOOT_TIMING.navItemDelay);
                } else {
                    // This is the last item (contact) - blink briefly before hiding
                    const lastCursor = navCursors[currentNavItem - 1];

                    // Reveal all content sections immediately when last nav item appears
                    document.querySelectorAll('.reveal').forEach(element => {
                        element.classList.add('active');
                    });

                    // Let cursor blink for 1.5 seconds (1.5 cycles) then hide and mark complete
                    setTimeout(() => {
                        if (bootAnimationComplete) return;
                        lastCursor.classList.add('hidden');
                        // Mark animation as complete when all nav items are revealed
                        bootAnimationComplete = true;
                        // Add boot-complete class to hide all boot cursors
                        document.body.classList.add('boot-complete');
                        // Force hide all boot cursors with inline styles
                        document.querySelectorAll('.cursor:not(.footer-cursor), .nav-cursor').forEach(cursor => {
                            cursor.style.display = 'none';
                        });
                        // Enable URL updates after boot animation completes
                        allowUrlUpdates = true;
                    }, 1500);
                }
            }, BOOT_TIMING.navItemDelay);
        }
    }

    revealNextNavItem();
}, BOOT_TIMING.navAnimationStart);

// Keyboard navigation for menu
const menuItems = document.querySelectorAll('nav a');
let currentMenuIndex = 0;

function highlightMenuItem(index) {
    menuItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (menuItems.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex + 1) % menuItems.length;
        highlightMenuItem(currentMenuIndex);
        // Immediately trigger scroll
        menuItems[currentMenuIndex].click();
    } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        currentMenuIndex = (currentMenuIndex - 1 + menuItems.length) % menuItems.length;
        highlightMenuItem(currentMenuIndex);
        // Immediately trigger scroll
        menuItems[currentMenuIndex].click();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        menuItems[currentMenuIndex].click();
    }
});

// Old scroll handlers removed - now consolidated in handleScroll() above

// Update menu selection and URL based on scroll position
let isScrolling = false;
let updateTimeout = null;

const sectionObserver = new IntersectionObserver((entries) => {
    if (isScrolling) return;
    // Don't update URL until user scrolls or animation completes
    if (!allowUrlUpdates) return;

    // Debounce updates to prevent flickering
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(() => {
        // Use cached sections for performance
        let mostVisible = null;
        let maxVisibility = 0;

        cachedSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate how much of the section is visible
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const visibleTop = Math.max(sectionTop, 0);
            const visibleBottom = Math.min(sectionBottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            // If we're at the very top (scrollY < 50), strongly prefer boot screen
            if (window.scrollY < 50 && section.classList.contains('boot-screen')) {
                maxVisibility = Infinity;
                mostVisible = section;
                return;
            }

            // For section selection: prioritize sections that start near the top of viewport
            // A section is "active" if its top is within the upper portion of the viewport
            const topProximity = Math.max(0, 300 - Math.abs(sectionTop));
            const visibility = visibleHeight * (1 + topProximity / 100);

            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisible = section;
            }
        });

        if (mostVisible && maxVisibility > 0) {
            const sectionId = mostVisible.id || (mostVisible.classList.contains('boot-screen') ? 'home' : '');
            const pathMap = {
                'home': '/',
                'problem': '/the_problem',
                'capabilities': '/capabilities',
                'about': '/about',
                'contact': '/contact'
            };
            const path = pathMap[sectionId];

            if (path) {
                // Update URL
                try {
                    if (window.location.pathname !== path) {
                        history.replaceState(null, '', path);
                    }
                } catch (e) {
                    console.error('Cannot update URL (file:// protocol?):', e);
                }

                // Update menu - only if not on home
                if (path !== '/') {
                    const activeLink = document.querySelector(`nav a[href="${path}"]`);
                    if (activeLink) {
                        menuItems.forEach(item => item.classList.remove('selected'));
                        activeLink.classList.add('selected');
                        currentMenuIndex = Array.from(menuItems).indexOf(activeLink);
                    }
                } else {
                    // Clear selection when on home
                    menuItems.forEach(item => item.classList.remove('selected'));
                }
            }
        }
    }, 100); // 100ms debounce
}, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
});

// Observe all sections using cached elements
cachedSections.forEach(section => sectionObserver.observe(section));

// Map paths to section IDs
const pathToSection = {
    '/': 'home',
    '/the_problem': 'problem',
    '/capabilities': 'capabilities',
    '/about': 'about',
    '/contact': 'contact'
};

function scrollToPath(path) {
    const sectionId = pathToSection[path];
    if (sectionId) {
        const target = sectionId === 'home' ? document.querySelector('.boot-screen') : document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Smooth scrolling for navigation links with history state
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Don't do anything if this is already the selected item
        if (this.classList.contains('selected')) {
            return;
        }

        const path = this.getAttribute('href');

        // Disable scroll detection temporarily
        isScrolling = true;

        // Immediately update the selected state
        if (path !== '/') {
            menuItems.forEach(item => item.classList.remove('selected'));
            this.classList.add('selected');
            currentMenuIndex = Array.from(menuItems).indexOf(this);
        } else {
            // Clear selection when going to home
            menuItems.forEach(item => item.classList.remove('selected'));
        }

        scrollToPath(path);

        // Update URL without reloading page
        history.pushState(null, '', path);

        // Re-enable scroll detection after scroll finishes
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });
});

// Make logo links work the same way
document.querySelectorAll('.logo-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        isScrolling = true;
        scrollToPath('/');
        history.pushState(null, '', '/');
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    const path = window.location.pathname;
    scrollToPath(path);
});

// Handle initial page load with path
window.addEventListener('load', function() {
    // Handle hashbang redirect from 404.html
    var hash = window.location.hash;
    if (hash && hash.indexOf('#!') === 0) {
        // Extract the path from hashbang
        var path = hash.substring(2); // Remove '#!'
        // Replace hashbang URL with clean URL
        history.replaceState(null, '', path || '/');
        // Scroll to the section
        if (path && path !== '/') {
            scrollToPath(path);
        }
    } else {
        // Normal page load - check if we have a path
        const path = window.location.pathname;
        if (path !== '/') {
            scrollToPath(path);
        }
    }
});
