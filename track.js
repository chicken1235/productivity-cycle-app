// track.js
class TrackManager {
    constructor() {
        this.section = document.getElementById('symptom-tracker');
        this.symptomTrackerContentDiv = document.getElementById('symptom-tracker-content'); // New content div
    }

    render() {
        if (!this.section || !this.symptomTrackerContentDiv) {
            console.error("TrackManager: Target section or content div not found.");
            return;
        }

        this.symptomTrackerContentDiv.innerHTML = `
            <form id="symptomForm" class="glass-card">
                <h3>Daily Symptom Tracker</h3>
                <div class="form-group">
                    <label for="track-date">Date:</label>
                    <input type="date" id="track-date" class="cyber-input" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <div class="symptom-grid">
                    <div class="symptom-category">
                        <h3>Physical Symptoms</h3>
                        <div class="symptom-checks" role="group" aria-labelledby="physical-symptoms-heading">
                            <h4 id="physical-symptoms-heading" class="sr-only">Physical Symptoms</h4>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="headache"> Headache</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="bloating"> Bloating</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="cramps"> Cramps</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="fatigue"> Fatigue</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="acne"> Acne</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="tender_breasts"> Tender Breasts</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="low_libido"> Low Libido</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="high_libido"> High Libido</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="nausea"> Nausea</label>
                            <label class="symptom-check"><input type="checkbox" name="symptom" value="joint_pain"> Joint Pain</label>
                        </div>
                    </div>
                    <div class="symptom-category">
                        <h3>Emotional State</h3>
                        <div class="symptom-checks" role="group" aria-labelledby="emotional-state-heading">
                            <h4 id="emotional-state-heading" class="sr-only">Emotional State</h4>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="happy"> Happy</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="anxious"> Anxious</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="irritable"> Irritable</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="calm"> Calm</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="focused"> Focused</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="unmotivated"> Unmotivated</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="energetic"> Energetic</label>
                            <label class="symptom-check"><input type="checkbox" name="mood" value="sad"> Sad</label>
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

            <h3>Your Tracking History</h3>
            <div id="tracking-history" class="tracking-history">
                </div>
        `;
        this.addEventListeners();
        this.loadSavedData();
        this.loadTrackingHistory();
    }

    addEventListeners() {
        const symptomForm = this.symptomTrackerContentDiv.querySelector('#symptomForm');
        if (symptomForm) {
            symptomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveDailyEntry();
            });
        }

        const energyLevelInput = this.symptomTrackerContentDiv.querySelector('#energyLevel');
        const energyValueSpan = this.symptomTrackerContentDiv.querySelector('#energyValue');
        if (energyLevelInput && energyValueSpan) {
            energyLevelInput.addEventListener('input', () => {
                energyValueSpan.textContent = energyLevelInput.value;
            });
        }

        // Event delegation for deleting tracking entries
        const trackingHistory = document.getElementById('tracking-history');
        if (trackingHistory) {
            trackingHistory.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-entry-btn')) {
                    const dateToDelete = e.target.dataset.date;
                    if (confirm('Are you sure you want to delete this tracking entry?')) {
                        this.deleteTrackingEntry(dateToDelete);
                    }
                }
            });
        }
    }

    saveDailyEntry() {
        const dateInput = this.symptomTrackerContentDiv.querySelector('#track-date');
        const symptomCheckboxes = this.symptomTrackerContentDiv.querySelectorAll('input[name="symptom"]:checked');
        const moodCheckboxes = this.symptomTrackerContentDiv.querySelectorAll('input[name="mood"]:checked');
        const energyLevelInput = this.symptomTrackerContentDiv.querySelector('#energyLevel');

        const symptoms = Array.from(symptomCheckboxes).map(cb => cb.value);
        const moods = Array.from(moodCheckboxes).map(cb => cb.value);
        const energyLevel = energyLevelInput.value;
        const date = dateInput.value;

        if (!date) {
            alert('Please select a date for your symptom entry.');
            return;
        }

        const dailyEntry = {
            date: date,
            symptoms: symptoms,
            moods: moods,
            energyLevel: energyLevel
        };

        let savedEntries = JSON.parse(localStorage.getItem('dailySymptoms')) || [];
        const existingIndex = savedEntries.findIndex(entry => entry.date === date);

        if (existingIndex > -1) {
            savedEntries[existingIndex] = dailyEntry;
        } else {
            savedEntries.push(dailyEntry);
        }
        localStorage.setItem('dailySymptoms', JSON.stringify(savedEntries));

        this.showSaveConfirmation('Symptom entry saved!');
        this.loadTrackingHistory(); // Re-render the history
    }

    loadSavedData() {
        // Loads data for the *current* date to pre-fill the form
        const today = new Date().toISOString().split('T')[0];
        const savedEntries = JSON.parse(localStorage.getItem('dailySymptoms')) || [];
        const todayEntry = savedEntries.find(entry => entry.date === today);

        const dateInput = this.symptomTrackerContentDiv.querySelector('#track-date');
        const energyLevelInput = this.symptomTrackerContentDiv.querySelector('#energyLevel');
        const energyValueSpan = this.symptomTrackerContentDiv.querySelector('#energyValue');

        if (todayEntry) {
            if (dateInput) dateInput.value = todayEntry.date;
            todayEntry.symptoms.forEach(symptom => {
                const checkbox = this.symptomTrackerContentDiv.querySelector(`input[name="symptom"][value="${symptom}"]`);
                if (checkbox) checkbox.checked = true;
            });
            todayEntry.moods.forEach(mood => {
                const checkbox = this.symptomTrackerContentDiv.querySelector(`input[name="mood"][value="${mood}"]`);
                if (checkbox) checkbox.checked = true;
            });

            if (energyLevelInput && energyValueSpan) {
                energyLevelInput.value = todayEntry.energyLevel;
                energyValueSpan.textContent = todayEntry.energyLevel;
            }
        } else {
             // If no entry for today, reset form
             if (dateInput) dateInput.value = today;
             this.symptomTrackerContentDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
             if (energyLevelInput && energyValueSpan) {
                 energyLevelInput.value = 5;
                 energyValueSpan.textContent = 5;
             }
        }
    }

    loadTrackingHistory() {
        const entries = JSON.parse(localStorage.getItem('dailySymptoms') || '[]');
        const container = document.getElementById('tracking-history');

        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">No tracking entries yet. Log your first symptoms!</p>';
            return;
        }

        // Sort entries by date in descending order
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = entries.map(entry => this.createEntryHTML(entry)).join('');
    }

    createEntryHTML(entry) {
        const formattedDate = new Date(entry.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const symptomsHtml = entry.symptoms.length ? `
            <div class="entry-tags">
                ${entry.symptoms.map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
        ` : '';

        const moodsHtml = entry.moods.length ? `
            <div class="entry-tags">
                ${entry.moods.map(m => `<span class="tag mood-tag">${m}</span>`).join('')}
            </div>
        ` : '';

        return `
            <div class="tracking-entry glass-card">
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                    <span class="entry-mood">Energy: ${entry.energyLevel}/10</span>
                </div>
                <div class="entry-content">
                    ${symptomsHtml ? `<h4>Symptoms:</h4>${symptomsHtml}` : '<p>No symptoms logged.</p>'}
                    ${moodsHtml ? `<h4>Moods:</h4>${moodsHtml}` : '<p>No moods logged.</p>'}
                </div>
                <div class="entry-actions">
                    <button class="delete-entry-btn btn small-btn" data-date="${entry.date}" aria-label="Delete tracking entry for ${formattedDate}">Delete</button>
                </div>
            </div>
        `;
    }

    deleteTrackingEntry(date) {
        let entries = JSON.parse(localStorage.getItem('dailySymptoms') || '[]');
        entries = entries.filter(entry => entry.date !== date);
        localStorage.setItem('dailySymptoms', JSON.stringify(entries));
        this.loadTrackingHistory();
        this.showSaveConfirmation('Tracking entry deleted!', 'info');
    }

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
