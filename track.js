// track.js

class TrackManager {
    constructor() {
        this.symptoms = {
            physical: [
                "Cramps", "Headache", "Bloating", "Breast tenderness",
                "Acne", "Fatigue", "Back pain", "Joint pain", "Nausea",
                "Sleep changes", "Appetite changes", "Skin changes"
            ],
            emotional: [
                "Anxiety", "Mood swings", "Irritability", "Depression",
                "Emotional sensitivity", "Stress", "Calmness", "Joy",
                "Motivation changes", "Focus changes", "Social energy"
            ],
            energy: {
                levels: ["Very Low", "Low", "Moderate", "High", "Very High"],
                activities: ["Rest", "Light", "Moderate", "Intense"]
            }
        };
        this.initializeTracker();
    }

    initializeTracker() {
        this.renderTrackerSection(); // Render the full section structure
        this.renderSymptomCheckboxes();
        this.initializeEnergyActivitySelectors();
        this.setupEventListeners();
    }

    renderTrackerSection() {
        const symptomTrackerSection = document.getElementById('symptom-tracker');
        if (!symptomTrackerSection) return;

        symptomTrackerSection.innerHTML = `
            <div class="container">
                <h2>Daily Symptom Tracker</h2>
                <div class="tracker-form glass-card">
                    <div class="form-group">
                        <label for="tracking-date">Date:</label>
                        <input type="date" id="tracking-date" class="cyber-input" value="${new Date().toISOString().split('T')[0]}">
                    </div>

                    <div class="symptom-grid">
                        <div class="symptom-category">
                            <h3>Physical Symptoms</h3>
                            <div class="symptom-checks" id="physical-symptoms">
                                </div>
                        </div>
                        <div class="symptom-category">
                            <h3>Emotional State</h3>
                            <div class="symptom-checks" id="emotional-symptoms">
                                </div>
                        </div>
                        <div class="symptom-category">
                            <h3>Energy & Activity</h3>
                            <div id="energy-activity-tracker">
                                </div>
                        </div>
                    </div>
                    <button type="button" id="save-tracking" class="cyber-button">Save Today's Tracking</button>
                </div>

                <h3>Tracking History</h3>
                <div id="tracking-history" class="tracking-history">
                    </div>
            </div>
        `;
    }

    renderSymptomCheckboxes() {
        const physicalContainer = document.getElementById('physical-symptoms');
        const emotionalContainer = document.getElementById('emotional-symptoms');

        physicalContainer.innerHTML = this.symptoms.physical.map(symptom =>
            this.createSymptomCheckboxHTML(symptom, 'physical')
        ).join('');

        emotionalContainer.innerHTML = this.symptoms.emotional.map(symptom =>
            this.createSymptomCheckboxHTML(symptom, 'emotional')
        ).join('');
    }

    createSymptomCheckboxHTML(symptom, category) {
        const id = `${category}-${symptom.toLowerCase().replace(/\s/g, '-')}`;
        return `
            <div class="symptom-check">
                <input type="checkbox" id="${id}"
                       name="${category}-symptoms"
                       data-symptom="${symptom}"
                       data-category="${category}"
                       class="cyber-checkbox">
                <label for="${id}">${symptom}</label>
            </div>
        `;
    }

    initializeEnergyActivitySelectors() {
        const energyActivityContainer = document.getElementById('energy-activity-tracker');
        if (!energyActivityContainer) return;

        energyActivityContainer.innerHTML = `
            <div class="energy-level-selector form-group">
                <h4>Energy Level:</h4>
                <div class="energy-buttons">
                    ${this.symptoms.energy.levels.map((level, index) => `
                        <button type="button" class="energy-btn cyber-button-sm" data-level="${index + 1}">${level}</button>
                    `).join('')}
                </div>
            </div>
            <div class="activity-level-selector form-group">
                <h4>Activity Capacity:</h4>
                <div class="activity-buttons">
                    ${this.symptoms.energy.activities.map((activity, index) => `
                        <button type="button" class="activity-btn cyber-button-sm" data-activity="${index + 1}">${activity}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('save-tracking').addEventListener('click', () => this.saveTracking());

        // Energy level buttons
        document.querySelectorAll('.energy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectEnergyLevel(e));
        });

        // Activity level buttons
        document.querySelectorAll('.activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectActivityLevel(e));
        });
    }

    selectEnergyLevel(e) {
        document.querySelectorAll('.energy-btn').forEach(btn => btn.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
    }

    selectActivityLevel(e) {
        document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
    }

    saveTracking() {
        const date = document.getElementById('tracking-date').value;
        const tracking = {
            date: date,
            physical: this.getSelectedSymptoms('physical'),
            emotional: this.getSelectedSymptoms('emotional'),
            energy: this.getSelectedEnergyLevel(),
            activity: this.getSelectedActivityLevel()
        };

        if (!date) {
            alert('Please select a date for your tracking entry.');
            return;
        }

        let trackingHistory = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
        trackingHistory.push(tracking);
        localStorage.setItem('trackingHistory', JSON.stringify(trackingHistory));

        this.clearForm();
        this.loadTrackingHistory();
        this.showSaveConfirmation();
    }

    getSelectedSymptoms(category) {
        return Array.from(document.querySelectorAll(`input[name="${category}-symptoms"]:checked`))
            .map(input => input.dataset.symptom);
    }

    getSelectedEnergyLevel() {
        const selected = document.querySelector('.energy-btn.selected');
        return selected ? selected.textContent : null;
    }

    getSelectedActivityLevel() {
        const selected = document.querySelector('.activity-btn.selected');
        return selected ? selected.textContent : null;
    }

    clearForm() {
        document.getElementById('tracking-date').value = new Date().toISOString().split('T')[0];
        document.querySelectorAll('.symptom-check input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('.energy-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('selected'));
    }

    loadTrackingHistory() {
        const entries = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
        const container = document.getElementById('tracking-history');

        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">No tracking entries yet.</p>';
            return;
        }

        entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = entries.map(entry => this.createEntryHTML(entry)).join('');
    }

    createEntryHTML(entry) {
        const formattedDate = new Date(entry.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="tracking-entry glass-card">
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                </div>
                <div class="entry-details">
                    ${entry.physical.length ? `<p><strong>Physical:</strong> ${entry.physical.join(', ')}</p>` : ''}
                    ${entry.emotional.length ? `<p><strong>Emotional:</strong> ${entry.emotional.join(', ')}</p>` : ''}
                    ${entry.energy ? `<p><strong>Energy:</strong> ${entry.energy}</p>` : ''}
                    ${entry.activity ? `<p><strong>Activity:</strong> ${entry.activity}</p>` : ''}
                </div>
                 <div class="entry-actions">
                    <button class="edit-entry-btn cyber-button-sm" data-date="${entry.date}">Edit</button>
                    <button class="delete-entry-btn cyber-button-sm" data-date="${entry.date}">Delete</button>
                </div>
            </div>
        `;
    }

    showSaveConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'save-confirmation notification-popup';
        confirmation.textContent = 'Tracking saved successfully!';
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
