// script.js

// --- Global UI Utility Functions ---
// Function to hide all main content sections by adding the 'hidden' class
function hideAllSections() {
    document.querySelectorAll('main section.container').forEach(section => {
        section.classList.add('hidden');
    });
}

// Function to show a specific section and optionally scroll to it
// Smooth scrolling can be enabled/disabled via the 'smoothScroll' parameter
function showAndScrollToSection(sectionId, smoothScroll = true) {
    hideAllSections(); // Hide all other sections first

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden'); // Make the target section visible

        // Determine scroll behavior based on 'smoothScroll' flag
        const scrollBehavior = smoothScroll ? 'smooth' : 'auto';

        // Use requestAnimationFrame for smoother scrolling, ensuring the element is rendered before scroll
        requestAnimationFrame(() => {
            targetSection.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
        });

        // Update the URL hash to reflect the current section, enabling direct linking and browser history
        if (history.pushState) {
            history.pushState(null, '', `#${sectionId}`);
        } else {
            window.location.hash = sectionId; // Fallback for older browsers if pushState isn't available
        }
    } else {
        console.warn(`Attempted to show non-existent section: '${sectionId}'`);
    }
}

// --- Calendar Initialization (remains a global function for now) ---
// Populates the calendar grid with days of the current month
function initializeCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        // Log a warning if the calendar grid isn't found, but don't stop execution
        console.warn("Calendar grid element not found. Skipping calendar initialization.");
        return;
    }

    calendarGrid.innerHTML = ''; // Clear any existing content to prevent duplicates on re-render

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed month

    // Calculate days in the current month and the weekday of the first day
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    // Add empty divs to pad the calendar grid before the 1st day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(emptyDay);
    }

    // Populate days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = i;
        dayEl.setAttribute('data-day', i);

        // Highlight today's date for visual emphasis
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        // Attach a click listener to each day for potential future functionality (e.g., logging entries)
        dayEl.addEventListener('click', () => selectCalendarDay(i, currentMonth, currentYear));
        calendarGrid.appendChild(dayEl);
    }

    // Placeholder function for handling a selected calendar day
    // This could be extended to open a form, display data for the day, etc.
    function selectCalendarDay(day, month, year) {
        console.log(`Selected date: ${month + 1}/${day}/${year}`);
        // Example: You might want to pre-fill a journal entry form for this date
        // showAndScrollToSection('journal-section');
    }
}

// --- Main Application Initialization ---
// Ensures all DOM content is loaded before running the main application logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate Manager Classes
    // These managers encapsulate the logic and rendering for their respective sections.
    // Ensure their JS files are loaded BEFORE this script.
    const trackManager = new TrackManager();
    const journalManager = new JournalManager();
    const resourceManager = new ResourceManager();
    const settingsManager = new SettingsManager();
    const quizManager = new QuizManager();

    // 2. Initial Content Rendering
    // Call the 'render' method on each manager to set up their initial HTML and event listeners.
    // This is crucial for content to exist before sections are displayed or scrolled.
    trackManager.render();
    journalManager.render();
    resourceManager.render();
    settingsManager.render();
    quizManager.render();
    initializeCalendar(); // Initialize calendar after it's rendered, potentially by trackManager

    // 3. Set Up Navigation Event Listeners
    // Attaching listeners to the main navigation buttons
    document.querySelectorAll('.main-nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.getAttribute('aria-controls');
            showAndScrollToSection(targetSectionId);
        });
    });

    // Using event delegation for footer Quick Links for efficiency and robustness
    document.querySelector('.footer-content').addEventListener('click', (event) => {
        // Check if the clicked element is an anchor tag within a footer quick link list item
        if (event.target.tagName === 'A' && event.target.closest('.footer-section ul li')) {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault(); // Prevent default browser navigation behavior
                const sectionId = href.substring(1); // Extract the section ID from the href
                showAndScrollToSection(sectionId);
            }
        }
    });

    // 4. Initial Page Load Display & Theme Application
    // Apply user's saved theme preferences on page load
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings && savedSettings.theme) {
        document.documentElement.setAttribute('data-theme', savedSettings.theme);
    } else {
        document.documentElement.setAttribute('data-theme', 'pink'); // Default theme if none saved
    }

    // Determine which section to display initially based on URL hash or a default
    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'journal-section';

    // Display the initial section. No smooth scroll needed for direct page loads.
    showAndScrollToSection(initialSectionId, false);

    // Update header cycle day/phase display if data is present in local storage
    const storedCycleDay = localStorage.getItem('currentCycleDay');
    const storedCyclePhase = localStorage.getItem('currentCyclePhase');
    if (storedCycleDay && storedCyclePhase) {
        document.getElementById('cycleDay').textContent = storedCycleDay;
        document.getElementById('currentPhase').textContent = storedCyclePhase;
    }
});
