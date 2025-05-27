const questions = [
    {
        question: "Which phase are you currently in?",
        answers: [
            { text: "Menstrual (Day 1-5)", phase: "menstrual", info: "Time for rest and reflection" },
            { text: "Follicular (Day 6-14)", phase: "follicular", info: "Energy is building" },
            { text: "Ovulation (Day 14-17)", phase: "ovulation", info: "Peak energy and confidence" },
            { text: "Luteal (Day 18-28)", phase: "luteal", info: "Winding down and organizing" }
        ]
    },
    {
        question: "How's your energy level today?",
        answers: [
            { text: "Low & introspective", phase: "menstrual", info: "Perfect for gentle activities" },
            { text: "Rising & creative", phase: "follicular", info: "Great for starting new projects" },
            { text: "High & outgoing", phase: "ovulation", info: "Ideal for social activities" },
            { text: "Steady but decreasing", phase: "luteal", info: "Focus on completion tasks" }
        ]
    },
    {
        question: "What's your current mood?",
        answers: [
            { text: "Reflective & quiet", phase: "menstrual" },
            { text: "Optimistic & excited", phase: "follicular" },
            { text: "Confident & social", phase: "ovulation" },
            { text: "Detail-oriented & analytical", phase: "luteal" }
        ]
    },
    {
        question: "How's your focus today?",
        answers: [
            { text: "Dreamy & intuitive", phase: "menstrual" },
            { text: "Creative & scattered", phase: "follicular" },
            { text: "Sharp & clear", phase: "ovulation" },
            { text: "Detail-oriented & precise", phase: "luteal" }
        ]
    },
    {
        question: "What type of exercise feels right?",
        answers: [
            { text: "Gentle yoga or rest", phase: "menstrual" },
            { text: "Light cardio & dance", phase: "follicular" },
            { text: "High intensity & strength", phase: "ovulation" },
            { text: "Moderate strength & pilates", phase: "luteal" }
        ]
    },
    {
        question: "What's your ideal work environment today?",
        answers: [
            { text: "Quiet & solitary", phase: "menstrual" },
            { text: "Creative & inspiring", phase: "follicular" },
            { text: "Collaborative & social", phase: "ovulation" },
            { text: "Organized & structured", phase: "luteal" }
        ]
    },
    {
        question: "What kind of tasks appeal to you?",
        answers: [
            { text: "Planning & reflection", phase: "menstrual" },
            { text: "Brainstorming & creating", phase: "follicular" },
            { text: "Presenting & networking", phase: "ovulation" },
            { text: "Organizing & completing", phase: "luteal" }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let selectedPhase = null;

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("quiz-progress");

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    nextButton.innerText = "Next";
    showQuestion();
    updateProgressBar();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionEl.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("download", "floating");
        button.dataset.phase = answer.phase;
        
        button.addEventListener("click", () => {
            selectAnswer(answer);
            highlightSelected(button);
            nextButton.disabled = false;
        });
        
        answerButtons.appendChild(button);
    });
}

function selectAnswer(answer) {
    userAnswers[currentQuestionIndex] = answer.phase;
    selectedPhase = answer.phase;
    nextButton.style.display = "block";
}

function highlightSelected(selectedButton) {
    const buttons = answerButtons.getElementsByTagName("button");
    for (let button of buttons) {
        button.classList.remove("selected");
    }
    selectedButton.classList.add("selected");
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function resetState() {
    nextButton.style.display = "none";
    nextButton.disabled = true;
    answerButtons.innerHTML = "";
    selectedPhase = null;
}

function analyzePhaseTrend() {
    const phaseCounts = userAnswers.reduce((acc, phase) => {
        acc[phase] = (acc[phase] || 0) + 1;
        return acc;
    }, {});
    
    return Object.entries(phaseCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
}

function getPhaseRecommendations(phase) {
    const recommendations = {
        menstrual: {
            focus: "Rest and reflection",
            activities: "Journaling, meditation, gentle movement",
            work: "Planning, research, independent work"
        },
        follicular: {
            focus: "New beginnings and creativity",
            activities: "Brainstorming, learning new skills, light exercise",
            work: "Starting projects, creative tasks, planning"
        },
        ovulation: {
            focus: "Communication and connection",
            activities: "Networking, presentations, high-energy exercise",
            work: "Team projects, client meetings, public speaking"
        },
        luteal: {
            focus: "Completion and organization",
            activities: "Organizing, detailed work, moderate exercise",
            work: "Finishing projects, administrative tasks, evaluation"
        }
    };
    
    return recommendations[phase];
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        updateProgressBar();
    } else {
        showSummary();
    }
});

function showSummary() {
    resetState();
    const dominantPhase = analyzePhaseTrend();
    const recommendations = getPhaseRecommendations(dominantPhase);
    
    questionEl.innerHTML = `
        <h3>✨ Your Cycle Sync Results ✨</h3>
        <p>Based on your answers, you're showing strong ${dominantPhase} phase tendencies.</p>
        <div class="recommendations">
            <p><strong>Focus areas:</strong> ${recommendations.focus}</p>
            <p><strong>Suggested activities:</strong> ${recommendations.activities}</p>
            <p><strong>Work optimization:</strong> ${recommendations.work}</p>
        </div>
    `;
    
    nextButton.innerText = "Start Over";
    nextButton.style.display = "block";
    nextButton.onclick = startQuiz;
}

// Initialize quiz
startQuiz();

