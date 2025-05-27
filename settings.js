// settings.js

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
        this.renderSettingsForm(); // Render the full settings form
        this.loadSettings();
        this.setupEventListeners();
    }

    renderSettingsForm() {
        const settingsSection = document.getElementById('settings-section');
        if (!settingsSection) return;

        settingsSection.innerHTML = `
            <div class="container">
                <h2>Preferences</h2>
                <form id="settingsForm" class="settings-form glass-card">
                    <div class="settings-grid">
                        <div class="setting-item">
                            <label for="cycle-length">Average Cycle Length (days):</label>
                            <input type="number" id="cycle-length" min="21" max="35" value="28" class="cyber-input">
                        </div>
                        <div class="setting-item">
                            <label for="period-length">Average Period Length (days):</label>
                            <input type="number" id="period-length" min="2" max="10" value="5" class="cyber-input">
                        </div>
                        <div class="setting-item">
                            <label for="notifications">Enable Notifications:</label>
                            <input type="checkbox" id="notifications" class="cyber-checkbox">
                        </div>
                        <div class="setting-item">
                            <label for="theme-selector">Color Theme:</label>
                            <select id="theme-selector" class="cyber-input">
                                <option value="pink">Pink</option>
                                <option value="purple">Purple</option>
                                <option value="blue">Blue</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="language-selector">Language:</label>
                            <select id="language-selector" class="cyber-input">
                                <option value="en">English</option>
                                </select>
                        </div>
                        <div class="setting-item reminder-group">
                            <h4>Reminders:</h4>
                            <div class="reminder-option">
                                <input type="checkbox" id="reminder-period" class="cyber-checkbox">
                                <label for="reminder-period">Period Start</label>
                            </div>
                            <div class="reminder-option">
                                <input type="checkbox" id="reminder-ovulation" class="cyber-checkbox">
                                <label for="reminder-ovulation">Ovulation</label>
                            </div>
                            <div class="reminder-option">
                                <input type="checkbox" id="reminder-symptoms" class="cyber-checkbox">
                                <label for="reminder-symptoms">Symptom Logging</label>
                            </div>
                        </div>
                    </div>
                    <div class="settings-actions">
                        <button type="button" id="save-settings" class="cyber-button">Save Settings</button>
                        <button type="button" id="reset-settings" class="cyber-button-secondary">Reset to Default</button>
                    </div>
                </form>
            </div>
        `;
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
            const reminderCheckbox = document.getElementById(`reminder-${reminder}`);
            if (reminderCheckbox) {
                reminderCheckbox.checked = settings.reminders[reminder];
            }
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
            this.showSaveConfirmation('Settings reset to default!');
        }
    }

    applySettings(settings) {
        this.updateTheme(settings.theme);
        if (settings.notifications) {
            this.requestNotificationPermission();
        }
        // Potentially update other app aspects based on settings (e.g., calendar calculations)
    }

    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.warn("This browser does not support notifications.");
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            document.getElementById('notifications').checked = false;
            alert('Notification permission denied. You can re-enable it in your browser settings.');
        }
    }

    showSaveConfirmation(message = 'Settings saved successfully!') {
        const confirmation = document.createElement('div');
        confirmation.className = 'settings-saved-confirmation notification-popup';
        confirmation.textContent = message;
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
