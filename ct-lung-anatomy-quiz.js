const quiz = document.querySelector('.lesson-quiz');
const questions = [...quiz.querySelectorAll('fieldset')];
const report = quiz.querySelector('.quiz-report');

function clearResult() {
  for (const question of questions) {
    delete question.dataset.result;
    question.querySelector('.quiz-explanation').hidden = true;
  }
  report.textContent = '';
}

quiz.addEventListener('submit', event => {
  event.preventDefault();
  let correct = 0;
  for (const question of questions) {
    const selected = question.querySelector('input:checked');
    const matches = selected?.value === question.dataset.answer;
    correct += Number(matches);
    question.dataset.result = matches ? 'correct' : 'incorrect';
    const explanation = question.querySelector('.quiz-explanation');
    const expected = [...question.querySelectorAll('input')].find(input => input.value === question.dataset.answer);
    explanation.textContent = (matches ? 'Верно. ' : 'Ответ — ' + expected.parentElement.textContent.trim() + '. ') + explanation.dataset.reason;
    explanation.hidden = false;
  }
  report.textContent = 'Результат — ' + correct + ' из ' + questions.length + '. Разбор открыт под каждым вопросом.';
});

for (const question of questions) {
  const explanation = question.querySelector('.quiz-explanation');
  explanation.dataset.reason = explanation.textContent;
}
quiz.addEventListener('input', clearResult);
quiz.addEventListener('reset', clearResult);
quiz.hidden = false;
