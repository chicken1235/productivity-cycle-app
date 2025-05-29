// settings.js

class SettingsManager {
    constructor() {
        this.section = document.getElementById('settings-section');
        this.settingsContentDiv = document.getElementById('settings-content'); // New content div
        this.currentTheme = 'pink'; // Default theme, will be updated from localStorage
    }

    render() {
        if (!this.section || !this.settingsContentDiv) {
            console.error("SettingsManager: Target section or content div not found.");
            return;
        }

        this.settingsContentDiv.innerHTML = `
            <div class="settings-form glass-card">
                <h3>App Settings</h3>
                <div class="setting-item">
                    <h4>Theme Selection</h4>
                    <div class="theme-options" role="radiogroup" aria-label="Theme selection">
                        <button class="theme-btn" data-theme="pink" aria-label="Switch to Pink Theme">Pink 🌸</button>
                        <button class="theme-btn" data-theme="blue" aria-label="Switch to Blue Theme">Blue 🌊</button>
                        <button class="theme-btn" data-theme="green" aria-label="Switch to Green Theme">Green 🌿</button>
                    </div>
                </div>
                <div class="setting-item">
                    <h4>Cycle Length</h4>
                    <label for="userCycleLength">Your average cycle length (days):</label>
                    <input type="number" id="userCycleLength" class="cyber-input" min="21" max="35" value="28" aria-label="Average cycle length in days">
                    <button id="saveCycleLengthBtn" class="btn small-btn">Save</button>
                </div>
            </div>
            `;

        this.loadSavedSettings(); // Load settings first to apply theme before event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Theme selection
        this.settingsContentDiv.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const selectedTheme = event.target.dataset.theme;
                this.applyTheme(selectedTheme);
                this.saveSetting('theme', selectedTheme);
                this.showSaveConfirmation(`Theme set to ${selectedTheme}!`, 'success');
                this.updateThemeButtonActiveState(selectedTheme); // Update active state
            });
        });

        // Cycle length save button
        const saveCycleLengthBtn = this.settingsContentDiv.querySelector('#saveCycleLengthBtn');
        if (saveCycleLengthBtn) {
            saveCycleLengthBtn.addEventListener('click', () => {
                const cycleLengthInput = this.settingsContentDiv.querySelector('#userCycleLength');
                const length = parseInt(cycleLengthInput.value, 10);
                if (length >= 21 && length <= 35) {
                    this.saveSetting('cycleAverageLength', length);
                    this.showSaveConfirmation('Cycle length saved successfully!', 'success');
                    // Optionally, trigger a re-calculation of cycle day/phase if needed
                    // (e.g., if quiz answers are already set and just length changed)
                } else {
                    this.showSaveConfirmation('Please enter a valid cycle length between 21 and 35 days.', 'error');
                }
            });
        }
    }

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        this.currentTheme = themeName;
        // Ensure the active state is updated immediately when theme is applied programmatically
        this.updateThemeButtonActiveState(themeName);
    }

    updateThemeButtonActiveState(activeTheme) {
        this.settingsContentDiv.querySelectorAll('.theme-btn').forEach(button => {
            if (button.dataset.theme === activeTheme) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    saveSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
        settings[key] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }

    loadSavedSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
        if (savedSettings) {
            if (savedSettings.theme) {
                this.applyTheme(savedSettings.theme);
            }
            if (savedSettings.cycleAverageLength) {
                const cycleLengthInput = this.settingsContentDiv.querySelector('#userCycleLength');
                if (cycleLengthInput) {
                    cycleLengthInput.value = savedSettings.cycleAverageLength;
                }
            }
        } else {
            // If no settings saved, apply default theme and set active state
            this.applyTheme(this.currentTheme); // This will default to 'pink'
        }
    }

    // Reusing the notification popup from TrackManager for consistency
    showSaveConfirmation(message, type = 'success') {
        const confirmation = document.createElement('div');
        confirmation.className = `notification-popup ${type}`;
        confirmation.textContent = message;
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
