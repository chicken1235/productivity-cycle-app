// script.js

// ... (existing global functions like hideAllSections, showAndScrollToSection, initializeCalendar) ...

// --- Main Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate Manager Classes
    const trackManager = new TrackManager();
    const journalManager = new JournalManager();
    const resourceManager = new ResourceManager();
    const settingsManager = new SettingsManager();
    const quizManager = new QuizManager(); // <-- INSTANTIATE QUIZMANAGER HERE

    // 2. Call 'render' methods for each manager to populate their respective sections.
    trackManager.render();
    journalManager.render();
    resourceManager.render();
    settingsManager.render();
    quizManager.render(); // <-- CALL RENDER FOR QUIZMANAGER

    // 3. Initialize Calendar
    initializeCalendar();

    // 4. Set Up Navigation Event Listeners

    // Main Navigation Buttons
    document.querySelectorAll('.main-nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.getAttribute('aria-controls');
            showAndScrollToSection(targetSectionId);
        });
    });

    // Add event listener for the Quiz button if you have one in the nav, or rely on footer link
    // Assuming you'll update 'trackBtn' or add a new button in nav for the quiz.
    // If you have a specific button for the Quiz in your main nav:
    // document.getElementById('quizNavBtn').addEventListener('click', () => {
    //     showAndScrollToSection('quiz-section');
    // });


    // Footer Quick Links (using event delegation on the footer-content for efficiency)
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

    // 5. Initial Page Load Section Display & Theme Application

    // Apply saved theme on load
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings && savedSettings.theme) {
        document.documentElement.setAttribute('data-theme', savedSettings.theme);
    } else {
        document.documentElement.setAttribute('data-theme', 'pink');
    }

    // Determine which section to show on initial load
    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'journal-section';

    // Show the determined initial section
    showAndScrollToSection(initialSectionId, false);

    // Optional: Load and update cycle day/phase display on header if data exists
    const storedCycleDay = localStorage.getItem('currentCycleDay');
    const storedCyclePhase = localStorage.getItem('currentCyclePhase');
    if (storedCycleDay && storedCyclePhase) {
        document.getElementById('cycleDay').textContent = storedCycleDay;
        document.getElementById('currentPhase').textContent = storedCyclePhase;
    }
});

