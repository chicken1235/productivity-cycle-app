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
        this.renderPhaseResources();
        this.setupPhaseSelector();
    }

    renderPhaseResources(phase = 'menstrual') {
        const container = document.getElementById('resources-content');
        const phaseData = this.resources[phase];

        container.innerHTML = `
            <div class="resources-grid">
                <div class="resource-card nutrition">
                    <h3>Nutrition Recommendations</h3>
                    <ul>
                        ${phaseData.nutrition.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="resource-card exercise">
                    <h3>Exercise Suggestions</h3>
                    <ul>
                        ${phaseData.exercise.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="resource-card wellness">
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
        selector.addEventListener('change', (e) => {
            this.renderPhaseResources(e.target.value);
        });
    }
}
