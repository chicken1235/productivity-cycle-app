// script.js

// --- Global UI Utility Functions ---
// Function to hide all main content sections by adding the 'hidden' class
function hideAllSections() {
    document.querySelectorAll('main section.container').forEach(section => {
        section.classList.add('hidden');
    });
}

// Function to show a specific section, update active nav button, and optionally scroll to it
function showAndScrollToSection(sectionId, smoothScroll = true) {
    hideAllSections(); // Hide all other sections first

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden'); // Make the target section visible

        // Update active state for navigation buttons
        document.querySelectorAll('.main-nav .nav-btn').forEach(btn => {
            if (btn.getAttribute('aria-controls') === sectionId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const scrollBehavior = smoothScroll ? 'smooth' : 'auto';

        requestAnimationFrame(() => {
            targetSection.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
        });

        if (history.pushState) {
            history.pushState(null, '', `#${sectionId}`);
        } else {
            window.location.hash = sectionId;
        }
    } else {
        console.warn(`Attempted to show non-existent section: '${sectionId}'`);
    }
}

// --- Calendar Initialization ---
// Populates the calendar grid with days of the current month
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

    // Add day names row
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(dayName => {
        const dayNameEl = document.createElement('div');
        dayNameEl.classList.add('calendar-day-name'); // Add a specific class for styling
        dayNameEl.textContent = dayName;
        calendarGrid.appendChild(dayNameEl);
    });


    // Add empty divs for padding
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

        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        dayEl.addEventListener('click', () => selectCalendarDay(i, currentMonth, currentYear));
        calendarGrid.appendChild(dayEl);
    }

    function selectCalendarDay(day, month, year) {
        console.log(`Selected date: ${month + 1}/${day}/${year}`);
        // This is where you could trigger an action, e.g., open a journal entry form for this date.
        // For now, it just logs to the console.
    }
}

// --- Main Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate Manager Classes
    const trackManager = new TrackManager();
    const journalManager = new JournalManager();
    const resourceManager = new ResourceManager();
    const settingsManager = new SettingsManager();
    const quizManager = new QuizManager();

    // 2. Initial Content Rendering
    // Call the 'render' method on each manager to set up their initial HTML and event listeners.
    trackManager.render();
    journalManager.render();
    resourceManager.render();
    settingsManager.render();
    quizManager.render();
    initializeCalendar(); // Initialize calendar after it's rendered

    // 3. Set Up Navigation Event Listeners
    document.querySelectorAll('.main-nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.getAttribute('aria-controls');
            showAndScrollToSection(targetSectionId);
        });
    });

    // Event delegation for footer Quick Links
    document.querySelector('.footer-content').addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.closest('.footer-section ul li')) {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                const sectionId = href.substring(1);
                showAndScrollToSection(sectionId);
            }
        }
    });

    // 4. Initial Page Load Display & Theme Application
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings && savedSettings.theme) {
        document.documentElement.setAttribute('data-theme', savedSettings.theme);
    } else {
        document.documentElement.setAttribute('data-theme', 'pink'); // Default theme
    }

    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'journal-section';
    showAndScrollToSection(initialSectionId, false); // No smooth scroll on initial load

    // Update header cycle day/phase display if data is present in local storage
    const storedCycleDay = localStorage.getItem('currentCycleDay');
    const storedCyclePhase = localStorage.getItem('currentCyclePhase');
    if (storedCycleDay && storedCyclePhase) {
        document.getElementById('cycleDay').textContent = storedCycleDay;
        document.getElementById('currentPhase').textContent = storedCyclePhase;
    }
});
