// 수업 후 성취도 점검을 위한 핵심 형성평가 5문항 데이터
const allQuestions = [
    {
        question: "다음 대화의 빈칸에 알맞은 단어는?\n\nA: I'm ________ to get some street food.\nB: Great! Let's go together.",
        options: ["go", "goes", "went", "going"],
        answer: 3, 
        hint: "'~할 예정이다, ~하려고 한다'라는 계획이나 의도를 나타내는 주어 + be동사 + [ ] + to 동사원형 패턴입니다."
    },
    {
        question: "다음 문장의 빈칸에 들어갈 가격 질문 표현으로 알맞은 것은?\n\nA: ____________ is the green curry?\nB: It is six dollars.",
        options: ["How old", "How many", "How much", "How long"],
        answer: 2, 
        hint: "물건이나 음식의 가격(돈)이 얼마인지 물어볼 때 사용하는 핵심 의문사 세트입니다."
    },
    {
        question: "교과서 본문 내용 중, 파에야(paella)의 이름이 유래된 곳은 어디인가요?",
        options: ["요리를 만드는 전통 축제 이름", "요리할 때 사용하는 크고 평평한 냄비", "스페인의 유명한 도시 이름", "요리에 들어가는 특별한 해산물 종류"],
        answer: 1, 
        hint: "Spanish people cook paella in a large, flat pan. 요리 도구의 특징에서 이름이 왔습니다."
    },
    {
        question: "다음 대화의 빈칸에 들어갈 숫자로 알맞은 것은?\n\nA: Fish cakes are $4 a bag. I want two bags, please.\nB: Okay. That's ________ dollars in total.",
        options: ["four", "six", "eight", "ten"],
        answer: 2, 
        hint: "한 봉지에 4달러인 어묵(Fish cakes)을 2봉지 구매했습니다. 총 가격을 계산해 보세요."
    },
    {
        question: "다음 중 어법상 '현재 일어나는 행동(현재진행형)'을 바르게 표현한 문장은?",
        options: ["I am watch the first match.", "I watching the first match.", "I am watching the first match.", "I am watched the first match."],
        answer: 2, 
        hint: "현재진행형은 반드시 [be동사(am/are/is) + 동사원형-ing] 형태를 갖추어야 완전한 문장이 됩니다."
    }
];

// 상태 제어 변수들
let activeQuestions = []; 
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; 
let isWrongOnlyMode = false;
let wrongIndexes = []; 

// DOM 객체 바인딩
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const reviewRetryBtn = document.getElementById('review-retry-btn'); 
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const hintToggleBtn = document.getElementById('hint-toggle-btn');
const hintBox = document.getElementById('hint-box');
const hintText = document.getElementById('hint-text');
const scoreText = document.getElementById('score-text');
const feedbackText = document.getElementById('feedback-text');
const studyGuide = document.getElementById('study-guide');
const wrongAnswersList = document.getElementById('wrong-answers-list');

// 이벤트 리스너 연결
startBtn.addEventListener('click', () => startQuiz(false));
restartBtn.addEventListener('click', () => startQuiz(false)); 
reviewRetryBtn.addEventListener('click', () => startQuiz(true)); 
hintToggleBtn.addEventListener('click', toggleHint);

function startQuiz(isWrongOnly = false) {
    currentQuestionIndex = 0;
    score = 0;
    isWrongOnlyMode = isWrongOnly;
    userAnswers = []; 

    if (isWrongOnlyMode) {
        // 오답 모드: 누적 기록된 wrongIndexes를 토대로 퀴즈 세트 정제
        let tempWrongSet = [];
        wrongIndexes.forEach(idx => {
            tempWrongSet.push(allQuestions[idx]);
        });
        activeQuestions = tempWrongSet;
    } else {
        // 처음부터 풀기 모드: 원본 5문제 전체 복사 및 오답 배열 초기화
        activeQuestions = [...allQuestions];
        wrongIndexes = [];
    }

    startScreen.classList.add('hide');
    resultScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = activeQuestions[currentQuestionIndex];
    
    progressText.innerText = `문항 ${currentQuestionIndex + 1} / ${activeQuestions.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`;
    
    questionText.innerText = currentQuestion.question;
    hintText.innerText = currentQuestion.hint;
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    hintBox.classList.add('hide');
    hintToggleBtn.innerText = "힌트 보기";
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function toggleHint() {
    if (hintBox.classList.contains('hide')) {
        hintBox.classList.remove('hide');
        hintToggleBtn.innerText = "힌트 숨기기";
    } else {
        hintBox.classList.add('hide');
        hintToggleBtn.innerText = "힌트 보기";
    }
}

function selectAnswer(selectedIndex) {
    userAnswers.push(selectedIndex);
    const currentQuestion = activeQuestions[currentQuestionIndex];

    if (selectedIndex === currentQuestion.answer) {
        score++;
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    
    // 점수 백분율 계산 출력
    const finalScore = Math.round((score / activeQuestions.length) * 100);
    scoreText.innerText = finalScore;
    
    if (isWrongOnlyMode) {
        feedbackText.innerText = "오답 재도전이 완료되었습니다! 스스로 생각하며 다시 풀어낸 경험이 실력 향상에 큰 도움이 될 거예요.";
    } else {
        if (finalScore >= 80) {
            feedbackText.innerText = "완벽합니다! 오늘 진행된 Lesson 2의 핵심 문형과 교과 어휘를 훌륭하게 성취했습니다.";
        } else if (finalScore >= 60) {
            feedbackText.innerText = "좋습니다! 핵심 내용은 전반적으로 이해했으나 몇 가지 사소한 혼동이 보이니 아래 가이드를 참고하세요.";
        } else {
            feedbackText.innerText = "오늘 배운 주요 표현 문장 구조에 대한 재복습이 필요합니다. 힌트를 보며 오답 재도전에 임해봅시다.";
        }
    }

    // 학습 가이드 출력
    studyGuide.innerHTML = `
        <li>의도 표현 표현인 <strong>I'm going to + 동사원형</strong> 문형 구조를 다시 한번 연습장이나 교과서 노트에 써 보세요.</li>
        <li>현재진행형을 만들 때 <strong>be동사(am/are/is)</strong>를 빠뜨리지 않았는지 항상 확인하는 습관을 기릅시다.</li>
    `;

    wrongAnswersList.innerHTML = ""; 
    let currentWrongCount = 0;
    let newWrongIndexes = []; 

    activeQuestions.forEach((question, index) => {
        const uAns = userAnswers[index];
        const cAns = question.answer;

        if (uAns !== cAns) {
            currentWrongCount++;
            
            // 현재 모드에 따라 원본(allQuestions) 기준 인덱스 매칭 계산
            let originalIndex = isWrongOnlyMode ? wrongIndexes[index] : index;
            newWrongIndexes.push(originalIndex);

            const wrongItem = document.createElement('div');
            wrongItem.classList.add('wrong-item');
            const formattedQuestion = question.question.split('\n').join('<br>');

            // 정답(⭕) 코드를 완전히 지우고, 고른 오답과 힌트 코멘트만 제공하여 재사고 유도
            wrongItem.innerHTML = `
                <div class="q-title">📌 틀린 문항 분석</div>
                <div style="font-size:0.95rem; line-height:1.4; color:#555; margin-bottom:8px;">${formattedQuestion}</div>
                <div class="answer-info">
                    <span class="my-ans">❌ 내가 선택한 오답: ${question.options[uAns]}</span>
                    <div class="review-hint">💡 다시 풀어보기 위한 힌트:<br>${question.hint}</div>
                </div>
            `;
            wrongAnswersList.appendChild(wrongItem);
        }
    });

    // 오답 인덱스 포인터 갱신
    wrongIndexes = newWrongIndexes;

    // 탈락 문항(오답)이 남아 있다면 '다시 도전하기' 버튼 활성화
    if (currentWrongCount > 0) {
        reviewRetryBtn.classList.remove('hide');
        reviewRetryBtn.innerText = `❌ 틀린 문제 (${currentWrongCount}개) 다시 도전하기`;
    } else {
        reviewRetryBtn.classList.add('hide');
        wrongAnswersList.innerHTML = `<div class="all-correct-msg">🎉 축하합니다! 모든 문제를 완벽하게 맞혔습니다!</div>`;
    }
}
