const questions = [
  {
    question: "Which phase are you currently in?",
    answers: [
      { text: "Menstrual", phase: "menstrual" },
      { text: "Follicular", phase: "follicular" },
      { text: "Ovulation", phase: "ovulation" },
      { text: "Luteal", phase: "luteal" }
    ]
  },
  {
    question: "How's your energy today?",
    answers: [
      { text: "Low", phase: "menstrual" },
      { text: "Buzzy & creative", phase: "follicular" },
      { text: "Sociable", phase: "ovulation" },
      { text: "Tired but focused", phase: "luteal" }
    ]
  },
  {
    question: "What kind of tasks feel right today?",
    answers: [
      { text: "Deep rest & journaling", phase: "menstrual" },
      { text: "Brainstorming & ideas", phase: "follicular" },
      { text: "Meetings, calls, collabs", phase: "ovulation" },
      { text: "Finishing tasks", phase: "luteal" }
    ]
  }
];

let currentQuestionIndex = 0;

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

function startQuiz() {
  currentQuestionIndex = 0;
  nextButton.innerText = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  questionEl.innerText = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("download");
    button.classList.add("floating");
    button.addEventListener("click", () => {
      nextButton.style.display = "block";
    });
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showSummary();
  }
});

function showSummary() {
  resetState();
  questionEl.innerText = "✨ Based on your answers, focus on rest, planning or creative action today. ✨";
  nextButton.innerText = "Restart";
  nextButton.style.display = "block";
  nextButton.onclick = () => {
    startQuiz();
  };
}

startQuiz();
