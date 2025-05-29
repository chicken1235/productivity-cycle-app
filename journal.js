// journal.js

class JournalManager {
    constructor() {
        this.journalSection = document.getElementById('journal-section');
        this.journalFormContainer = null; // Will hold the dynamically created form
        this.journalHistoryContainer = null; // Will hold the dynamically created history section

        this.moodOptions = [
            { emoji: '😊', name: 'Happy', description: 'Feeling content and joyful' },
            { emoji: '😔', name: 'Sad', description: 'Feeling down or low-spirited' },
            { emoji: '😡', name: 'Angry', description: 'Feeling irritated or frustrated' },
            { emoji: '😴', name: 'Tired', description: 'Feeling fatigued and needing rest' },
            { emoji: '🥰', name: 'Loving', description: 'Feeling affectionate and warm' },
            { emoji: '😰', name: 'Anxious', description: 'Feeling worried or uneasy' },
            { emoji: '😌', name: 'Calm', description: 'Feeling peaceful and relaxed' },
            { emoji: '🤔', name: 'Thoughtful', description: 'Feeling reflective or pensive' }
        ];
        this.tagOptions = [
            'Work', 'Fitness', 'Food', 'Social', 'Self-care', 'Sleep', 'Energy', 'Creativity', 'Symptoms', 'Family'
        ];

        // Reference to the global notification system, assuming it exists
        this.notificationDisplay = document.getElementById('notification-popup-container');
    }

    /**
     * Renders the journal form and history sections.
     * This method creates and appends all dynamic HTML for the journal.
     */
    render() {
        if (!this.journalSection) {
            console.error("JournalManager: Target section 'journal-section' not found. Cannot render.");
            return;
        }

        // Clear existing content if you want this manager to control all content
        this.journalSection.innerHTML = '';

        // Create a wrapper for the journal content (form + history)
        const journalContentWrapper = document.createElement('div');
        journalContentWrapper.className = 'journal-content-wrapper';

        // Create the form container
        this.journalFormContainer = document.createElement('div');
        this.journalFormContainer.className = 'journal-form glass-card';
        this.journalFormContainer.innerHTML = `
            <h2>Daily Journal & Planner</h2>
            <div class="form-group">
                <label for="journal-date">Date:</label>
                <input type="date" id="journal-date" class="cyber-input" value="${new Date().toISOString().split('T')[0]}" max="${new Date().toISOString().split('T')[0]}" aria-label="Select date for journal entry">
            </div>

            <div id="mood-selector" class="form-group">
                <h4>How are you feeling today? <span class="required-indicator">*</span></h4>
                <div class="mood-grid" role="radiogroup" aria-label="Select your mood for the day">
                    ${this.moodOptions.map(mood => `
                        <button type="button" class="mood-btn" data-mood="${mood.name}" aria-label="Select mood: ${mood.name}. ${mood.description}">
                            ${mood.emoji}
                            <span class="mood-name">${mood.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="form-group">
                <h4>Add Tags (Optional):</h4>
                <div id="journal-tag-selector" class="tag-grid" role="group" aria-label="Select tags for your journal entry">
                    ${this.tagOptions.map(tag => `
                        <button type="button" class="journal-tag btn-secondary small-btn" data-tag="${tag}">${tag}</button>
                    `).join('')}
                </div>
            </div>

            <div class="form-group">
                <label for="journal-content">What's on your mind? <span class="required-indicator">*</span></label>
                <textarea id="journal-content" class="cyber-input" rows="8" placeholder="Write about your day, thoughts, feelings, or plans..." aria-required="true"></textarea>
            </div>

            <button type="button" id="save-journal" class="btn">Save Journal Entry</button>
        `;

        // Create the history container
        this.journalHistoryContainer = document.createElement('div');
        this.journalHistoryContainer.className = 'journal-history-section';
        this.journalHistoryContainer.innerHTML = `
            <h3>Your Past Entries</h3>
            <div id="journal-history" class="journal-history">
                </div>
        `;

        // Append to the main section
        journalContentWrapper.appendChild(this.journalFormContainer);
        journalContentWrapper.appendChild(this.journalHistoryContainer);
        this.journalSection.appendChild(journalContentWrapper);

        this.setupEventListeners();
        this.loadJournalEntries(); // Load entries after all HTML is rendered and event listeners are set up
    }

    /**
     * Sets up all event listeners for the journal form and history section.
     */
    setupEventListeners() {
        // Form specific elements
        this.journalFormContainer.querySelector('#save-journal')?.addEventListener('click', () => this.saveJournalEntry());
        this.journalFormContainer.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e.currentTarget));
        });
        this.journalFormContainer.querySelectorAll('.journal-tag').forEach(tagBtn => {
            tagBtn.addEventListener('click', (e) => this.toggleTag(e.currentTarget));
        });

        // Event delegation for edit/delete buttons on journal history (must be on parent)
        this.journalHistoryContainer.querySelector('#journal-history')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-entry-btn')) {
                const dateToDelete = e.target.dataset.date;
                if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
                    this.deleteJournalEntry(dateToDelete);
                }
            } else if (e.target.classList.contains('edit-entry-btn')) {
                const entryData = e.target.dataset;
                this.editJournalEntry(entryData);
            }
        });
    }

    /**
     * Selects a mood button, deselecting others.
     * @param {HTMLElement} clickedButton - The mood button element that was clicked.
     */
    selectMood(clickedButton) {
        this.journalFormContainer.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        clickedButton.classList.add('selected');
    }

    /**
     * Toggles the 'selected' class on a tag button.
     * @param {HTMLElement} clickedButton - The tag button element that was clicked.
     */
    toggleTag(clickedButton) {
        clickedButton.classList.toggle('selected');
    }

    /**
     * Gathers form data, validates it, and saves the journal entry to local storage.
     * Updates existing entries or adds new ones.
     */
    saveJournalEntry() {
        const dateInput = this.journalFormContainer.querySelector('#journal-date');
        const contentInput = this.journalFormContainer.querySelector('#journal-content');
        const selectedMoodBtn = this.journalFormContainer.querySelector('.mood-btn.selected');

        const entry = {
            date: dateInput.value,
            mood: selectedMoodBtn ? selectedMoodBtn.dataset.mood : null,
            content: contentInput.value.trim(),
            tags: this.getSelectedTags()
        };

        if (!this.validateEntry(entry)) {
            return; // Stop if validation fails
        }

        let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');

        // Check if an entry for this date already exists and update it
        const existingIndex = entries.findIndex(e => e.date === entry.date);
        if (existingIndex > -1) {
            entries[existingIndex] = entry; // Overwrite existing entry
            this.showNotification('Journal entry updated successfully!', 'success');
        } else {
            entries.push(entry); // Add new entry
            this.showNotification('Journal entry saved!', 'success');
        }

        localStorage.setItem('journalEntries', JSON.stringify(entries));

        this.clearForm();
        this.loadJournalEntries(); // Re-render the history
    }

    /**
     * Validates the journal entry data.
     * @param {object} entry - The journal entry object to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    validateEntry(entry) {
        if (!entry.date) {
            this.showNotification('Please select a date for your journal entry.', 'error');
            return false;
        }
        if (!entry.mood) {
            this.showNotification('Please select how you are feeling (your mood).', 'error');
            return false;
        }
        if (!entry.content) {
            this.showNotification('Your journal entry cannot be empty. Please write something.', 'error');
            return false;
        }
        return true;
    }

    /**
     * Retrieves all selected tags from the form.
     * @returns {string[]} An array of selected tag names.
     */
    getSelectedTags() {
        return Array.from(this.journalFormContainer.querySelectorAll('.journal-tag.selected'))
            .map(tag => tag.dataset.tag);
    }

    /**
     * Loads and displays all journal entries from local storage.
     */
    loadJournalEntries() {
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        const container = this.journalHistoryContainer.querySelector('#journal-history');

        if (!container) {
            console.error("Journal history container not found.");
            return;
        }

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries glass-card">No journal entries yet. Start by saving your first entry!</p>';
            return;
        }

        entries.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending by date

        container.innerHTML = entries.map(entry => this.createEntryHTML(entry)).join('');
    }

    /**
     * Creates the HTML string for a single journal entry display.
     * @param {object} entry - The journal entry object.
     * @returns {string} The HTML string for the entry.
     */
    createEntryHTML(entry) {
        const mood = this.moodOptions.find(m => m.name === entry.mood);
        const moodEmoji = mood ? mood.emoji : '';
        const moodDescription = mood ? mood.description : ''; // Use description for aria-label

        const formattedDate = new Date(entry.date).toLocaleDateString('en-US', { // Changed to en-US for typical formatting (e.g., May 29, 2025)
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Ensure tags are always an array before joining
        const tagsString = Array.isArray(entry.tags) ? entry.tags.join(',') : '';
        const tagsHtml = Array.isArray(entry.tags) && entry.tags.length ? `
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : '';

        return `
            <div class="journal-entry glass-card" data-date="${entry.date}">
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                    <span class="entry-mood" role="img" aria-label="${moodDescription}">${moodEmoji} ${entry.mood || 'N/A'}</span>
                </div>
                <div class="entry-content">${entry.content}</div>
                ${tagsHtml}
                <div class="entry-actions">
                    <button class="edit-entry-btn btn small-btn"
                        data-date="${entry.date}"
                        data-mood="${entry.mood || ''}"
                        data-content="${encodeURIComponent(entry.content)}"
                        data-tags="${tagsString}"
                        aria-label="Edit journal entry for ${formattedDate}">Edit</button>
                    <button class="delete-entry-btn btn small-btn" data-date="${entry.date}" aria-label="Delete journal entry for ${formattedDate}">Delete</button>
                </div>
            </div>
        `;
    }

    /**
     * Clears the journal form inputs and resets mood/tag selections.
     */
    clearForm() {
        this.journalFormContainer.querySelector('#journal-date').value = new Date().toISOString().split('T')[0];
        this.journalFormContainer.querySelector('#journal-content').value = '';
        this.journalFormContainer.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        this.journalFormContainer.querySelectorAll('.journal-tag').forEach(tag => tag.classList.remove('selected'));
    }

    /**
     * Deletes a journal entry by its date.
     * @param {string} date - The date of the entry to delete (YYYY-MM-DD format).
     */
    deleteJournalEntry(date) {
        let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries = entries.filter(entry => entry.date !== date);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        this.loadJournalEntries(); // Re-render the list
        this.showNotification('Journal entry deleted successfully!', 'success');
    }

    /**
     * Populates the journal form with data from an existing entry for editing.
     * @param {object} entryData - The dataset object from the edit button containing entry data.
     */
    editJournalEntry(entryData) {
        // Populate the form with the selected entry's data
        this.journalFormContainer.querySelector('#journal-date').value = entryData.date;
        this.journalFormContainer.querySelector('#journal-content').value = decodeURIComponent(entryData.content);

        // Select the mood button
        this.journalFormContainer.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.mood === entryData.mood) {
                btn.classList.add('selected');
            }
        });

        // Select the tags
        const tags = entryData.tags ? entryData.tags.split(',') : [];
        this.journalFormContainer.querySelectorAll('.journal-tag').forEach(tagBtn => {
            tagBtn.classList.remove('selected');
            if (tags.includes(tagBtn.dataset.tag)) {
                tagBtn.classList.add('selected');
            }
        });

        // Scroll to the form
        this.journalFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.showNotification('Entry loaded for editing. Make your changes and click Save.', 'info');
    }

    /**
     * Displays a temporary notification message to the user.
     * Leverages the existing notification system if available.
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'warning'|'info'} type - The type of notification.
     */
    showNotification(message, type = 'success') {
        // Check if the global notification system exists (from script.js or quiz.js)
        if (typeof showNotification === 'function') {
            showNotification(message, type); // Call the global function
        } else {
            // Fallback if global notification isn't available
            const confirmation = document.createElement('div');
            confirmation.className = `notification-popup ${type}`;
            confirmation.textContent = message;
            document.body.appendChild(confirmation);

            setTimeout(() => {
                confirmation.remove();
            }, 3000);
        }
    }
}
