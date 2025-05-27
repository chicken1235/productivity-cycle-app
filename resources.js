// resources.js

class ResourceManager {
    constructor() {
        this.resources = {
            menstrual: {
                nutrition: [
                    "Iron-rich foods (leafy greens, red meat)",
                    "Complex carbohydrates",
                    "Anti-inflammatory foods",
                    "Warm, nourishing soups",
                    "Dark chocolate (70%+ cocoa)"
                ],
                exercise: [
                    "Gentle yoga",
                    "Light walking",
                    "Stretching",
                    "Meditation",
                    "Rest days as needed"
                ],
                wellness: [
                    "Heat therapy",
                    "Extra rest",
                    "Journaling",
                    "Meditation",
                    "Salt baths"
                ]
            },
            follicular: {
                nutrition: [
                    "Lean proteins",
                    "Fresh fruits and vegetables",
                    "Fermented foods",
                    "Seeds (flax, pumpkin)",
                    "Light, energizing meals"
                ],
                exercise: [
                    "Cardio workouts",
                    "Dance classes",
                    "Strength training",
                    "New fitness classes",
                    "High-energy activities"
                ],
                wellness: [
                    "Goal setting",
                    "Creative projects",
                    "Learning new skills",
                    "Social activities",
                    "Adventure planning"
                ]
            },
            ovulation: {
                nutrition: [
                    "Raw vegetables",
                    "Antioxidant-rich foods",
                    "Healthy fats",
                    "Hydrating foods",
                    "Light, fresh meals"
                ],
                exercise: [
                    "High-intensity workouts",
                    "Group fitness classes",
                    "Sports activities",
                    "Running",
                    "Power yoga"
                ],
                wellness: [
                    "Networking",
                    "Public speaking",
                    "Dating",
                    "Social events",
                    "Leadership activities"
                ]
            },
            luteal: {
                nutrition: [
                    "Magnesium-rich foods",
                    "Complex carbohydrates",
                    "Calcium-rich foods",
                    "Healthy fats",
                    "Comfort foods in moderation"
                ],
                exercise: [
                    "Strength training",
                    "Pilates",
                    "Swimming",
                    "Moderate cardio",
                    "Yoga flow"
                ],
                wellness: [
                    "Organization tasks",
                    "Self-care routines",
                    "Meal prep",
                    "Relaxation techniques",
                    "Gentle movement"
                ]
            }
        };
        this.initializeResources();
    }

    initializeResources() {
        this.renderResourcesSection(); // Render the full section structure
        this.setupPhaseSelector();
        this.renderPhaseResources('menstrual'); // Render initial phase
    }

    renderResourcesSection() {
        const resourcesSection = document.getElementById('resources-section');
        if (!resourcesSection) return;

        resourcesSection.innerHTML = `
            <div class="container">
                <h2>Wellness Resources</h2>
                <div class="phase-selector-wrapper">
                    <label for="phase-selector">Select Cycle Phase:</label>
                    <select id="phase-selector" class="cyber-input">
                        <option value="menstrual">Menstrual Phase</option>
                        <option value="follicular">Follicular Phase</option>
                        <option value="ovulation">Ovulation Phase</option>
                        <option value="luteal">Luteal Phase</option>
                    </select>
                </div>
                <div id="resources-content" class="resources-grid-container">
                    </div>
            </div>
        `;
    }

    renderPhaseResources(phase) {
        const container = document.getElementById('resources-content');
        if (!container) return; // Ensure container exists

        const phaseData = this.resources[phase];
        if (!phaseData) {
            container.innerHTML = '<p>No resources found for this phase.</p>';
            return;
        }

        container.innerHTML = `
            <div class="resources-grid">
                <div class="resource-card glass-card nutrition">
                    <h3>Nutrition Recommendations</h3>
                    <ul>
                        ${phaseData.nutrition.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="resource-card glass-card exercise">
                    <h3>Exercise Suggestions</h3>
                    <ul>
                        ${phaseData.exercise.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="resource-card glass-card wellness">
                    <h3>Wellness Activities</h3>
                    <ul>
                        ${phaseData.wellness.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    setupPhaseSelector() {
        const selector = document.getElementById('phase-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.renderPhaseResources(e.target.value);
            });
        }
    }
}
