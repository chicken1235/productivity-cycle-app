class SettingsManager {
    constructor() {
        this.defaultSettings = {
            cycleLength: 28,
            periodLength: 5,
            notifications: true,
            theme: 'pink',
            language: 'en',
            reminders: {
                period: true,
                ovulation: true,
                symptoms: true
            }
        };
        this.initializeSettings();
    }

    initializeSettings() {
        this.loadSettings();
        this.setupEventListeners();
    }

    loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || this.defaultSettings;
        this.populateSettingsForm(savedSettings);
        this.applySettings(savedSettings);
    }

    populateSettingsForm(settings) {
        document.getElementById('cycle-length').value = settings.cycleLength;
        document.getElementById('period-length').value = settings.periodLength;
        document.getElementById('notifications').checked = settings.notifications;
        document.getElementById('theme-selector').value = settings.theme;
        document.getElementById('language-selector').value = settings.language;
        
        // Reminders
        Object.keys(settings.reminders).forEach(reminder => {
            document.getElementById(`reminder-${reminder}`).checked = settings.reminders[reminder];
        });
    }

    setupEventListeners() {
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('reset-settings').addEventListener('click', () => this.resetSettings());
        document.getElementById('theme-selector').addEventListener('change', (e) => this.updateTheme(e.target.value));
    }

    saveSettings() {
        const settings = {
            cycleLength: parseInt(document.getElementById('cycle-length').value),
            periodLength: parseInt(document.getElementById('period-length').value),
            notifications: document.getElementById('notifications').checked,
            theme: document.getElementById('theme-selector').value,
            language: document.getElementById('language-selector').value,
            reminders: {
                period: document.getElementById('reminder-period').checked,
                ovulation: document.getElementById('reminder-ovulation').checked,
                symptoms: document.getElementById('reminder-symptoms').checked
            }
        };

        localStorage.setItem('userSettings', JSON.stringify(settings));
        this.applySettings(settings);
        this.showSaveConfirmation();
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            localStorage.removeItem('userSettings');
            this.loadSettings();
        }
    }

    applySettings(settings) {
        this.updateTheme(settings.theme);
        if (settings.notifications) {
            this.requestNotificationPermission();
        }
    }

    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                document.getElementById('notifications').checked = false;
            }
        }
    }

    showSaveConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'settings-saved-confirmation';
        confirmation.textContent = 'Settings saved successfully!';
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
