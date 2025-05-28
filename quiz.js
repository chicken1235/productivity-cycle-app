// quiz.js

class QuizManager {
    constructor() {
        this.section = document.getElementById('quiz-section');
        this.quizContentDiv = document.getElementById('quiz-content');
        this.currentQuestionIndex = 0;
        this.quizData = [
            {
                question: "What was the first day of your last period (LMP)?",
                type: "date",
                id: "lmpDate",
                ariaLabel: "Date of last menstrual period"
            },
            {
                question: "How long is your typical menstrual cycle (average number of days from the start of one period to the start of the next)?",
                type: "number",
                id: "cycleLength",
                min: 21,
                max: 35,
                ariaLabel: "Average cycle length in days, typically between 21 and 35."
            },
            {
                question: "How would you describe your energy levels during the first few days after your period ends?",
                type: "radio",
                id: "postPeriodEnergy",
                options: [
                    { value: "low", label: "Low, I need to rest" },
                    { value: "moderate", label: "Moderate, picking up" },
                    { value: "high", label: "High, ready to go" }
                ],
                ariaLabel: "Energy levels after period ends"
            },
            {
                question: "Do you experience a noticeable shift in mood or energy around mid-cycle (roughly day 14)?",
                type: "radio",
                id: "midCycleShift",
                options: [
                    { value: "yes_positive", label: "Yes, usually a positive burst of energy/mood" },
                    { value: "yes_negative", label: "Yes, usually a dip or irritability" },
                    { value: "no_noticeable", label: "Not particularly noticeable" }
                ],
                ariaLabel: "Mid-cycle mood or energy shift"
            }
        ];
        this.userAnswers = {};
    }

    render() {
        if (!this.section || !this.quizContentDiv) {
            console.error("QuizManager: Required DOM elements for quiz not found.");
            return;
        }
        this.loadQuestion();
    }

    loadQuestion() {
        if (this.currentQuestionIndex < this.quizData.length) {
            const questionData = this.quizData[this.currentQuestionIndex];
            let inputHtml = '';

            switch (questionData.type) {
                case 'date':
                    inputHtml = `<input type="date" id="${questionData.id}" name="${questionData.id}" class="cyber-input" required aria-label="${questionData.ariaLabel}">`;
                    break;
                case 'number':
                    inputHtml = `<input type="number" id="${questionData.id}" name="${questionData.id}" class="cyber-input" min="${questionData.min}" max="${questionData.max}" required aria-label="${questionData.ariaLabel}">`;
                    break;
                case 'radio':
                    inputHtml = questionData.options.map(option => `
                        <label>
                            <input type="radio" name="${questionData.id}" value="${option.value}" required>
                            ${option.label}
                        </label>
                    `).join('');
                    break;
            }

            this.quizContentDiv.innerHTML = `
                <div class="quiz-question-container glass-card">
                    <p class="quiz-question-text">${questionData.question}</p>
                    <div class="quiz-input-area">${inputHtml}</div>
                    <button id="quizNextBtn" class="btn">Next</button>
                </div>
            `;
            this.addQuestionEventListeners();
        } else {
            this.showResults();
        }
    }

    addQuestionEventListeners() {
        const nextBtn = this.quizContentDiv.querySelector('#quizNextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNextQuestion());
        }
    }

    handleNextQuestion() {
        const questionData = this.quizData[this.currentQuestionIndex];
        let answer = null;
        if (questionData.type === 'radio') {
            const selectedRadio = this.quizContentDiv.querySelector(`input[name="${questionData.id}"]:checked`);
            if (selectedRadio) {
                answer = selectedRadio.value;
            }
        } else {
            const inputElement = this.quizContentDiv.querySelector(`#${questionData.id}`);
            if (inputElement) {
                answer = inputElement.value;
            }
        }

        if (answer) {
            this.userAnswers[questionData.id] = answer;
            this.currentQuestionIndex++;
            this.loadQuestion();
        } else {
            alert('Please answer the question before proceeding.');
        }
    }

    showResults() {
        let resultsHtml = `<h3>Your Cycle Insights:</h3><p>Based on your answers, here's a preliminary understanding of your cycle:</p><ul>`;

        const lmp = this.userAnswers.lmpDate ? new Date(this.userAnswers.lmpDate) : null;
        const cycleLength = parseInt(this.userAnswers.cycleLength);
        const today = new Date();
        let cycleDay = 'N/A';
        let currentPhase = 'Uncertain';

        if (lmp && cycleLength) {
            // Reset time for accurate date difference
            lmp.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today.getTime() - lmp.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            cycleDay = (diffDays % cycleLength) + 1; // Calculate current cycle day

            // Basic phase approximation
            if (cycleDay >= 1 && cycleDay <= 5) {
                currentPhase = "Menstrual Phase";
            } else if (cycleDay > 5 && cycleDay <= 13) {
                currentPhase = "Follicular Phase";
            } else if (cycleDay >= 14 && cycleDay <= 16) {
                currentPhase = "Ovulatory Phase";
            } else if (cycleDay > 16 && cycleDay <= cycleLength) {
                currentPhase = "Luteal Phase";
            }
            resultsHtml += `<li>Your current cycle day is approximately: <strong>Day ${cycleDay}</strong></li>`;
            resultsHtml += `<li>Your estimated current phase is: <strong>${currentPhase}</strong></li>`;

            // Update the header cycle tracker
            document.getElementById('cycleDay').textContent = cycleDay;
            document.getElementById('currentPhase').textContent = currentPhase;

            // Save basic cycle info to localStorage
            localStorage.setItem('cycleStartDate', this.userAnswers.lmpDate);
            localStorage.setItem('cycleAverageLength', cycleLength);
            localStorage.setItem('currentCycleDay', cycleDay);
            localStorage.setItem('currentCyclePhase', currentPhase);

        } else {
            resultsHtml += `<li>Please complete the date and cycle length questions for a cycle day estimate.</li>`;
        }

        if (this.userAnswers.postPeriodEnergy) {
            resultsHtml += `<li>You describe your post-period energy as: <strong>${this.userAnswers.postPeriodEnergy}</strong></li>`;
        }
        if (this.userAnswers.midCycleShift) {
            resultsHtml += `<li>You notice a mid-cycle shift: <strong>${this.userAnswers.midCycleShift}</strong></li>`;
        }

        resultsHtml += `</ul>
            <p>This is a starting point! Continue tracking your symptoms to gain deeper insights into your unique cycle.</p>
            <button id="restartQuizBtn" class="btn">Restart Quiz</button>
        `;
        this.quizContentDiv.innerHTML = resultsHtml;

        const restartBtn = this.quizContentDiv.querySelector('#restartQuizBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartQuiz());
        }
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.loadQuestion();
    }
}
