// script.js

// --- Global UI Utility Functions ---

/**
 * Hides all main content sections by adding the 'hidden' class.
 */
function hideAllSections() {
    document.querySelectorAll('main section.container').forEach(section => {
        section.classList.add('hidden');
    });
}

/**
 * Shows a specific section, updates the active navigation button, and optionally scrolls to it.
 * @param {string} sectionId - The ID of the section to show (e.g., 'journal-section').
 * @param {boolean} [smoothScroll=true] - Whether to use smooth scrolling. Defaults to true.
 */
function showAndScrollToSection(sectionId, smoothScroll = true) {
    hideAllSections(); // Ensure all other sections are hidden first

    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.warn(`Attempted to show non-existent section: '${sectionId}'`);
        return; // Exit if the target section isn't found
    }

    targetSection.classList.remove('hidden'); // Make the target section visible

    // Update active state for navigation buttons
    document.querySelectorAll('.main-nav .nav-btn').forEach(btn => {
        if (btn.getAttribute('aria-controls') === sectionId) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page'); // Indicate current page for accessibility
        } else {
            btn.classList.remove('active');
            btn.removeAttribute('aria-current');
        }
    });

    const scrollBehavior = smoothScroll ? 'smooth' : 'auto';

    // Use requestAnimationFrame for smoother rendering before scrolling
    requestAnimationFrame(() => {
        targetSection.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    });

    // Update URL hash for direct linking and browser history
    if (history.pushState) {
        history.pushState(null, '', `#${sectionId}`);
    } else {
        window.location.hash = sectionId;
    }
}

// --- Calendar Initialization ---

/**
 * Populates the calendar grid with days of the current month and adds interactivity.
 */
function initializeCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        console.warn("Calendar grid element not found. Skipping calendar initialization.");
        return;
    }

    calendarGrid.innerHTML = ''; // Clear any existing content

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed month

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    // Add day names row (e.g., Sun, Mon, Tue)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(dayName => {
        const dayNameEl = document.createElement('div');
        dayNameEl.classList.add('calendar-day-name'); // Specific class for styling day headers
        dayNameEl.textContent = dayName;
        calendarGrid.appendChild(dayNameEl);
    });

    // Add empty divs for padding before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty'); // Add 'empty' class for distinct styling
        calendarGrid.appendChild(emptyDay);
    }

    // Populate days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = i.toString(); // Ensure textContent is a string
        dayEl.setAttribute('data-day', i.toString()); // Ensure data-day is a string

        // Highlight today's date
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        // Add click listener to each day
        dayEl.addEventListener('click', () => selectCalendarDay(i, currentMonth, currentYear));
        calendarGrid.appendChild(dayEl);
    }

    /**
     * Handles the click event for a calendar day.
     * @param {number} day - The day number.
     * @param {number} month - The 0-indexed month number.
     * @param {number} year - The full year number.
     */
    function selectCalendarDay(day, month, year) {
        const selectedDate = new Date(year, month, day);
        console.log(`Selected date: ${selectedDate.toLocaleDateString('en-US')}`); // Format date consistently
        // Future: This is where you would likely trigger a modal or redirect
        // to a journal entry form pre-filled with this date.
        // For example: journalManager.openEntryForDate(year, month, day);
    }
}

// --- Main Application Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate Manager Classes
    // Ensure these classes (TrackManager, JournalManager, etc.) are defined
    // either in this file or imported from other script files before this point.
    const trackManager = new TrackManager();
    const journalManager = new JournalManager();
    const resourceManager = new ResourceManager();
    const settingsManager = new SettingsManager();
    const quizManager = new QuizManager();

    // 2. Initial Content Rendering
    // Call the 'render' method on each manager to set up their initial HTML and event listeners.
    // The settingsManager.render() should handle loading saved themes and applying them.
    settingsManager.render(); // Render settings first, as it affects global theme
    trackManager.render();
    journalManager.render();
    resourceManager.render();
    quizManager.render();
    initializeCalendar(); // Initialize calendar after its container is rendered

    // 3. Set Up Global Event Listeners

    // Navigation buttons in the header
    document.querySelectorAll('.main-nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.getAttribute('aria-controls');
            showAndScrollToSection(targetSectionId);
        });
    });

    // Event delegation for footer Quick Links (ensures only 'a' tags within specific list items are targeted)
    document.querySelector('.footer-content')?.addEventListener('click', (event) => {
        const clickedLink = event.target.closest('.footer-section ul li a');
        if (clickedLink) {
            const href = clickedLink.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault(); // Prevent default anchor jump
                const sectionId = href.substring(1); // Remove the '#'
                showAndScrollToSection(sectionId);
            }
        }
    });

    // 4. Handle Initial Page Load & Theme Application
    // The settingsManager.render() now exclusively handles loading and applying the theme.
    // This part ensures the correct initial view based on URL hash or a default.
    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'journal-section';
    showAndScrollToSection(initialSectionId, false); // No smooth scroll on initial load for faster display

    // 5. Update Header Cycle Day/Phase Display
    // It's generally best practice for the TrackManager or QuizManager to update these directly
    // after their calculations or data saves. However, for initial load, we fetch from localStorage.
    const cycleDayElement = document.getElementById('cycleDay');
    const currentPhaseElement = document.getElementById('currentPhase');

    if (cycleDayElement && currentPhaseElement) {
        const storedCycleDay = localStorage.getItem('currentCycleDay');
        const storedCyclePhase = localStorage.getItem('currentCyclePhase');

        if (storedCycleDay) {
            cycleDayElement.textContent = storedCycleDay;
        }
        if (storedCyclePhase) {
            currentPhaseElement.textContent = storedCyclePhase;
        }
    } else {
        console.warn("Cycle day or current phase display elements not found in the header.");
    }
});
