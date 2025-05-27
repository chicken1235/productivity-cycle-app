// journal.js

class JournalManager {
    constructor() {
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
        ]; // Example tags
        this.initializeJournal();
    }

    initializeJournal() {
        this.renderJournalForm(); // Render the full journal form
        this.setupEventListeners();
        this.loadJournalEntries();
    }

    renderJournalForm() {
        const journalSection = document.getElementById('journal-section');
        if (!journalSection) return;

        journalSection.innerHTML = `
            <div class="container">
                <h2>Daily Journal & Planner</h2>
                <div class="journal-form glass-card">
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
                                <button type="button" class="journal-tag cyber-button-sm" data-tag="${tag}">${tag}</button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="journal-content">What's on your mind?</label>
                        <textarea id="journal-content" class="cyber-input" rows="8" placeholder="Write about your day, thoughts, feelings, or plans..."></textarea>
                    </div>

                    <button type="button" id="save-journal" class="cyber-button">Save Journal Entry</button>
                </div>

                <h3>Your Past Entries</h3>
                <div id="journal-history" class="journal-history">
                    </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('save-journal').addEventListener('click', () => this.saveJournalEntry());

        // Mood selector event listeners
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e));
        });

        // Tag selector event listeners
        document.querySelectorAll('.journal-tag').forEach(tagBtn => {
            tagBtn.addEventListener('click', (e) => this.toggleTag(e));
        });
    }

    selectMood(e) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        e.currentTarget.classList.add('selected'); // Use currentTarget to ensure the button itself is selected
    }

    toggleTag(e) {
        e.currentTarget.classList.toggle('selected');
    }

    saveJournalEntry() {
        const entry = {
            date: document.getElementById('journal-date').value,
            mood: document.querySelector('.mood-btn.selected')?.dataset.mood,
            content: document.getElementById('journal-content').value,
            tags: this.getSelectedTags()
        };

        if (!this.validateEntry(entry)) {
            return;
        }

        let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries.push(entry);
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
        if (!entry.content.trim()) {
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

        if (!container) return; // Ensure container exists

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">No journal entries yet.</p>';
            return;
        }

        // Sort entries by date in descending order
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = entries.map(entry => this.createEntryHTML(entry)).join('');
    }

    createEntryHTML(entry) {
        const moodEmoji = this.moodOptions.find(m => m.name === entry.mood)?.emoji || '';
        const formattedDate = new Date(entry.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="journal-entry glass-card">
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                    <span class="entry-mood" role="img" aria-label="Mood: ${entry.mood}">${moodEmoji} ${entry.mood}</span>
                </div>
                <div class="entry-content">${entry.content}</div>
                ${entry.tags.length ? `
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="entry-actions">
                    <button class="edit-entry-btn cyber-button-sm" data-date="${entry.date}" data-mood="${entry.mood}" data-content="${entry.content}" data-tags="${entry.tags.join(',')}">Edit</button>
                    <button class="delete-entry-btn cyber-button-sm" data-date="${entry.date}">Delete</button>
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

    showSaveConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'journal-saved-confirmation notification-popup';
        confirmation.textContent = 'Journal entry saved!';
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}

