// settings.js

class SettingsManager {
    constructor() {
        this.section = document.getElementById('settings-section');
        this.themeToggleBtn = null; // Will be set after rendering
        this.currentTheme = 'pink'; // Default theme
    }

    render() {
        if (!this.section) {
            console.error("SettingsManager: Target section 'settings-section' not found.");
            return;
        }
        // console.log("SettingsManager rendering content.");

        this.section.innerHTML = `
            <h3>App Settings</h3>
            <div class="setting-item">
                <h4>Theme Selection</h4>
                <div class="theme-options">
                    <button class="theme-btn" data-theme="pink" aria-label="Switch to Pink Theme">Pink 🌸</button>
                    <button class="theme-btn" data-theme="blue" aria-label="Switch to Blue Theme">Blue 🌊</button>
                    <button class="theme-btn" data-theme="green" aria-label="Switch to Green Theme">Green 🌿</button>
                </div>
            </div>
            <div class="setting-item">
                <h4>Cycle Length</h4>
                <label for="userCycleLength">Your average cycle length (days):</label>
                <input type="number" id="userCycleLength" min="21" max="35" value="28" aria-label="Average cycle length in days">
                <button id="saveCycleLengthBtn" class="btn small-btn">Save</button>
            </div>
            `;

        this.addEventListeners();
        this.loadSavedSettings(); // Load settings after rendering
    }

    addEventListeners() {
        // Theme selection
        this.section.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const selectedTheme = event.target.dataset.theme;
                this.applyTheme(selectedTheme);
                this.saveSetting('theme', selectedTheme);
            });
        });

        // Cycle length save button
        const saveCycleLengthBtn = this.section.querySelector('#saveCycleLengthBtn');
        if (saveCycleLengthBtn) {
            saveCycleLengthBtn.addEventListener('click', () => {
                const cycleLengthInput = this.section.querySelector('#userCycleLength');
                const length = parseInt(cycleLengthInput.value, 10);
                if (length >= 21 && length <= 35) {
                    this.saveSetting('cycleAverageLength', length);
                    alert('Cycle length saved!');
                } else {
                    alert('Please enter a valid cycle length between 21 and 35 days.');
                }
            });
        }
    }

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        this.currentTheme = themeName;
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
                const cycleLengthInput = this.section.querySelector('#userCycleLength');
                if (cycleLengthInput) {
                    cycleLengthInput.value = savedSettings.cycleAverageLength;
                }
            }
        }
    }
}
