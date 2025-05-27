// Add these new features to the existing script.js

// Symptom tracking data
const symptoms = {
    physical: [
        "Cramps", "Headache", "Bloating", "Breast tenderness",
        "Acne", "Fatigue", "Back pain", "Joint pain"
    ],
    emotional: [
        "Anxiety", "Mood swings", "Irritability", "Depression",
        "Emotional sensitivity", "Stress", "Calmness", "Joy"
    ]
};

// Initialize symptom tracker
function initializeSymptomTracker() {
    const physicalChecks = document.querySelector('.symptom-category:nth-child(1) .symptom-checks');
    const emotionalChecks = document.querySelector('.symptom-category:nth-child(2) .symptom-checks');

    symptoms.physical.forEach(symptom => {
        physicalChecks.innerHTML += createSymptomCheckbox(symptom);
    });

    symptoms.emotional.forEach(symptom => {
        emotionalChecks.innerHTML += createSymptomCheckbox(symptom);
    });
}

function createSymptomCheckbox(symptom) {
    return `
        <div class="symptom-check">
            <input type="checkbox" id="${symptom.toLowerCase()}" name="symptom">
            <label for="${symptom.toLowerCase()}">${symptom}</label>
        </div>
    `;
}

// Journal functionality
function initializeJournal() {
    const journalBtn = document.getElementById('journalBtn');
    const saveJournalBtn = document.getElementById('saveJournal');
    const moodIcons = document.querySelectorAll('.mood-icon');

    journalBtn.addEventListener('click', () => showSection('journal-section'));
    saveJournalBtn.addEventListener('click', saveJournalEntry);
    moodIcons.forEach(icon => {
        icon.addEventListener('click', selectMood);
    });
}

function saveJournalEntry() {
    const date = document.getElementById('entryDate').value;
    const text = document.getElementById('journalText').value;
    const selectedMood = document.querySelector('.mood-icon.selected')?.dataset.mood;

    if (!date || !text) {
        alert('Please fill in both date and journal entry.');
        return;
    }

    const entry = { date, text, mood: selectedMood };
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    entries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    updateJournalHistory();
    clearJournalForm();
}

// Calendar functionality
function initializeCalendar() {
    const calendar = document.getElementById('calendar-grid');
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = i;
        dayEl.addEventListener('click', () => selectCalendarDay(i));
        calendar.appendChild(dayEl);
    }
}

// Settings functionality
function initializeSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettings');

    settingsBtn.addEventListener('click', () => showSection('settings-section'));
    saveSettingsBtn.addEventListener('click', saveSettings);

    // Load saved settings
    loadSettings();
}

function saveSettings() {
    const settings = {
        cycleLength: document.getElementById('cycleLength').value,
        notifications: document.getElementById('notifications').checked,
        theme: document.getElementById('theme').value
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    applyTheme(settings.theme);
    alert('Settings saved successfully!');
}

// Theme functionality
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeSymptomTracker();
    initializeJournal();
    initializeCalendar();
    initializeSettings();
});

