// resources.js

class ResourceManager {
    constructor() {
        this.section = document.getElementById('resources-section');
        this.resourcesContentDiv = document.getElementById('resources-content'); // Main content div for resources
        this.currentCyclePhase = 'default'; // Placeholder: This would ideally be set by a CycleManager or similar

        // Enriched resources data with a 'phase' property for filtering
        this.resourcesData = [
            {
                title: "Understanding Your Follicular Phase: Unleash Your Inner Spring",
                description: "This phase, from menstruation to ovulation, is characterized by rising energy, mental clarity, and a natural inclination towards new beginnings. Ideal for planning, strategizing, and tackling new projects. Learn how to leverage this period for personal growth and productivity.",
                link: "https://www.example.com/follicular-phase-guide", // Example external link
                phase: "follicular",
                keywords: ["energy", "focus", "planning", "new beginnings", "growth"]
            },
            {
                title: "Nutrition for Luteal Phase Comfort: Nurturing Your Inner Autumn",
                description: "As progesterone rises, you might experience pre-menstrual symptoms. Discover nutrient-rich foods, healthy snacks, and dietary tips to help ease common discomforts like bloating, cravings, and fatigue. Focus on grounding and nourishing your body.",
                link: "https://www.example.com/luteal-nutrition",
                phase: "luteal",
                keywords: ["nutrition", "cravings", "bloating", "fatigue", "comfort", "PMS"]
            },
            {
                title: "Gentle Movement for Menstrual Phase: Embracing Your Inner Winter",
                description: "During menstruation, your body is working hard. Support it with restorative practices like gentle yoga, stretching, walking, or meditation. Prioritize rest, self-care, and introspection. Listen to your body's need for stillness.",
                link: "https://www.example.com/menstrual-movement",
                phase: "menstrual",
                keywords: ["rest", "meditation", "yoga", "self-care", "pain relief"]
            },
            {
                title: "Cycle Syncing for Productivity: Harmonize Your Work & Cycle",
                description: "Maximize your efficiency by aligning your professional tasks with your cycle's natural energy fluctuations. Learn which tasks are best suited for each phase, from brainstorming in follicular to networking in ovulatory.",
                link: "https://www.example.com/cycle-syncing-productivity",
                phase: "general", // Applicable across phases or as an introductory concept
                keywords: ["productivity", "work-life balance", "biohacking", "efficiency"]
            },
            {
                title: "Optimizing Your Ovulatory Phase: Shine Bright Like Your Inner Summer",
                description: "The ovulatory phase brings peak energy, confidence, and enhanced communication skills. This is your time to shine! Learn how to leverage this phase for social engagements, presentations, and creative expression.",
                link: "https://www.example.com/ovulatory-optimizing",
                phase: "ovulatory",
                keywords: ["confidence", "social", "communication", "peak energy", "creativity"]
            },
            {
                title: "Mindfulness & Stress Reduction: A Tool for Every Phase",
                description: "Integrate mindfulness techniques, deep breathing exercises, and meditation into your daily routine to manage stress and maintain emotional balance throughout your entire cycle, regardless of phase.",
                link: "https://www.example.com/mindfulness-stress",
                phase: "general",
                keywords: ["stress", "anxiety", "meditation", "well-being", "emotional balance"]
            },
            {
                title: "Understanding Your Luteal Phase: Embracing Your Inner Autumn",
                description: "The period after ovulation leading to menstruation can bring introspection and a desire to wind down. Learn to manage pre-menstrual energy shifts and prioritize self-care and completion of tasks.",
                link: "https://www.example.com/luteal-understanding",
                phase: "luteal",
                keywords: ["introspection", "pre-menstrual", "winding down", "self-care"]
            }
        ];
    }

    /**
     * Renders the resources section, dynamically displaying resources based on the current cycle phase.
     */
    render() {
        if (!this.section || !this.resourcesContentDiv) {
            console.error("ResourceManager: Target section or content div not found. Cannot render resources.");
            return;
        }

        // --- Simulate fetching current cycle phase ---
        // In a real application, you would get this from localStorage,
        // a global state manager, or by calling a method on TrackManager.
        // For demonstration, let's try to get it from localStorage or default.
        const storedCyclePhase = localStorage.getItem('currentCyclePhase');
        this.currentCyclePhase = storedCyclePhase ? storedCyclePhase.toLowerCase() : 'general'; // Default to 'general' or 'follicular'

        let resourcesHtml = `
            <div class="resources-header">
                <h3>Explore Curated Wellness Resources</h3>
                <p>Dive deeper into understanding each cycle phase with our guides and articles,
                   tailored to support your well-being.</p>
                <div class="phase-indicator">
                    <span class="label">Current Focus:</span>
                    <span class="current-phase-display">${this.capitalizeFirstLetter(this.currentCyclePhase)} Phase Resources</span>
                </div>
            </div>
            <div class="resources-grid">
        `;

        // Filter resources based on current phase or show all if 'general' or no specific phase
        const filteredResources = this.resourcesData.filter(resource =>
            resource.phase === this.currentCyclePhase || resource.phase === 'general' || this.currentCyclePhase === 'default'
        );

        if (filteredResources.length === 0) {
            resourcesHtml += `
                <p class="no-resources-message glass-card">No specific resources found for the "${this.capitalizeFirstLetter(this.currentCyclePhase)}" phase.
                   Please check back later or explore other sections!</p>
            `;
        } else {
            filteredResources.forEach(resource => {
                resourcesHtml += `
                    <div class="resource-card glass-card">
                        <h4>${resource.title}</h4>
                        <p>${resource.description}</p>
                        <a href="${resource.link}" class="btn small-btn" target="_blank" rel="noopener noreferrer"
                           aria-label="Read more about ${resource.title}">Read More <i class="fas fa-external-link-alt external-link-icon" aria-hidden="true"></i></a>
                    </div>
                `;
            });
        }

        resourcesHtml += `</div>`;
        this.resourcesContentDiv.innerHTML = resourcesHtml; // Render into the new content div
        // No specific event listeners are needed for static links within the cards as target="_blank" handles new tabs.
    }

    /**
     * Helper function to capitalize the first letter of a string.
     * @param {string} str - The input string.
     * @returns {string} The string with the first letter capitalized.
     */
    capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
