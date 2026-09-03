// Расчёт по формуле Миффлина-Сан Жеора (Mifflin-St Jeor) — наиболее точная
// из общепринятых формул для оценки базового обмена веществ (BMR).

/**
 * Базовый обмен веществ (BMR) — сколько калорий тело тратит в полном покое.
 * @param {{gender: 'male'|'female', age: number, height: number, weight: number}} params
 * @returns {number}
 */
function calculateBMR({ gender, age, height, weight }) {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

/**
 * Полный расчёт: BMR, поддержание, похудение и набор массы.
 * @param {{gender: 'male'|'female', age: number, height: number, weight: number, activityFactor: number}} input
 */
function calculateCalories(input) {
  const bmr = calculateBMR(input)
  const maintenance = bmr * input.activityFactor

  return {
    bmr: Math.round(bmr),
    maintenance: Math.round(maintenance),
    mildLoss: Math.round(maintenance - 250),
    loss: Math.round(maintenance - 500),
    mildGain: Math.round(maintenance + 250),
    gain: Math.round(maintenance + 500),
  }
}

const form = document.getElementById('calculator')
const errorEl = document.getElementById('error')
const resultsEl = document.getElementById('results')
const resultEls = {
  bmr: document.getElementById('result-bmr'),
  maintenance: document.getElementById('result-maintenance'),
  mildLoss: document.getElementById('result-mild-loss'),
  loss: document.getElementById('result-loss'),
  mildGain: document.getElementById('result-mild-gain'),
  gain: document.getElementById('result-gain'),
}

function showError(message) {
  errorEl.textContent = message
  errorEl.hidden = false
  resultsEl.hidden = true
}

function renderResults(result) {
  errorEl.hidden = true
  resultEls.bmr.textContent = `${result.bmr} ккал`
  resultEls.maintenance.textContent = `${result.maintenance} ккал`
  resultEls.mildLoss.textContent = `${result.mildLoss} ккал`
  resultEls.loss.textContent = `${result.loss} ккал`
  resultEls.mildGain.textContent = `${result.mildGain} ккал`
  resultEls.gain.textContent = `${result.gain} ккал`
  resultsEl.hidden = false
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const data = new FormData(form)
  const gender = data.get('gender')
  const age = Number(data.get('age'))
  const height = Number(data.get('height'))
  const weight = Number(data.get('weight'))
  const activityFactor = Number(data.get('activity'))

  if (!age || !height || !weight || age <= 0 || height <= 0 || weight <= 0) {
    showError('Заполните возраст, рост и вес корректными положительными числами')
    return
  }

  const result = calculateCalories({ gender, age, height, weight, activityFactor })
  renderResults(result)
})

form.addEventListener('reset', () => {
  errorEl.hidden = true
  resultsEl.hidden = true
})
