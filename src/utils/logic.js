import { convertExpression } from '../../../calculadora/src/utils/logic.js'

export function getData(e, variables, setShowInitialConfig, setInputObject, setVariables) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const formObject = Object.fromEntries(formData.entries())
  let usedVariables = {}

  for(let i of variables) {
    if(i in formObject) {
      usedVariables[i] = 'Verdadero'
    }
    else {
      usedVariables[i] = 'Falso'
    }
  }

  const expression = formObject.expression
  const convertedExpression = convertExpression(expression, usedVariables)
  formObject['convertedExpression'] = convertedExpression

  try {
    eval(convertedExpression)
  } catch {
    const errorLabel = document.querySelector('.invalid-input-text')
    errorLabel.classList.add('show')
    return
  }

  setShowInitialConfig(false)
  setInputObject(formObject)
  setVariables(usedVariables)

  const main = document.querySelector('.main')
  main.classList.remove('hide')
}

export function startTimer(inputObject, countdownRef, 
  setShowInitialConfig, setVariables, setInputObject, 
  setBoard, setCurrentRow, setCurrentCell)
{
  let timeLeft = inputObject['time'] * 60
  const timerDisplay = document.querySelector('.timer')

  clearInterval(countdownRef.current)

  countdownRef.current = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdownRef.current)
      alert("¡Tiempo agotado!")
      setShowInitialConfig(true)
      setVariables([])
      setInputObject({})
      setBoard([])
      setCurrentRow(0)
      setCurrentCell(0)
    } else {
      timeLeft--
      timerDisplay.textContent = timeLeft 
    }
  }, 1000)
}

export function detectVariables(setVariables) {
  const expressionInput = document.querySelector('.input.expression')
  const usedVariables = [...new Set(expressionInput.value.match(/[a-zA-Z]/g) || [])]
  usedVariables.sort()
  setVariables(usedVariables)
}

export function resetForm(setVariables) {
  const expressionInput = document.querySelector('.input.expression')
  const attemptsNumber = document.querySelector('.input.attempts-number')
  const timerInput = document.querySelector('.input.set-timer')

  expressionInput.value = ''
  attemptsNumber.value = ''
  timerInput.value = ''

  setVariables([])
}

export function updateBoard(e, currentCell, currentRow, inputObject, board, setCurrentCell, setBoard) {
  if(currentCell === inputObject['expression'].length) return

  const newBoard = [...board]
  newBoard[currentRow] = [...board[currentRow]]
  newBoard[currentRow][currentCell] = e.target.textContent

  setBoard(newBoard)
  setCurrentCell(currentCell + 1)
}

export function deleteChar(currentCell, currentRow, board, setCurrentCell, setBoard) {
  if(currentCell === 0) return 

  const newBoard = [...board]
  let newCurrentCell = currentCell
  newCurrentCell--

  newBoard[currentRow] = [...board[currentRow]]

  newBoard[currentRow][newCurrentCell] = ''

  setCurrentCell(newCurrentCell)
  setBoard(newBoard)
}

export function paintCells(board, currentRow, inputObject, setShowInitialConfig, setVariables, setInputObject, setBoard, setCurrentRow, setCurrentCell) {

  const input = board[currentRow]
  let occurrences = {}

  for (let char of inputObject['expression']) {
    occurrences[char] = (occurrences[char] || 0) + 1
  }

  for (let i = 0; i < input.length; i++) {
    if (inputObject['expression'][i] === input[i]) { 
      const currentCell = document.querySelector(`[class*='${currentRow}-${i}']`)
      currentCell.classList.add('green-cell')
      occurrences[input[i]]--
    }
  }

  for (let i = 0; i < input.length; i++) {
    if (inputObject['expression'][i] !== input[i] && occurrences[input[i]] > 0) {
      const currentCell = document.querySelector(`[class*='${currentRow}-${i}']`)
      currentCell.classList.add('yellow-cell')
      occurrences[input[i]]--
    }
  }

  setCurrentRow(currentRow + 1)
  setCurrentCell(0)

  if(board[currentRow].join('') === inputObject['expression']) {
    setTimeout(function() {
      alert('Ganaste');
      setShowInitialConfig(true)
      setVariables([])
      setInputObject({})
      setBoard([])
      setCurrentRow(0)
      setCurrentCell(0)
      return 
    }, 200);
  }

  if(currentRow === parseInt(inputObject['attempts']) - 1) {
    setTimeout(function() {
      alert('Perdiste');
      setShowInitialConfig(true)
      setVariables([])
      setInputObject({})
      setBoard([])
      setCurrentRow(0)
      setCurrentCell(0)
      return 
    }, 200);
  }
}