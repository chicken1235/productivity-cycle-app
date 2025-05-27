// script.js

// Global function to show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Event Listeners for Navigation Buttons
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Managers
    const trackManager = new TrackManager();
    const journalManager = new JournalManager(); // Ensure journal.js is loaded
    const resourceManager = new ResourceManager(); // Ensure resources.js is loaded
    const settingsManager = new SettingsManager(); // Ensure settings.js is loaded

    // Navigation buttons
    document.getElementById('trackBtn').addEventListener('click', () => {
        showSection('symptom-tracker'); // Show symptom tracker or a main dashboard
        // If you want a more complex "Track" view, you might need a new section ID and content
    });
    document.getElementById('journalBtn').addEventListener('click', () => showSection('journal-section'));
    document.getElementById('resourcesBtn').addEventListener('click', () => showSection('resources-section'));
    document.getElementById('settingsBtn').addEventListener('click', () => showSection('settings-section'));

    // Initial view: Show the product/journal section by default or a dashboard
    showSection('journal-section'); // Or 'symptom-tracker', or a new 'dashboard-section'

    // Initialize the calendar view (assuming it's part of the main tracking)
    // You might want to move calendar initialization into TrackManager or a dedicated CalendarManager
    initializeCalendar();

    // Apply saved theme on load
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings && savedSettings.theme) {
        document.documentElement.setAttribute('data-theme', savedSettings.theme);
    } else {
        // Fallback to default theme if no settings are saved
        document.documentElement.setAttribute('data-theme', 'pink');
    }
});


// Calendar functionality - keeping it global for now, but could be integrated into TrackManager
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
        // showSection('journal-section');
    }
    // Ensure all manager classes are available globally if they are instantiated in script.js
// If your manager classes are not global (e.g., in an IIFE), you might need to adjust their instantiation.

// --- Manager Instantiation (from your previous setup) ---
const trackManager = new TrackManager();
const journalManager = new JournalManager();
const resourceManager = new ResourceManager();
const settingsManager = new SettingsManager();

// --- Core UI Logic for Section Management ---

const sections = document.querySelectorAll('main section.container');
const navButtons = document.querySelectorAll('.main-nav .nav-btn');
const quickLinks = document.querySelectorAll('.footer-section ul li a'); // Select quick links

function hideAllSections() {
    sections.forEach(section => {
        section.classList.add('hidden');
    });
}

function showSection(sectionId) {
    hideAllSections();
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        // Optional: Scroll to the section for immediate visibility if not smooth scrolling via CSS
        // targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// --- Event Listeners for Nav Buttons ---
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSectionId = button.getAttribute('aria-controls');
        showSection(targetSectionId);
        // If you want to also scroll to the top of the section after showing it:
        document.getElementById(targetSectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// --- Event Listeners for Quick Links (Footer) ---
quickLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        // Prevent default anchor jump for a moment, so we can manage display and scroll
        event.preventDefault();

        const targetId = link.getAttribute('href').substring(1); // Get the ID from href (e.g., "quiz-section")
        showSection(targetId); // Show the linked section

        // After showing, then smoothly scroll to it.
        // Use requestAnimationFrame for smoother behavior, ensuring section is rendered before scroll
        requestAnimationFrame(() => {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});


// --- Initial Page Load Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Determine which section to show initially
    // You can set a default or check for a hash in the URL (e.g., yoursite.com/#journal-section)
    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'journal-section'; // Default to journal-section or whatever you prefer

    // Initialize manager content for the default/initial section to be displayed
    // It's good practice to ensure the managers are initialized for the first visible section
    // before attempting to show it.
    if (initialSectionId === 'symptom-tracker') trackManager.init();
    if (initialSectionId === 'journal-section') journalManager.init(); // Assuming init populates content
    if (initialSectionId === 'resources-section') resourceManager.init();
    if (initialSectionId === 'settings-section') settingsManager.init();
    if (initialSectionId === 'quiz-section') {
        // If you have a QuizManager, initialize it here
        // quizManager.init();
    }


    showSection(initialSectionId); // Show the initial section

    // Optionally, if the URL has a hash on load, scroll to it smoothly
    if (window.location.hash) {
        requestAnimationFrame(() => {
            const targetElement = document.getElementById(window.location.hash.substring(1));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});

}
