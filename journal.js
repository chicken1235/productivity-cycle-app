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
        this.initializeJournal();
    }

    initializeJournal() {
        this.renderMoodSelector();
        this.setupEventListeners();
        this.loadJournalEntries();
    }

    renderMoodSelector() {
        const container = document.getElementById('mood-selector');
        container.innerHTML = `
            <h4>How are you feeling?</h4>
            <div class="mood-grid">
                ${this.moodOptions.map(mood => `
                    <button class="mood-btn" data-mood="${mood.name}">
                        ${mood.emoji}
                        <span class="mood-name">${mood.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('save-journal').addEventListener('click', () => this.saveJournalEntry());
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e));
        });
    }

    selectMood(e) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.closest('.mood-btn').classList.add('selected');
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
            alert('Please select a date');
            return false;
        }
        if (!entry.mood) {
            alert('Please select a mood');
            return false;
        }
        if (!entry.content.trim()) {
            alert('Please write something in your journal');
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
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">No journal entries yet</p>';
            return;
        }

        container.innerHTML = entries.reverse().map(entry => this.createEntryHTML(entry)).join('');
    }

    createEntryHTML(entry) {
        return `
            <div class="journal-entry">
                <div class="entry-header">
                    <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
                    <span class="entry-mood">${this.moodOptions.find(m => m.name === entry.mood)?.emoji || ''}</span>
                </div>
                <div class="entry-content">${entry.content}</div>
                ${entry.tags.length ? `
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    clearForm() {
        document.getElementById('journal-content').value = '';
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.journal-tag').forEach(tag => tag.classList.remove('selected'));
    }

    showSaveConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'journal-saved-confirmation';
        confirmation.textContent = 'Journal entry saved!';
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
}
