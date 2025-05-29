// quiz.js

class QuizManager {
    constructor() {
        this.section = document.getElementById('quiz-section');
        this.quizContentDiv = document.getElementById('quiz-content');
        this.currentQuestionIndex = 0;
        this.quizData = [
            {
                question: "When was the first day of your last menstrual period (LMP)?",
                type: "date",
                id: "lmpDate",
                ariaLabel: "Date of your last menstrual period, format year-month-day",
                errorMessage: "Please select your Last Menstrual Period date.",
                validation: (value) => value !== "" && !isNaN(new Date(value)),
                // Add a max date to prevent future dates
                max: new Date().toISOString().split('T')[0] // Today's date
            },
            {
                question: "What's your typical menstrual cycle length? (Average days from the start of one period to the start of the next)",
                type: "number",
                id: "cycleLength",
                min: 21,
                max: 35,
                defaultValue: 28, // Pre-fill for convenience
                ariaLabel: "Average cycle length in days, typically between 21 and 35.",
                errorMessage: "Please enter a valid cycle length between 21 and 35 days.",
                validation: (value) => {
                    const num = parseInt(value, 10);
                    return !isNaN(num) && num >= 21 && num <= 35;
                }
            },
            {
                question: "How do your energy levels feel during the first few days *after* your period ends?",
                type: "radio",
                id: "postPeriodEnergy",
                options: [
                    { value: "low_rest", label: "Low, I need to rest and recharge" },
                    { value: "moderate_picking_up", label: "Moderate, slowly picking up" },
                    { value: "high_ready", label: "High, ready to tackle anything!" }
                ],
                ariaLabel: "Energy levels after period ends",
                errorMessage: "Please select an energy level."
            },
            {
                question: "Do you notice a significant shift in your mood or energy around mid-cycle (roughly day 14)?",
                type: "radio",
                id: "midCycleShift",
                options: [
                    { value: "positive_burst", label: "Yes, usually a positive burst of energy/mood" },
                    { value: "dip_irritability", label: "Yes, often a dip or increased irritability" },
                    { value: "not_noticeable", label: "Not particularly noticeable for me" }
                ],
                ariaLabel: "Mid-cycle mood or energy shift",
                errorMessage: "Please describe your mid-cycle shift."
            },
            {
                question: "How would you describe your typical symptoms in the week before your period starts?",
                type: "checkbox", // New input type for multiple selections
                id: "prePeriodSymptoms",
                options: [
                    { value: "bloating", label: "Bloating" },
                    { value: "cramps", label: "Cramps" },
                    { value: "mood_swings", label: "Mood swings" },
                    { value: "fatigue", label: "Fatigue" },
                    { value: "breast_tenderness", label: "Breast tenderness" },
                    { value: "acne", label: "Acne flare-ups" },
                    { value: "none", label: "None or very mild" }
                ],
                ariaLabel: "Symptoms experienced before period",
                errorMessage: "Please select at least one symptom, or 'None'."
            }
        ];
        this.userAnswers = {}; // Stores answers like { lmpDate: "2024-05-01", cycleLength: 28, ... }
        this.notificationDisplay = null; // To display notifications
    }

    /**
     * Renders the quiz interface.
     */
    render() {
        if (!this.section || !this.quizContentDiv) {
            console.error("QuizManager: Required DOM elements for quiz not found.");
            return;
        }
        // Initialize notification display for user feedback
        this.notificationDisplay = document.getElementById('notification-popup-container') || this.createNotificationContainer();

        this.loadSavedAnswers(); // Attempt to load previous answers
        this.loadQuestion();
    }

    /**
     * Loads the current question into the quiz display or shows results if quiz is complete.
     */
    loadQuestion() {
        if (this.currentQuestionIndex < this.quizData.length) {
            const questionData = this.quizData[this.currentQuestionIndex];
            let inputHtml = '';
            let valueToPreFill = this.userAnswers[questionData.id];

            // Specific handling for date max attribute
            const maxDateAttr = questionData.type === 'date' && questionData.max ? `max="${questionData.max}"` : '';
            // Specific handling for number default value
            const defaultValueAttr = questionData.type === 'number' && questionData.defaultValue !== undefined ? `value="${valueToPreFill || questionData.defaultValue}"` : '';

            switch (questionData.type) {
                case 'date':
                    inputHtml = `<input type="date" id="${questionData.id}" name="${questionData.id}" class="cyber-input" ${maxDateAttr} value="${valueToPreFill || ''}" required aria-label="${questionData.ariaLabel}">`;
                    break;
                case 'number':
                    inputHtml = `<input type="number" id="${questionData.id}" name="${questionData.id}" class="cyber-input" min="${questionData.min}" max="${questionData.max}" ${defaultValueAttr} required aria-label="${questionData.ariaLabel}">`;
                    break;
                case 'radio':
                    inputHtml = `<div role="radiogroup" aria-label="${questionData.ariaLabel}">` + questionData.options.map(option => `
                        <label class="radio-label">
                            <input type="radio" name="${questionData.id}" value="${option.value}" ${valueToPreFill === option.value ? 'checked' : ''} required>
                            <span>${option.label}</span>
                        </label>
                    `).join('') + `</div>`;
                    break;
                case 'checkbox': // New case for checkbox type
                    inputHtml = `<div class="checkbox-group" role="group" aria-label="${questionData.ariaLabel}">` + questionData.options.map(option => {
                        const isChecked = Array.isArray(valueToPreFill) && valueToPreFill.includes(option.value) ? 'checked' : '';
                        return `
                            <label class="checkbox-label">
                                <input type="checkbox" name="${questionData.id}" value="${option.value}" ${isChecked}>
                                <span>${option.label}</span>
                            </label>
                        `;
                    }).join('') + `</div>`;
                    break;
            }

            const isFirstQuestion = this.currentQuestionIndex === 0;
            const paginationText = `${this.currentQuestionIndex + 1} / ${this.quizData.length}`;

            this.quizContentDiv.innerHTML = `
                <div class="quiz-question-container glass-card">
                    <p class="quiz-pagination">${paginationText}</p>
                    <p class="quiz-question-text">${questionData.question}</p>
                    <div class="quiz-input-area">${inputHtml}</div>
                    <div class="quiz-navigation-buttons">
                        <button id="quizBackBtn" class="btn secondary-btn" ${isFirstQuestion ? 'disabled' : ''}>Back</button>
                        <button id="quizNextBtn" class="btn">Next</button>
                    </div>
                </div>
            `;
            this.addQuestionEventListeners();
            this.restoreInputFocus(questionData.id); // Re-focus on input if it exists
        } else {
            this.showResults();
        }
    }

    /**
     * Attaches event listeners for the current question's navigation.
     */
    addQuestionEventListeners() {
        const nextBtn = this.quizContentDiv.querySelector('#quizNextBtn');
        const backBtn = this.quizContentDiv.querySelector('#quizBackBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNextQuestion());
        }
        if (backBtn) {
            backBtn.addEventListener('click', () => this.handleBackQuestion());
        }
    }

    /**
     * Handles navigation to the previous question.
     */
    handleBackQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    /**
     * Handles input validation and navigation to the next question.
     */
    handleNextQuestion() {
        const questionData = this.quizData[this.currentQuestionIndex];
        let answer = null;

        if (questionData.type === 'radio') {
            const selectedRadio = this.quizContentDiv.querySelector(`input[name="${questionData.id}"]:checked`);
            answer = selectedRadio ? selectedRadio.value : null;
        } else if (questionData.type === 'checkbox') {
            const selectedCheckboxes = Array.from(this.quizContentDiv.querySelectorAll(`input[name="${questionData.id}"]:checked`)).map(cb => cb.value);
            answer = selectedCheckboxes.length > 0 ? selectedCheckboxes : null;
            if (selectedCheckboxes.includes('none') && selectedCheckboxes.length > 1) {
                // If 'none' is selected along with other symptoms, prioritize 'none'
                answer = ['none'];
            }
        } else {
            const inputElement = this.quizContentDiv.querySelector(`#${questionData.id}`);
            answer = inputElement ? inputElement.value.trim() : null;
        }

        // Validate the answer
        if (questionData.validation && !questionData.validation(answer)) {
            this.showNotification(questionData.errorMessage || "Please provide a valid answer.", 'error');
            return; // Stop if validation fails
        }
        if (!answer) { // Fallback for basic required check if no specific validation
            this.showNotification(questionData.errorMessage || "Please answer the question before proceeding.", 'error');
            return;
        }

        this.userAnswers[questionData.id] = answer;
        this.saveAnswers(); // Save after each question
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    /**
     * Displays the quiz results and estimated cycle information.
     */
    showResults() {
        // Calculate cycle data
        const lmp = this.userAnswers.lmpDate ? new Date(this.userAnswers.lmpDate) : null;
        const cycleLength = parseInt(this.userAnswers.cycleLength, 10); // Ensure it's a number
        const today = new Date();
        let cycleDay = 'N/A';
        let currentPhase = 'Uncertain';
        let predictedNextPeriod = 'N/A';

        // Reset time for accurate date difference calculation
        today.setHours(0, 0, 0, 0);

        if (lmp && cycleLength) {
            lmp.setHours(0, 0, 0, 0); // Ensure LMP date is also at start of day

            const diffTime = today.getTime() - lmp.getTime(); // Difference in milliseconds
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Total days passed since LMP

            // Handle cases where LMP is in the future (should be prevented by input max attribute, but safety check)
            if (diffDays < 0) {
                cycleDay = 'N/A (LMP in future)';
                currentPhase = 'N/A';
                predictedNextPeriod = 'N/A';
            } else {
                cycleDay = (diffDays % cycleLength) + 1; // Calculate current cycle day (1-indexed)

                // More nuanced phase approximation based on typical ranges
                // These ranges are often approximate and can vary for individuals
                if (cycleDay >= 1 && cycleDay <= 7) { // Menstrual phase often 3-7 days
                    currentPhase = "Menstrual Phase (Rest & Rejuvenate)";
                } else if (cycleDay > 7 && cycleDay <= (cycleLength - 14)) { // Follicular phase leads up to ovulation
                    currentPhase = "Follicular Phase (Energy & Growth)";
                } else if (cycleDay > (cycleLength - 14) && cycleDay <= (cycleLength - 10)) { // Ovulation around day 14 +/- 2 days
                    currentPhase = "Ovulatory Phase (Peak Energy & Connection)";
                } else if (cycleDay > (cycleLength - 10) && cycleDay <= cycleLength) { // Luteal phase
                    currentPhase = "Luteal Phase (Calm & Reflect)";
                } else {
                    currentPhase = "Phase Unknown (Unusual Cycle Day)"; // Fallback for edge cases
                }

                // Calculate predicted next period date
                const daysUntilNextPeriod = cycleLength - cycleDay + 1; // Days remaining in current cycle
                const nextPeriodDate = new Date(today);
                nextPeriodDate.setDate(today.getDate() + daysUntilNextPeriod);
                predictedNextPeriod = nextPeriodDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }

            // Update the header cycle tracker (assuming these elements exist in your HTML)
            const cycleDayEl = document.getElementById('cycleDay');
            const currentPhaseEl = document.getElementById('currentPhase');
            if (cycleDayEl) cycleDayEl.textContent = cycleDay;
            if (currentPhaseEl) currentPhaseEl.textContent = currentPhase.replace(/\s*\(.*\)/, ''); // Remove descriptive text for header

            // Save basic cycle info to localStorage for other managers to use
            localStorage.setItem('cycleStartDate', this.userAnswers.lmpDate);
            localStorage.setItem('cycleAverageLength', cycleLength);
            localStorage.setItem('currentCycleDay', cycleDay);
            localStorage.setItem('currentCyclePhase', currentPhase);
            localStorage.setItem('predictedNextPeriod', predictedNextPeriod);

        } else {
            this.showNotification("LMP and Cycle Length are required for full cycle insights.", 'warning');
        }

        // Construct results HTML
        let resultsHtml = `
            <div class="quiz-results glass-card">
                <h3>Your Personalized Cycle Insights ✨</h3>
                <p>Based on your answers, here's a preliminary understanding of your unique cycle. Remember, these are estimates – continuous tracking will reveal your most accurate patterns!</p>
                <ul>
                    <li><strong>Last Period Start Date:</strong> ${this.userAnswers.lmpDate || 'Not provided'}</li>
                    <li><strong>Typical Cycle Length:</strong> ${this.userAnswers.cycleLength ? `${this.userAnswers.cycleLength} days` : 'Not provided'}</li>
                    ${lmp && cycleLength ? `
                        <li>Your current cycle day is approximately: <strong>Day ${cycleDay}</strong></li>
                        <li>Your estimated current phase is: <strong>${currentPhase}</strong></li>
                        <li>Your next period is predicted around: <strong>${predictedNextPeriod}</strong></li>
                    ` : ''}
                    <li><strong>Post-Period Energy:</strong> ${this.formatAnswer(this.userAnswers.postPeriodEnergy)}</li>
                    <li><strong>Mid-Cycle Shift:</strong> ${this.formatAnswer(this.userAnswers.midCycleShift)}</li>
                    <li><strong>Pre-Period Symptoms:</strong> ${this.formatAnswer(this.userAnswers.prePeriodSymptoms)}</li>
                </ul>
                <p class="results-guidance">This is a fantastic starting point! The more you track your daily experiences in the Journal, the more accurate and personalized your insights will become.</p>
                <div class="results-actions">
                    <button id="restartQuizBtn" class="btn">Retake Quiz</button>
                    <button id="goToTrackerBtn" class="btn primary-btn">Go to Tracker</button>
                </div>
            </div>
        `;
        this.quizContentDiv.innerHTML = resultsHtml;

        // Add event listeners for results buttons
        this.quizContentDiv.querySelector('#restartQuizBtn')?.addEventListener('click', () => this.restartQuiz());
        this.quizContentDiv.querySelector('#goToTrackerBtn')?.addEventListener('click', () => {
            // Assuming showAndScrollToSection is a global function or accessible
            if (typeof showAndScrollToSection === 'function') {
                showAndScrollToSection('track-section');
            } else {
                window.location.hash = 'track-section';
            }
        });
    }

    /**
     * Formats an answer for display in the results.
     * @param {*} answer - The raw answer value.
     * @returns {string} Formatted string.
     */
    formatAnswer(answer) {
        if (!answer) return 'Not provided';
        if (Array.isArray(answer)) {
            if (answer.includes('none') && answer.length === 1) return 'None or very mild';
            return answer.map(val => {
                // Map values back to more readable labels if needed, or just capitalize
                switch (val) {
                    case 'bloating': return 'Bloating';
                    case 'cramps': return 'Cramps';
                    case 'mood_swings': return 'Mood Swings';
                    case 'fatigue': return 'Fatigue';
                    case 'breast_tenderness': return 'Breast Tenderness';
                    case 'acne': return 'Acne Flare-ups';
                    case 'low_rest': return 'Low, needing rest';
                    case 'moderate_picking_up': return 'Moderate, picking up';
                    case 'high_ready': return 'High, ready to go';
                    case 'positive_burst': return 'Positive burst of energy/mood';
                    case 'dip_irritability': return 'Dip or irritability';
                    case 'not_noticeable': return 'Not particularly noticeable';
                    default: return this.capitalizeFirstLetter(val.replace(/_/g, ' '));
                }
            }).join(', ');
        }
        // Capitalize and replace underscores for single values
        return this.capitalizeFirstLetter(String(answer).replace(/_/g, ' '));
    }


    /**
     * Resets the quiz and loads the first question.
     */
    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        localStorage.removeItem('quizAnswers'); // Clear saved answers
        // Optionally clear cycle data from localStorage if restarting quiz implies fresh start
        localStorage.removeItem('cycleStartDate');
        localStorage.removeItem('cycleAverageLength');
        localStorage.removeItem('currentCycleDay');
        localStorage.removeItem('currentCyclePhase');
        localStorage.removeItem('predictedNextPeriod');

        // Clear header cycle display
        const cycleDayEl = document.getElementById('cycleDay');
        const currentPhaseEl = document.getElementById('currentPhase');
        if (cycleDayEl) cycleDayEl.textContent = 'N/A';
        if (currentPhaseEl) currentPhaseEl.textContent = 'Uncertain';

        this.loadQuestion();
        this.showNotification("Quiz restarted! Let's find your flow.", 'success');
    }

    /**
     * Creates and appends a notification container to the body if it doesn't exist.
     * @returns {HTMLElement} The notification container element.
     */
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-popup-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.pointerEvents = 'none'; // Allow clicks to pass through
        document.body.appendChild(container);
        return container;
    }

    /**
     * Displays a temporary notification message to the user.
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'warning'} type - The type of notification.
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification-popup ${type} glass-card`;
        notification.textContent = message;
        notification.style.pointerEvents = 'auto'; // Make this specific notification clickable/dismissable

        this.notificationDisplay.appendChild(notification);

        // Remove after a few seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 3000);
    }

    /**
     * Saves current quiz answers to localStorage.
     */
    saveAnswers() {
        localStorage.setItem('quizAnswers', JSON.stringify(this.userAnswers));
    }

    /**
     * Loads previous quiz answers from localStorage.
     */
    loadSavedAnswers() {
        const savedAnswers = localStorage.getItem('quizAnswers');
        if (savedAnswers) {
            try {
                this.userAnswers = JSON.parse(savedAnswers);
                // Find the last answered question to resume quiz
                for (let i = this.quizData.length - 1; i >= 0; i--) {
                    if (this.userAnswers.hasOwnProperty(this.quizData[i].id)) {
                        this.currentQuestionIndex = i; // Stay on the last answered question
                        if (i < this.quizData.length - 1) { // If it's not the last question, go to the next one
                           this.currentQuestionIndex++;
                        }
                        break;
                    }
                }
                // If all questions are answered, show results directly
                if (Object.keys(this.userAnswers).length === this.quizData.length) {
                    this.currentQuestionIndex = this.quizData.length;
                }
            } catch (e) {
                console.error("Error parsing saved quiz answers:", e);
                this.userAnswers = {}; // Reset if data is corrupt
            }
        }
    }

    /**
     * Restores focus to the input element after a question loads, for better UX and accessibility.
     * @param {string} inputId - The ID of the input element to focus.
     */
    restoreInputFocus(inputId) {
        requestAnimationFrame(() => {
            const inputElement = this.quizContentDiv.querySelector(`#${inputId}`);
            if (inputElement) {
                inputElement.focus();
            }
        });
    }

    /**
     * Helper to capitalize the first letter of a string.
     * @param {string} str - The input string.
     * @returns {string} The capitalized string.
     */
    capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
