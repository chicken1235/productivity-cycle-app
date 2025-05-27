// resources.js

class ResourceManager {
    constructor() {
        this.section = document.getElementById('resources-section');
        // If there's data to load, initialize it here
        this.resourcesData = [
            { title: "Understanding Your Follicular Phase", description: "Learn about the energy and focus that define this phase.", link: "#" },
            { title: "Nutrition for Luteal Phase Comfort", description: "Foods that can help ease PMS symptoms.", link: "#" },
            { title: "Gentle Movement for Menstrual Phase", description: "Support your body during menstruation with mindful exercise.", link: "#" },
            { title: "Cycle Syncing for Productivity", description: "Maximize your work flow by aligning with your cycle.", link: "#" }
        ];
    }

    render() {
        if (!this.section) {
            console.error("ResourceManager: Target section 'resources-section' not found.");
            return;
        }
        // console.log("ResourceManager rendering content.");

        let resourcesHtml = `
            <h3>Explore Curated Wellness Resources</h3>
            <p>Dive deeper into understanding each cycle phase with our guides and articles.</p>
            <div class="resources-grid">
        `;

        this.resourcesData.forEach(resource => {
            resourcesHtml += `
                <div class="resource-card">
                    <h4>${resource.title}</h4>
                    <p>${resource.description}</p>
                    <a href="${resource.link}" class="btn small-btn" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            `;
        });

        resourcesHtml += `</div>`; // Close resources-grid
        this.section.innerHTML = resourcesHtml;

        // Add any specific event listeners for resources here if needed
    }

    // You can add more methods for filtering, searching resources etc.
}
