const btn = document.querySelector('#btn');
const main = document.querySelector('.container');
const message = pageEles(main, 'div', 'Press Start Button', 'message');
const output = pageEles(main, 'div', '', 'game');
const game = { score: 0 };
let maxScore = 0;

// Get the quiz type from the page
const currentPage = window.location.pathname;
const quizType = currentPage.includes('html-quiz') ? 'HTML' :
                currentPage.includes('css-quiz') ? 'CSS' :
                currentPage.includes('js-quiz') ? 'JS' : 'all';

const url = '../script/quiz.json';

btn.onclick = loadData;

function pageEles(parent, t, html, c) {
    const ele = document.createElement(t);
    ele.innerHTML = html;
    ele.classList.add(c);
   return parent.appendChild(ele);
}

function loadData() {
    btn.style.display = 'none';
    fetch(url)
        .then(res => res.json())
        .then(data => {

            const filteredQuestions = quizType === 'all' ? data : 
                data.filter(question => question.category === quizType);
            
            console.log('Filtered Questions:', filteredQuestions.length); 

            const temp = {
                total: filteredQuestions.length,
                q: filteredQuestions,
                counter: 0
            };
            createQuestion(temp);
        })
        .catch(error => console.error('Error loading questions:', error));
    }

function calcGrade(maxScore, score) {
    console.log('calcGrade called', maxScore, score); // DEBUG
    if (quizType === 'all') {
        maxScore = 50;
    } else if (quizType === 'HTML') {
        maxScore = 15;
    } else if (quizType === 'CSS') {
        maxScore = 15;
    } else if (quizType === 'JS') {
        maxScore = 20;
    }

    let grade = '';
    const percentage = (score / maxScore) * 100;
    if (percentage >= 95) grade = '15';
    else if (percentage >= 90) grade = '14';
    else if (percentage >= 85) grade = '13';
    else if (percentage >= 80) grade = '12';
    else if (percentage >= 75) grade = '11';
    else if (percentage >= 70) grade = '10'; 
    else if (percentage >= 65) grade = '9';
    else if (percentage >= 60) grade = '8';
    else if (percentage >= 55) grade = '7';
    else if (percentage >= 50) grade = '6';
    else if (percentage >= 45) grade = '5';
    else if (percentage >= 40) grade = '4';
    else if (percentage >= 33) grade = '3';
    else if (percentage >= 27) grade = '2';
    else if (percentage >= 20) grade = '1';
    else grade = '0';
    console.log('About to set message.innerHTML', message, grade); // DEBUG
    message.innerHTML = `
        <h1>Game Over</h1>
        <div>Du hast ${score} von ${maxScore} insgesamt Punkten erreicht.</div>
        <div>Notenpunkte:<strong>${grade}</strong></div>
    `;
}

function createQuestion(data){
    const el = pageEles(output, 'div', '', ); 

    if (quizType === 'all') {
        maxScore = 50;
    } else if (quizType === 'HTML') {
        maxScore = 15;
    } else if (quizType === 'CSS') {
        maxScore = 15;
    } else if (quizType === 'JS') {
        maxScore = 20;
    }

    if(data.q.length == 0){
        console.log('Quiz ended, calling calcGrade'); // DEBUG
        calcGrade(maxScore, game.score);
    } else{
            const tBtn = pageEles(el, 'button', 'Next', 'next');
    tBtn.onclick = () => {
        el.remove();
        createQuestion(data);}

        const question = data.q.shift();
            data.counter++;
                message.textContent = `Question ${data.counter} of ${data.total}`;
                if(data.q.length == 0) tBtn.textContent = 'End Game'
                tBtn.style.display = 'none';
        outputQuestion(question, el, tBtn);
    }
}

function outputQuestion(question, parent, tBtn) {
    const que = pageEles(parent, 'div', `${question.question}`, 'question');
    const arr = [...question.opt, ...question.answers];
    arr.sort(() => Math.random() - 0.5);
    
    const btns = pageEles(parent, 'div', '', 'opts');
    let selectedAnswers = new Set();
    let answered = false;

    arr.forEach(e => {
        const optemp = pageEles(btns, 'button', e, 'btns');
        optemp.onclick = () => {
            if (!answered) {
                if (selectedAnswers.has(e)) {
                    selectedAnswers.delete(e);
                    optemp.style.backgroundColor = 'var(--main)';
                } else {
                    selectedAnswers.add(e);
                    optemp.style.backgroundColor = 'blue';
                }
            }
        }
    });

    const submitBtn = pageEles(parent, 'button', 'Submit Answers', 'submit-btn');
    submitBtn.onclick = () => {
        if (!answered) {
            answered = true;
            const isCorrect = checkAnswers(selectedAnswers, question.answers);
            

            const buttons = parent.querySelectorAll('.btns');
            buttons.forEach(el => {
                el.disabled = true;
                const isAnswer = question.answers.includes(el.textContent);
                const wasSelected = selectedAnswers.has(el.textContent);
                
                if (isAnswer) {
                    el.style.backgroundColor = 'green';
                } else if (wasSelected) {
                    el.style.backgroundColor = 'red';
                }
            });

            message.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
            if (isCorrect) game.score++;
            
            submitBtn.style.display = 'none';
            tBtn.style.display = 'block';
        }
    };
}

function checkAnswers(selected, correct) {
    if (selected.size !== correct.length) return false;
   return  correct.every(answer => selected.has(answer));
}

