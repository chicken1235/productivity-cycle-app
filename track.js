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
        this.renderSymptomTrackers();
        this.initializeEnergyTracker();
        this.setupEventListeners();
    }

    renderSymptomTrackers() {
        const physicalContainer = document.getElementById('physical-symptoms');
        const emotionalContainer = document.getElementById('emotional-symptoms');

        this.symptoms.physical.forEach(symptom => {
            physicalContainer.appendChild(this.createSymptomCheckbox(symptom, 'physical'));
        });

        this.symptoms.emotional.forEach(symptom => {
            emotionalContainer.appendChild(this.createSymptomCheckbox(symptom, 'emotional'));
        });
    }

    createSymptomCheckbox(symptom, category) {
        const div = document.createElement('div');
        div.className = 'symptom-check';
        div.innerHTML = `
            <input type="checkbox" id="${category}-${symptom.toLowerCase().replace(/\s/g, '-')}" 
                   name="${category}-symptoms" 
                   data-symptom="${symptom}" 
                   data-category="${category}">
            <label for="${category}-${symptom.toLowerCase().replace(/\s/g, '-')}">${symptom}</label>
        `;
        return div;
    }

    initializeEnergyTracker() {
        const energyContainer = document.getElementById('energy-tracker');
        energyContainer.innerHTML = `
            <div class="energy-level-selector">
                <h4>Energy Level</h4>
                <div class="energy-buttons">
                    ${this.symptoms.energy.levels.map((level, index) => `
                        <button class="energy-btn" data-level="${index + 1}">${level}</button>
                    `).join('')}
                </div>
            </div>
            <div class="activity-level-selector">
                <h4>Activity Capacity</h4>
                <div class="activity-buttons">
                    ${this.symptoms.energy.activities.map((activity, index) => `
                        <button class="activity-btn" data-activity="${index + 1}">${activity}</button>
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
        e.target.classList.add('selected');
    }

    selectActivityLevel(e) {
        document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
    }

    saveTracking() {
        const date = new Date().toISOString().split('T')[0];
        const tracking = {
            date: date,
            physical: this.getSelectedSymptoms('physical'),
            emotional: this.getSelectedSymptoms('emotional'),
            energy: this.getSelectedEnergyLevel(),
            activity: this.getSelectedActivityLevel()
        };

        let trackingHistory = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
        trackingHistory.push(tracking);
        localStorage.setItem('trackingHistory', JSON.stringify(trackingHistory));

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

    showSaveConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'save-confirmation';
        confirmation.textContent = 'Tracking saved successfully!';
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
