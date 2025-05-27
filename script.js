// script.js

// --- Global UI Utility Functions ---

// Function to hide all main content sections
function hideAllSections() {
    document.querySelectorAll('main section.container').forEach(section => {
        section.classList.add('hidden');
    });
}

// Function to show a specific section and optionally scroll to it
function showAndScrollToSection(sectionId, smoothScroll = true) {
    hideAllSections(); // Hide all other sections first

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden'); // Make the target section visible

        if (smoothScroll) {
            // Use requestAnimationFrame for smoother scrolling, ensuring the element is visible in the DOM
            requestAnimationFrame(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        } else {
            // For instant jump if preferred
            targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }

        // Optionally update the URL hash
        if (history.pushState) {
            history.pushState(null, '', `#${sectionId}`);
        } else {
            window.location.hash = sectionId; // Fallback for older browsers
        }
    } else {
        console.warn(`Section with ID '${sectionId}' not found.`);
    }
}

// --- Calendar Initialization (remains a global function) ---
function initializeCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        console.warn("Calendar grid element not found. Skipping calendar initialization.");
        return;
    }

    calendarGrid.innerHTML = ''; // Clear previous content

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    // Get number of days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Add empty divs for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = i;
        dayEl.setAttribute('data-day', i);

        // Highlight today's date
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        // Add event listener (example: to select a day for tracking)
        dayEl.addEventListener('click', () => selectCalendarDay(i, currentMonth, currentYear));
        calendarGrid.appendChild(dayEl);
    }

    // Placeholder for selecting a day (you'd integrate this with TrackManager or JournalManager)
    function selectCalendarDay(day, month, year) {
        console.log(`Selected date: ${month + 1}/${day}/${year}`);
        // Here you would typically trigger a form to add a symptom or journal entry for this date
        // For example, you could pre-fill the journal date input:
        // document.getElementById('journal-date').value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // showAndScrollToSection('journal-section'); // Go to journal section to input
    }
}


// --- Main Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate Manager Classes
    // These lines assume your manager classes (TrackManager, JournalManager, etc.)
    // are defined in their respective .js files and are accessible globally.
    const trackManager = new TrackManager();
    const journalManager = new JournalManager();
    const resourceManager = new ResourceManager();
    const settingsManager = new SettingsManager();

    // 2. Call 'render' methods for each manager to populate their respective sections.
    // This is crucial to ensure content is present before showing/scrolling.
    trackManager.render();
    journalManager.render();
    resourceManager.render();
    settingsManager.render();

    // 3. Initialize Calendar (if it's always present regardless of section)
    initializeCalendar();

    // 4. Set Up Navigation Event Listeners

    // Main Navigation Buttons
    // Use 'aria-controls' attribute to get target section ID
    document.querySelectorAll('.main-nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.getAttribute('aria-controls');
            showAndScrollToSection(targetSectionId);
        });
    });

    // Footer Quick Links (using event delegation on the footer-content for efficiency)
    document.querySelector('.footer-content').addEventListener('click', (event) => {
        // Check if the clicked element is an anchor link within the quick links list
        if (event.target.tagName === 'A' && event.target.closest('.footer-section ul li')) {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault(); // Prevent default browser jump
                const sectionId = href.substring(1); // Get the ID without '#'
                showAndScrollToSection(sectionId);
            }
        }
    });

    // 5. Initial Page Load Section Display & Theme Application

    // Apply saved theme on load before showing any sections
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings && savedSettings.theme) {
        document.documentElement.setAttribute('data-theme', savedSettings.theme);
    } else {
        // Fallback to default theme if no settings are saved
        document.documentElement.setAttribute('data-theme', 'pink');
    }

    // Determine which section to show on initial load (from URL hash or default)
    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'journal-section'; // Default to journal-section

    // Show the determined initial section (no smooth scroll on initial load for direct access)
    showAndScrollToSection(initialSectionId, false);
});
