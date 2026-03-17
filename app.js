// DOM Elements
const btnStudy = document.getElementById('btn-study');
const btnQuiz = document.getElementById('btn-quiz');
const studyMode = document.getElementById('study-mode');
const quizMode = document.getElementById('quiz-mode');
const tableContainer = document.getElementById('table-container');

// Quiz Elements
const qNum1 = document.getElementById('q-num1');
const qNum2 = document.getElementById('q-num2');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score-display');
const starsContainer = document.getElementById('stars-container');
const feedbackMessage = document.getElementById('feedback-message');
const answerBox = document.querySelector('.answer-box');

// State
let score = 0;
let currentAnswer = 0;
let streak = 0;

// Initialize App
function init() {
    generateStudyTables();
    setupEventListeners();
    setTimeout(startNewQuiz, 500); // Start quiz logic in background
}

// Event Listeners
function setupEventListeners() {
    btnStudy.addEventListener('click', () => switchMode('study'));
    btnQuiz.addEventListener('click', () => {
        switchMode('quiz');
        if (qNum1.innerText === '?') {
            startNewQuiz();
        }
    });
}

function switchMode(mode) {
    if (mode === 'study') {
        btnStudy.classList.add('active');
        btnQuiz.classList.remove('active');
        studyMode.classList.remove('hidden-mode');
        studyMode.classList.add('active-mode');
        quizMode.classList.remove('active-mode');
        quizMode.classList.add('hidden-mode');
    } else {
        btnQuiz.classList.add('active');
        btnStudy.classList.remove('active');
        quizMode.classList.remove('hidden-mode');
        quizMode.classList.add('active-mode');
        studyMode.classList.remove('active-mode');
        studyMode.classList.add('hidden-mode');
    }
}

// Study Mode Logic
function generateStudyTables() {
    const colors = ['#ffeaa7', '#81ecec', '#fab1a0', '#55efc4', '#74b9ff', '#a29bfe', '#fd79a8', '#ffeaa7'];
    
    for (let i = 2; i <= 9; i++) {
        const card = document.createElement('div');
        card.className = 'gugu-card';
        card.style.borderColor = colors[i - 2];
        
        let html = `<h2 class="gugu-title" style="color: ${colors[i - 2]}">${i}단</h2>`;
        
        for (let j = 1; j <= 9; j++) {
            html += `
                <div class="gugu-row">
                    <span>${i}</span> <span>×</span> <span>${j}</span> <span>=</span> <span>${i * j}</span>
                </div>
            `;
        }
        
        card.innerHTML = html;
        tableContainer.appendChild(card);
    }
}

// Quiz Mode Logic
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startNewQuiz() {
    // Reset feedback
    feedbackMessage.innerText = '';
    feedbackMessage.className = 'feedback';
    answerBox.innerText = '?';
    answerBox.style.color = 'var(--text-light)';

    const num1 = getRandomInt(2, 9);
    const num2 = getRandomInt(1, 9);
    currentAnswer = num1 * num2;

    qNum1.innerText = num1;
    qNum2.innerText = num2;

    generateOptions(currentAnswer, num1, num2);
}

function generateOptions(correctAnswer, n1, n2) {
    optionsContainer.innerHTML = '';
    
    // Create an array of 4 options including correct answer
    const options = [correctAnswer];
    
    while(options.length < 4) {
        // Generate believable wrong answers
        let wrongBase = getRandomInt(2, 9) * getRandomInt(1, 9);
        
        // Randomly tweak by +/- n1 to simulate common mistakes
        if (Math.random() > 0.5) {
             const tweaks = [n1, -n1, n2, -n2];
             wrongBase = correctAnswer + tweaks[getRandomInt(0, 3)];
        }
        
        // Ensure greater than 0 and unique
        if (wrongBase > 0 && !options.includes(wrongBase)) {
            options.push(wrongBase);
        }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Render buttons
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected, btnElement) {
    // Disable all buttons to prevent double clicking
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.style.pointerEvents = 'none');

    answerBox.innerText = selected;

    if (selected === currentAnswer) {
        // Correct
        answerBox.style.color = '#2ecc71';
        btnElement.style.background = '#2ecc71';
        btnElement.style.borderColor = '#2ecc71';
        btnElement.style.color = 'white';
        
        feedbackMessage.innerText = '정답입니다! 🎉';
        feedbackMessage.className = 'feedback correct';
        
        score += 10;
        streak++;
        scoreDisplay.innerText = score;
        
        // Trigger Confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        updateStars();
        setTimeout(startNewQuiz, 1500);

    } else {
        // Wrong
        answerBox.style.color = '#e74c3c';
        btnElement.style.background = '#e74c3c';
        btnElement.style.borderColor = '#e74c3c';
        btnElement.style.color = 'white';
        
        // Highlight correct answer
        buttons.forEach(b => {
             if (parseInt(b.innerText) === currentAnswer) {
                 b.style.borderColor = '#2ecc71';
                 b.style.borderWidth = '5px';
             }
        });

        feedbackMessage.innerText = '앗, 다시 생각해보세요! 🤔';
        feedbackMessage.className = 'feedback wrong';
        streak = 0;
        
        setTimeout(() => {
            // Re-enable options or just start new quiz
            startNewQuiz();
        }, 2000);
    }
}

function updateStars() {
    if (streak > 0 && streak % 3 === 0) {
        const star = document.createElement('span');
        star.innerText = '⭐';
        star.style.animation = 'popIn 0.5s ease';
        starsContainer.appendChild(star);
    }
}

// Run
window.onload = init;
