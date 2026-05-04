const QUESTIONS_FILE = "data/questions.json";
const PASS_THRESHOLD = 50;
const STORAGE_KEY = "webFoundationsQuizAttempts";
const REWARD_API = "https://api.adviceslip.com/advice";

const quizForm = document.getElementById("quizForm");
const loadingNote = document.getElementById("loadingNote");
const errorBox = document.getElementById("errorBox");
const submitQuizBtn = document.getElementById("submitQuizBtn");
const resetQuizBtn = document.getElementById("resetQuizBtn");
const resultCard = document.getElementById("resultCard");
const scoreValue = document.getElementById("scoreValue");
const percentageValue = document.getElementById("percentageValue");
const passFailValue = document.getElementById("passFailValue");
const passMessage = document.getElementById("passMessage");
const rewardBox = document.getElementById("rewardBox");
const rewardText = document.getElementById("rewardText");
const attemptList = document.getElementById("attemptList");
const historyEmptyState = document.getElementById("historyEmptyState");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const answeredCount = document.getElementById("answeredCount");
const totalCount = document.getElementById("totalCount");
const progressBar = document.getElementById("progressBar");
const quizStatusPill = document.getElementById("quizStatusPill");

let quizQuestions = [];
let hasStartedQuiz = false;
let hasSubmittedQuiz = false;
// Randomise question order on every quiz load
function shuffleArray(items) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}
//These two small functions manage the error message box.
function showError(message) {
  errorBox.style.display = "block";
  errorBox.textContent = message;
}

function clearError() {
  errorBox.style.display = "none";
  errorBox.textContent = "";
}
//Loads quiz questions from the local JSON file using AJAX/fetch
async function loadQuestions() {
  clearError();
  loadingNote.style.display = "block";
  loadingNote.textContent = "Loading questions...";

  try {
    const response = await fetch(QUESTIONS_FILE, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Could not load data/questions.json");
    }

    const data = await response.json();

    if (!Array.isArray(data.questions) || data.questions.length < 10) {
      throw new Error("questions.json must contain at least 10 questions.");
    }

    quizQuestions = shuffleArray(data.questions);
    renderQuestions(quizQuestions);
    loadingNote.style.display = "none";
    totalCount.textContent = String(quizQuestions.length);
    updateAnsweredProgress();
  } catch (error) {
    loadingNote.style.display = "none";
    showError(error.message);
  }
}
// Render quiz questions dynamically into the DOM
function renderQuestions(questions) {
  quizForm.innerHTML = "";

  questions.forEach((question, index) => {
    const article = document.createElement("article");
    article.className = "question-card";
    article.dataset.questionId = question.id;

    const badge = document.createElement("div");
    badge.className = "question-number";
    badge.textContent = `Question ${index + 1}`;

    const heading = document.createElement("h3");
    heading.className = "question-text";
    heading.textContent = question.question;

    article.appendChild(badge);
    article.appendChild(heading);

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option-label";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = question.id;
      input.value = String(optionIndex);
      input.className = "form-check-input";
      input.addEventListener("change", handleQuizStarted);
      input.addEventListener("change", updateAnsweredProgress);

      const span = document.createElement("span");
      span.className = "option-text";
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      article.appendChild(label);
    });

    quizForm.appendChild(article);
  });
}
//Detecting quiz start
function handleQuizStarted() {
  if (!hasStartedQuiz) {
    hasStartedQuiz = true;
    quizStatusPill.textContent = "Status: In progress";
  }
}
//browser warning if the user tries to leave after starting but before submitting
function beforeUnloadHandler(event) {
  if (hasStartedQuiz && !hasSubmittedQuiz) {
    event.preventDefault();
    event.returnValue = "";
  }
}
// Track whether the user has started the quiz so beforeunload can be triggered

//calculates how many questions the user has answered 
function updateAnsweredProgress() {
  const answered = quizQuestions.filter((question) => {
    const selected = quizForm.querySelector(`input[name="${question.id}"]:checked`);
    return Boolean(selected);
  }).length;

  answeredCount.textContent = String(answered);
  const total = quizQuestions.length || 1;
  const percentage = Math.round((answered / total) * 100);
  progressBar.style.width = `${percentage}%`;
}
//function checks whether every question has been answered
function validateQuiz() {
  let allAnswered = true;

  quizQuestions.forEach((question) => {
    const questionCard = quizForm.querySelector(`[data-question-id="${question.id}"]`);
    const selected = quizForm.querySelector(`input[name="${question.id}"]:checked`);

    if (!selected) {
      allAnswered = false;
      questionCard.classList.add("unanswered");
    } else {
      questionCard.classList.remove("unanswered");
    }
  });

  if (!allAnswered) {
    showError("Please answer every question before submitting.");
  } else {
    clearError();
  }

  return allAnswered;
}

function calculateScore() {
  let score = 0;

  quizQuestions.forEach((question) => {
    const selected = quizForm.querySelector(`input[name="${question.id}"]:checked`);
    if (selected && Number(selected.value) === question.answer) {
      score += 1;
    }
  });

  return score;
}
// Fetch reward content from a public API after a passing result

function displayResult(score) {
  const total = quizQuestions.length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= PASS_THRESHOLD;

  scoreValue.textContent = `${score}/${total}`;
  percentageValue.textContent = `${percentage}%`;
  passFailValue.textContent = passed ? "Pass" : "Fail";
  resultCard.style.display = "block";

  passMessage.className = `pass-message ${passed ? "pass" : "fail"}`;
  passMessage.textContent = passed
    ? "Excellent work. You passed the quiz and unlocked a reward."
    : "You did not reach the pass mark this time.";

  return { percentage, passed };
}

async function loadReward() {
  rewardBox.style.display = "block";
  rewardText.textContent = "Fetching your reward...";

  try {
    const response = await fetch(REWARD_API, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Reward API request failed.");
    }

    const data = await response.json();

    if (!data || !data.slip || typeof data.slip.advice !== "string") {
      throw new Error("Invalid reward API response.");
    }

    rewardText.textContent = `Reward message: “${data.slip.advice}”`;
  } catch (error) {
    rewardText.textContent = "You passed the quiz. Reward unlocked, but the API message could not be loaded.";
  }
}
//function gets previous attempts from localStorage
function getStoredAttempts() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];

    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) return [];

    return parsedData;
  } catch (error) {
    return [];
  }
}
//saves the newest quiz attempt
function saveAttempt(attempt) {
  try {
    const attempts = getStoredAttempts();
    attempts.unshift(attempt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch (error) {
    showError("Result calculated, but local storage is unavailable.");
  }
}

function renderAttemptHistory() {
  const attempts = getStoredAttempts();
  attemptList.innerHTML = "";

  if (attempts.length === 0) {
    historyEmptyState.style.display = "block";
    return;
  }

  historyEmptyState.style.display = "none";

  attempts.forEach((attempt, index) => {
    const card = document.createElement("article");
    card.className = "attempt-item";

    const head = document.createElement("div");
    head.className = "attempt-head";

    const title = document.createElement("div");
    title.className = "attempt-title";
    title.textContent = `Attempt ${attempts.length - index}`;

    const date = document.createElement("div");
    date.className = "attempt-date";
    date.textContent = attempt.dateTime;

    head.appendChild(title);
    head.appendChild(date);

    const meta = document.createElement("p");
    meta.className = "attempt-meta";
    meta.textContent = `Score: ${attempt.score}/${attempt.total} • Percentage: ${attempt.percentage}% • Result: ${attempt.passed ? "Pass" : "Fail"}`;

    card.appendChild(head);
    card.appendChild(meta);
    attemptList.appendChild(card);
  });
}

function renderAttemptChart() {
    const canvas = document.getElementById("attemptHistoryChart");
    if (!canvas) return;
  
    const context = canvas.getContext("2d");
    const attempts = getStoredAttempts().slice().reverse();
    const width = canvas.width;
    const height = canvas.height;
  
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, width, height);
  
    if (attempts.length === 0) {
      context.fillStyle = "#64748b";
      context.font = "14px Inter";
      context.fillText("No attempts yet", 20, 40);
      return;
    }
  
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const step = chartWidth / attempts.length;
    const barWidth = Math.max(24, step - 14);
  
    attempts.forEach((attempt, index) => {
      const x = padding + index * step + 7;
      const barHeight = (attempt.percentage / 100) * chartHeight;
      const y = height - padding - barHeight;
  
      context.fillStyle = attempt.passed ? "#2a9d8f" : "#f4a261";
      context.fillRect(x, y, barWidth, barHeight);
  
      context.fillStyle = "#334155";
      context.font = "12px Inter";
      context.fillText(String(attempt.percentage) + "%", x, y - 6);
    });
  
    context.strokeStyle = "#cbd5e1";
    context.beginPath();
    context.moveTo(padding, height - padding);
    context.lineTo(width - padding, height - padding);
    context.stroke();
  }

function resetQuizAnswers() {
  quizForm.reset();
  resultCard.style.display = "none";
  rewardBox.style.display = "none";
  clearError();

  const questionCards = quizForm.querySelectorAll(".question-card");
  questionCards.forEach((card) => card.classList.remove("unanswered"));

  hasStartedQuiz = false;
  hasSubmittedQuiz = false;
  quizStatusPill.textContent = "Status: Not started";
  updateAnsweredProgress();
}

submitQuizBtn.addEventListener("click", async function () {
  if (!quizQuestions.length) {
    showError("Questions have not loaded yet.");
    return;
  }

  const isValid = validateQuiz();
  if (!isValid) return;

  hasSubmittedQuiz = true;
  quizStatusPill.textContent = "Status: Submitted";

  const score = calculateScore();
  const result = displayResult(score);

  const attempt = {
    score,
    total: quizQuestions.length,
    percentage: result.percentage,
    passed: result.passed,
    dateTime: new Date().toLocaleString()
  };

  saveAttempt(attempt);
  renderAttemptHistory();
  renderAttemptChart();

  if (result.passed) {
    await loadReward();
  } else {
    rewardBox.style.display = "none";
  }
});

resetQuizBtn.addEventListener("click", resetQuizAnswers);

clearHistoryBtn.addEventListener("click", function () {
  localStorage.removeItem(STORAGE_KEY);
  renderAttemptHistory();
  renderAttemptChart();
});

window.addEventListener("beforeunload", beforeUnloadHandler);

window.addEventListener("DOMContentLoaded", function () {
  renderAttemptHistory();
  renderAttemptChart();
  loadQuestions();
});