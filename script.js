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
}
