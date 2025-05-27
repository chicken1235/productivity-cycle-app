// track.js
class TrackManager {
    constructor() {
        this.section = document.getElementById('symptom-tracker');
        // If your manager needs to access other global elements or managers,
        // you might pass them in the constructor or get them here.
    }

    // This method will be called by script.js to set up the section
    render() {
        if (!this.section) {
            console.error("TrackManager: Target section 'symptom-tracker' not found.");
            return;
        }
        // console.log("TrackManager rendering content and setting up listeners.");

        // Clear existing content (important if rendering multiple times)
        this.section.innerHTML = `
            <form id="symptomForm">
                <div class="symptom-grid">
                    <div class="symptom-category">
                        <h3>Physical Symptoms</h3>
                        <div class="symptom-checks" role="group" aria-labelledby="physical-symptoms-heading">
                            <h4 id="physical-symptoms-heading" class="sr-only">Physical Symptoms</h4>
                            <label><input type="checkbox" name="symptom" value="headache"> Headache</label>
                            <label><input type="checkbox" name="symptom" value="bloating"> Bloating</label>
                            <label><input type="checkbox" name="symptom" value="cramps"> Cramps</label>
                            <label><input type="checkbox" name="symptom" value="fatigue"> Fatigue</label>
                            <label><input type="checkbox" name="symptom" value="acne"> Acne</label>
                            <label><input type="checkbox" name="symptom" value="tender_breasts"> Tender Breasts</label>
                            <label><input type="checkbox" name="symptom" value="low_libido"> Low Libido</label>
                            <label><input type="checkbox" name="symptom" value="high_libido"> High Libido</label>
                        </div>
                    </div>
                    <div class="symptom-category">
                        <h3>Emotional State</h3>
                        <div class="symptom-checks" role="group" aria-labelledby="emotional-state-heading">
                            <h4 id="emotional-state-heading" class="sr-only">Emotional State</h4>
                            <label><input type="checkbox" name="mood" value="happy"> Happy</label>
                            <label><input type="checkbox" name="mood" value="anxious"> Anxious</label>
                            <label><input type="checkbox" name="mood" value="irritable"> Irritable</label>
                            <label><input type="checkbox" name="mood" value="calm"> Calm</label>
                            <label><input type="checkbox" name="mood" value="focused"> Focused</label>
                            <label><input type="checkbox" name="mood" value="unmotivated"> Unmotivated</label>
                        </div>
                    </div>
                    <div class="symptom-category">
                        <h3>Energy Level</h3>
                        <div class="energy-slider">
                            <label for="energyLevel">Rate your energy level (1-10):</label>
                            <input type="range" min="1" max="10" value="5" id="energyLevel" aria-valuemin="1" aria-valuemax="10" aria-valuenow="5">
                            <span id="energyValue" aria-live="polite">5</span>
                        </div>
                    </div>
                </div>
                <button type="submit" id="saveSymptoms" class="btn">Save Today's Symptoms</button>
            </form>
        `;
        // Attach dynamic event listeners AFTER innerHTML has rendered the elements
        this.addEventListeners();
        this.loadSavedData(); // If data needs to be loaded and applied *after* rendering
    }

    addEventListeners() {
        const symptomForm = this.section.querySelector('#symptomForm');
        if (symptomForm) {
            symptomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Get form data
                const formData = new FormData(symptomForm);
                const symptoms = [];
                formData.getAll('symptom').forEach(s => symptoms.push(s));
                const moods = [];
                formData.getAll('mood').forEach(m => moods.push(m));
                const energyLevel = formData.get('energyLevel');

                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const dailyEntry = {
                    date: today,
                    symptoms: symptoms,
                    moods: moods,
                    energyLevel: energyLevel
                };

                // Save to localStorage
                const savedEntries = JSON.parse(localStorage.getItem('dailySymptoms')) || [];
                // Check if an entry for today already exists and update it
                const existingIndex = savedEntries.findIndex(entry => entry.date === today);
                if (existingIndex > -1) {
                    savedEntries[existingIndex] = dailyEntry;
                } else {
                    savedEntries.push(dailyEntry);
                }
                localStorage.setItem('dailySymptoms', JSON.stringify(savedEntries));

                alert('Symptoms saved!');
                console.log('Daily Entry:', dailyEntry);
                // Optionally, update the cycle tracker or UI
            });
        }

        const energyLevelInput = this.section.querySelector('#energyLevel');
        const energyValueSpan = this.section.querySelector('#energyValue');
        if (energyLevelInput && energyValueSpan) {
            energyLevelInput.addEventListener('input', () => {
                energyValueSpan.textContent = energyLevelInput.value;
            });
        }
    }

    loadSavedData() {
        // Example: Load symptoms for the current day if available and pre-fill form
        const today = new Date().toISOString().split('T')[0];
        const savedEntries = JSON.parse(localStorage.getItem('dailySymptoms')) || [];
        const todayEntry = savedEntries.find(entry => entry.date === today);

        if (todayEntry) {
            // Pre-fill checkboxes
            todayEntry.symptoms.forEach(symptom => {
                const checkbox = this.section.querySelector(`input[name="symptom"][value="${symptom}"]`);
                if (checkbox) checkbox.checked = true;
            });
            todayEntry.moods.forEach(mood => {
                const checkbox = this.section.querySelector(`input[name="mood"][value="${mood}"]`);
                if (checkbox) checkbox.checked = true;
            });

            // Set energy level
            const energyLevelInput = this.section.querySelector('#energyLevel');
            const energyValueSpan = this.section.querySelector('#energyValue');
            if (energyLevelInput && energyValueSpan) {
                energyLevelInput.value = todayEntry.energyLevel;
                energyValueSpan.textContent = todayEntry.energyLevel;
            }
        }
    }
}
