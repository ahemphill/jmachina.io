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
    line2: 500,       // "Stealth is over."
    line3: 2000,     // "Intelligence requires power."
    line4: 3500,    // Highlighted line with cursor

    // Cursor movement delays - add blink time at line-4 before moving
    cursorBlinkAtLine4: 6500,  // Blink 3 times at end of line-4 (3 cycles at 500ms each = 1500ms)
    cursorMoveLine5: 6500,     // Move to empty line 5
    cursorMoveLine6: 6700,     // Move to empty line 6
    cursorMoveLine7: 6900,     // Move to empty line 7
    cursorMoveLine8: 7100,     // Move to empty line 8

    // Typing animation
    typingStart: 7100,         // When typing "jmachina.io" begins (no jump, starts right away)
    typingSpeed: 150,          // Milliseconds per character

    // Calculated: logo typing end = typingStart + (11 chars * typingSpeed)
    // = 7100 + (11 * 150) = 7100 + 1650 = 8750
    // Blink cycles (3 cycles at 1000ms each) = 3000ms
    // Navigation animation starts at 8750 + 3000 = 11750ms
    navAnimationStart: 11750,  // Start revealing nav menu
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
const cursorLine7 = document.getElementById('cursor-line7');
const cursorLine8 = document.getElementById('cursor-line8');
const logoCursor = document.getElementById('logo-cursor');

// Track if animation is complete
let bootAnimationComplete = false;

// Function to skip to final state
function completeBootAnimation() {
    if (bootAnimationComplete) return;
    bootAnimationComplete = true;

    // Fade in all boot text smoothly
    document.querySelectorAll('.boot-text').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '1';
    });

    // Hide all cursors
    edgeCursor.style.display = 'none';
    cursorLine5.style.display = 'none';
    cursorLine6.style.display = 'none';
    cursorLine7.style.display = 'none';
    cursorLine8.style.display = 'none';
    logoCursor.style.display = 'none';

    // Hide all navigation cursors
    document.querySelectorAll('.nav-cursor').forEach(cursor => {
        cursor.style.display = 'none';
    });

    // Complete logo typing with fade
    logoText.textContent = "jmachina.io";

    // Fade in all nav items
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'opacity 0.2s ease';
            item.classList.add('visible-nav-item');
        }, index * 50); // Stagger by 50ms each
    });

    // Reveal all content sections when animation is skipped
    document.querySelectorAll('.reveal').forEach(element => {
        element.classList.add('active');
    });
}

// Detect scroll during animation - immediate response
window.addEventListener('scroll', function() {
    if (!bootAnimationComplete && window.scrollY > 10) {
        completeBootAnimation();
    }
}, { passive: true });

// Keep cursor at line-4 blinking for a moment, then move to line-5
setTimeout(() => {
    if (bootAnimationComplete) return;
    edgeCursor.style.display = 'none';
    cursorLine5.classList.add('visible');
    document.querySelector('.boot-text.line-5').style.opacity = '1';
}, BOOT_TIMING.cursorMoveLine5);

// Move to line-6
setTimeout(() => {
    if (bootAnimationComplete) return;
    cursorLine5.style.display = 'none';
    cursorLine6.classList.add('visible');
    document.querySelector('.boot-text.line-6').style.opacity = '1';
}, BOOT_TIMING.cursorMoveLine6);

// Move to line-7
setTimeout(() => {
    if (bootAnimationComplete) return;
    cursorLine6.style.display = 'none';
    cursorLine7.classList.add('visible');
    document.querySelector('.boot-text.line-7').style.opacity = '1';
}, BOOT_TIMING.cursorMoveLine7);

// Move to line-8 and start typing immediately (no separate logo line movement)
setTimeout(() => {
    if (bootAnimationComplete) return;
    cursorLine7.style.display = 'none';
    cursorLine8.classList.add('visible');
    document.querySelector('.boot-text.line-8').style.opacity = '1';
}, BOOT_TIMING.cursorMoveLine8);

// Start typing the logo immediately after reaching line-8
setTimeout(() => {
    if (bootAnimationComplete) return;
    // Hide line-8 cursor, show logo cursor
    cursorLine8.style.display = 'none';
    logoCursor.style.display = 'inline-block';
    const text = "jmachina.io";
    let charIndex = 0;

    // Stop blinking during typing - make cursor solid
    logoCursor.style.animation = 'none';
    logoCursor.style.opacity = '1';

    function typeCharacter() {
        if (bootAnimationComplete) return;
        if (charIndex < text.length) {
            logoText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, BOOT_TIMING.typingSpeed);
        } else {
            // Resume blinking after typing is done - blink for 3 cycles before nav reveals
            // Clear inline opacity so animation can control it
            logoCursor.style.opacity = '';
            // Force a reflow to restart the animation
            logoCursor.style.animation = 'none';
            void logoCursor.offsetWidth; // Trigger reflow
            logoCursor.style.animation = 'blink 1s step-end infinite';
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
    logoCursor.style.display = 'none';

    // Animate through each menu item
    let currentNavItem = 0;

    function revealNextNavItem() {
        if (bootAnimationComplete) return;
        if (currentNavItem < navItems.length) {
            // Make the current nav item visible
            navItems[currentNavItem].classList.add('visible-nav-item');

            // Show cursor next to the current item
            navCursors[currentNavItem].style.display = 'inline-block';
            navCursors[currentNavItem].style.opacity = '1';
            navCursors[currentNavItem].style.animation = 'blink 1s step-end infinite';

            // Move to next item after delay
            setTimeout(() => {
                if (bootAnimationComplete) return;

                currentNavItem++;

                if (currentNavItem < navItems.length) {
                    // Hide current cursor completely
                    navCursors[currentNavItem - 1].style.display = 'none';
                    // Continue to next item
                    setTimeout(revealNextNavItem, BOOT_TIMING.navItemDelay);
                } else {
                    // This is the last item (contact) - blink a few times before hiding
                    const lastCursor = navCursors[currentNavItem - 1];
                    // Let it blink for 3.5 seconds to ensure we end on a visible phase
                    // This gives 3 full cycles plus ending on visible
                    setTimeout(() => {
                        if (bootAnimationComplete) return;
                        lastCursor.style.display = 'none';
                        // Mark animation as complete when all nav items are revealed
                        bootAnimationComplete = true;

                        // Reveal all content sections after boot animation completes
                        document.querySelectorAll('.reveal').forEach(element => {
                            element.classList.add('active');
                        });
                    }, 3500);
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

// Scroll reveal animations
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Detect when nav becomes sticky and add border animation
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    const navRect = nav.getBoundingClientRect();

    // Nav is stuck when it's at or near the top of the viewport
    if (navRect.top <= 1) {
        nav.classList.add('stuck');
    } else {
        nav.classList.remove('stuck');
    }
});

// Update menu selection and URL based on scroll position
let isScrolling = false;
let updateTimeout = null;

const sectionObserver = new IntersectionObserver((entries) => {
    if (isScrolling) return;

    // Debounce updates to prevent flickering
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(() => {
        // Get all observed sections and find the most visible one
        const sections = [
            document.querySelector('.boot-screen'),
            document.getElementById('about'),
            document.getElementById('problem'),
            document.getElementById('capabilities'),
            document.getElementById('contact')
        ];

        let mostVisible = null;
        let maxVisibility = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate how much of the section is in the viewport center area
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const visibleTop = Math.max(sectionTop, 0);
            const visibleBottom = Math.min(sectionBottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            // Prioritize sections near the center of viewport
            const centerDistance = Math.abs((sectionTop + sectionBottom) / 2 - viewportHeight / 2);
            const visibility = visibleHeight / (1 + centerDistance / 100);

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

// Observe all sections
sectionObserver.observe(document.querySelector('.boot-screen'));
sectionObserver.observe(document.getElementById('about'));
sectionObserver.observe(document.getElementById('problem'));
sectionObserver.observe(document.getElementById('capabilities'));
sectionObserver.observe(document.getElementById('contact'));

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
