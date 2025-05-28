// journal.js

class JournalManager {
    constructor() {
        this.journalSection = document.getElementById('journal-section');
        this.moodOptions = [
            { emoji: '😊', name: 'Happy' },
            { emoji: '😔', name: 'Sad' },
            { emoji: '😡', name: 'Angry' },
            { emoji: '😴', name: 'Tired' },
            { emoji: '🥰', name: 'Loving' },
            { emoji: '😰', name: 'Anxious' },
            { emoji: '😌', name: 'Calm' },
            { emoji: '🤔', name: 'Thoughtful' }
        ];
        this.tagOptions = [
            'Work', 'Fitness', 'Food', 'Social', 'Self-care', 'Sleep', 'Energy'
        ];
    }

    render() {
        if (!this.journalSection) {
            console.error("JournalManager: Target section 'journal-section' not found.");
            return;
        }
        // The HTML for the product promotion and features is static in index.html.
        // We only render the dynamic journal form and history.
        this.renderJournalForm();
        this.loadJournalEntries(); // Load entries after the form is rendered
    }

    renderJournalForm() {
        const journalContentDiv = document.createElement('div');
        journalContentDiv.className = 'journal-content-wrapper'; // A new wrapper for dynamic content
        journalContentDiv.innerHTML = `
            <div class="journal-form glass-card">
                <h2>Daily Journal & Planner</h2>
                <div class="form-group">
                    <label for="journal-date">Date:</label>
                    <input type="date" id="journal-date" class="cyber-input" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <div id="mood-selector" class="form-group">
                    <h4>How are you feeling?</h4>
                    <div class="mood-grid">
                        ${this.moodOptions.map(mood => `
                            <button type="button" class="mood-btn" data-mood="${mood.name}" aria-label="Select mood: ${mood.name}">
                                ${mood.emoji}
                                <span class="mood-name">${mood.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <h4>Add Tags (Optional):</h4>
                    <div id="journal-tag-selector" class="tag-grid">
                        ${this.tagOptions.map(tag => `
                            <button type="button" class="journal-tag btn-secondary small-btn" data-tag="${tag}">${tag}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label for="journal-content">What's on your mind?</label>
                    <textarea id="journal-content" class="cyber-input" rows="8" placeholder="Write about your day, thoughts, feelings, or plans..."></textarea>
                </div>

                <button type="button" id="save-journal" class="btn">Save Journal Entry</button>
            </div>

            <h3>Your Past Entries</h3>
            <div id="journal-history" class="journal-history">
                </div>
        `;
        // Append the dynamically created content to the journal section
        // We assume the product promotion/features are already in the HTML and we add *after* them
        // Or you could clear journalSection.innerHTML and append everything if you want to control all content.
        // For now, let's append it to keep existing static content.
        this.journalSection.appendChild(journalContentDiv);
        this.setupEventListeners();
    }


    setupEventListeners() {
        // Ensure elements exist before adding listeners
        const saveButton = document.getElementById('save-journal');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveJournalEntry());
        }

        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e));
        });

        const tagButtons = document.querySelectorAll('.journal-tag');
        tagButtons.forEach(tagBtn => {
            tagBtn.addEventListener('click', (e) => this.toggleTag(e));
        });

        // Event delegation for edit/delete buttons on journal history
        const journalHistory = document.getElementById('journal-history');
        if (journalHistory) {
            journalHistory.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-entry-btn')) {
                    const dateToDelete = e.target.dataset.date;
                    if (confirm('Are you sure you want to delete this entry?')) {
                        this.deleteJournalEntry(dateToDelete);
                    }
                } else if (e.target.classList.contains('edit-entry-btn')) {
                    const entryData = e.target.dataset;
                    this.editJournalEntry(entryData);
                }
            });
        }
    }

    selectMood(e) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
    }

    toggleTag(e) {
        e.currentTarget.classList.toggle('selected');
    }

    saveJournalEntry() {
        const dateInput = document.getElementById('journal-date');
        const contentInput = document.getElementById('journal-content');
        const selectedMoodBtn = document.querySelector('.mood-btn.selected');

        const entry = {
            date: dateInput.value,
            mood: selectedMoodBtn ? selectedMoodBtn.dataset.mood : null,
            content: contentInput.value.trim(),
            tags: this.getSelectedTags()
        };

        if (!this.validateEntry(entry)) {
            return;
        }

        let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');

        // Check if an entry for this date already exists and update it
        const existingIndex = entries.findIndex(e => e.date === entry.date);
        if (existingIndex > -1) {
            entries[existingIndex] = entry; // Overwrite existing entry
        } else {
            entries.push(entry); // Add new entry
        }

        localStorage.setItem('journalEntries', JSON.stringify(entries));

        this.clearForm();
        this.loadJournalEntries();
        this.showSaveConfirmation();
    }

    validateEntry(entry) {
        if (!entry.date) {
            alert('Please select a date.');
            return false;
        }
        if (!entry.mood) {
            alert('Please select a mood.');
            return false;
        }
        if (!entry.content) { // content.trim() handles empty string
            alert('Please write something in your journal.');
            return false;
        }
        return true;
    }

    getSelectedTags() {
        return Array.from(document.querySelectorAll('.journal-tag.selected'))
            .map(tag => tag.dataset.tag);
    }

    loadJournalEntries() {
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        const container = document.getElementById('journal-history');

        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">No journal entries yet. Start by saving your first entry!</p>';
            return;
        }

        entries.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending by date

        container.innerHTML = entries.map(entry => this.createEntryHTML(entry)).join('');
    }

    createEntryHTML(entry) {
        const moodEmoji = this.moodOptions.find(m => m.name === entry.mood)?.emoji || '';
        const formattedDate = new Date(entry.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Stringify tags for data-tags attribute
        const tagsString = entry.tags ? entry.tags.join(',') : '';
        const tagsHtml = entry.tags && entry.tags.length ? `
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : '';

        return `
            <div class="journal-entry glass-card">
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                    <span class="entry-mood" role="img" aria-label="Mood: ${entry.mood}">${moodEmoji} ${entry.mood}</span>
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

    clearForm() {
        document.getElementById('journal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('journal-content').value = '';
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.journal-tag').forEach(tag => tag.classList.remove('selected'));
    }

    deleteJournalEntry(date) {
        let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries = entries.filter(entry => entry.date !== date);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        this.loadJournalEntries(); // Re-render the list
        this.showSaveConfirmation('Journal entry deleted!'); // Re-use confirmation for deletion
    }

    editJournalEntry(entryData) {
        // Populate the form with the selected entry's data
        document.getElementById('journal-date').value = entryData.date;
        document.getElementById('journal-content').value = decodeURIComponent(entryData.content);

        // Select the mood button
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.mood === entryData.mood) {
                btn.classList.add('selected');
            }
        });

        // Select the tags
        const tags = entryData.tags ? entryData.tags.split(',') : [];
        document.querySelectorAll('.journal-tag').forEach(tagBtn => {
            tagBtn.classList.remove('selected');
            if (tags.includes(tagBtn.dataset.tag)) {
                tagBtn.classList.add('selected');
            }
        });

        // Scroll to the form
        this.journalSection.querySelector('.journal-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.showSaveConfirmation('Entry loaded for editing.', 'info');
    }


    showSaveConfirmation(message = 'Journal entry saved!', type = 'success') {
        const confirmation = document.createElement('div');
        confirmation.className = `journal-saved-confirmation notification-popup ${type}`; // Add type for different styles
        confirmation.textContent = message;
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
