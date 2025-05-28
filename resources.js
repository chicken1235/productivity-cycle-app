// resources.js

class ResourceManager {
    constructor() {
        this.section = document.getElementById('resources-section');
        this.resourcesContentDiv = document.getElementById('resources-content'); // New content div
        this.resourcesData = [
            { title: "Understanding Your Follicular Phase", description: "Learn about the energy and focus that define this phase, ideal for new projects and challenging tasks.", link: "#" },
            { title: "Nutrition for Luteal Phase Comfort", description: "Discover foods and dietary tips to help ease common pre-menstrual symptoms like bloating and cravings.", link: "#" },
            { title: "Gentle Movement for Menstrual Phase", description: "Support your body during menstruation with mindful exercise, focusing on rest and restoration.", link: "#" },
            { title: "Cycle Syncing for Productivity", description: "Maximize your work flow by aligning your professional tasks with your cycle's natural energy fluctuations.", link: "#" },
            { title: "Optimizing Your Ovulatory Phase", description: "Harness peak energy and social confidence for networking and communication.", link: "#" },
            { title: "Mindfulness & Stress Reduction", description: "Techniques to help manage stress and maintain emotional balance throughout your cycle.", link: "#" }
        ];
    }

    render() {
        if (!this.section || !this.resourcesContentDiv) {
            console.error("ResourceManager: Target section or content div not found.");
            return;
        }

        let resourcesHtml = `
            <h3>Explore Curated Wellness Resources</h3>
            <p>Dive deeper into understanding each cycle phase with our guides and articles.</p>
            <div class="resources-grid">
        `;

        this.resourcesData.forEach(resource => {
            resourcesHtml += `
                <div class="resource-card glass-card">
                    <h4>${resource.title}</h4>
                    <p>${resource.description}</p>
                    <a href="${resource.link}" class="btn small-btn" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            `;
        });

        resourcesHtml += `</div>`;
        this.resourcesContentDiv.innerHTML = resourcesHtml; // Render into the new content div
        // No specific event listeners needed for static links within the cards
    }
}
