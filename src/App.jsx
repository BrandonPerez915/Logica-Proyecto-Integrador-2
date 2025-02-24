import { Button } from "../../calculadora/src/components/Button.jsx"
import { Card } from "../../calculadora/src/components/Card.jsx"
import { LogicButtons } from "./components/LogicButtons.jsx"
import { VariableValue } from "./components/VariableValue.jsx"

import { useState, useEffect, useRef } from "react"

import { getData, startTimer, detectVariables, resetForm, updateBoard } from "./utils/logic.js"

function App() {
  const [showInitialConfig, setShowInitialConfig] = useState(true)
  const [variables, setVariables] = useState([])
  const [inputObject, setInputObject] = useState({})
  const [board, setBoard] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCell, setCurrentCell] = useState(0)

  const countdownRef = useRef(null)

  const handleSubmit = (e) => {
    getData(e, variables, setShowInitialConfig, setInputObject, setVariables)
  }

  const handleDelete = () => {
    if(currentCell === 0) return 

    const newBoard = [...board]
    let newCurrentCell = currentCell
    newCurrentCell--
  
    newBoard[currentRow] = [...board[currentRow]]
  
    newBoard[currentRow][newCurrentCell] = ''

    setCurrentCell(newCurrentCell)
    setBoard(newBoard)
  }

  const getResult = () => {
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
  }

  useEffect(()=> {
    const newBoard = Array.from({ length: inputObject.attempts }, () =>
      Array.from({ length: inputObject.expression?.length || 0 }, () => '')
    )

    setBoard(newBoard)
    startTimer(inputObject, countdownRef, setShowInitialConfig, 
      setVariables, setInputObject, setBoard, setCurrentRow, setCurrentCell)
  }, [inputObject])

  return (
    <>
    { showInitialConfig && (
      <dialog open className='initial-config'>
        <h1>Configuración inicial</h1>
        <form onSubmit={ handleSubmit }>
          <section className='expression-section'>
            <span className='invalid-input-text'>Ingrese una expresión valida</span>
            <input 
              className="input expression" 
              placeholder="Ingrese una expresión"
              required
              onChange={ () => detectVariables(setVariables) }
              name='expression'
            />
            <LogicButtons 
              clickFunction={ (e) => {
                const input = document.querySelector('input.expression')
                input.value += e.target.textContent
              }}
            />
            {
              variables.map((variable, index) => {
                return (
                  <VariableValue 
                    key={ index }
                    index={ index }
                    variable={ variable }
                  > { `${variable} : ` } </VariableValue>
                )
              })
            }
          </section>
          <section className='attempts-section'>
            <div>
              <span>Número de intentos: </span>
              <input 
                className="input attempts-number" 
                type="number" 
                min={ 3 } 
                max={ 15 } 
                required
                name='attempts'
              />
            </div>
          </section>
          <section className='enable-hints-section'>
            <span>¿Activar pistas?</span>
            <input 
              type='checkbox' 
              className='theme-checkbox' 
              name='hints'
              value={ true }/>
          </section>
          <section className='set-timer-section'>
            <span>Tiempo limite: </span>
            <input 
              type='number' 
              className='input set-timer'
              min={ 1 }
              max={ 59 }
              name='time'
            />
            <span> minutos </span>
          </section>
          <section className='accept-delete-section'>
            <Button color='green' type='submit'>
              Aceptar
            </Button>
            <Button color='red' clickFunction={ () => resetForm(setVariables) }>
              Borrar
            </Button>
          </section>
        </form>
      </dialog>)
    }

    <main className='main hide'>
      { !showInitialConfig && 
        (<section className='user-info'>
          <Card>
            <div className='time-info'>
              <span className='blue-text'>Tiempo: </span>
              <span className='timer'></span>
            </div>
            <div className='result-info'>
              <span className='blue-text'>Resultado:</span> <span> { eval(inputObject['convertedExpression']) === 1 ? 'Verdadero' : 'Falso' }</span>
            </div>
            <div className='variables-values'>
              <h1 className='variables-values-title blue-text'>Variables</h1>
              {
                Object.entries(variables).map((variableValue, index) => {
                  return (
                    <div key={ index } className='variable-info'>
                      <span className='mint-text'>{ variableValue[0] }: </span>
                      <span>{ variableValue[1] }</span>
                    </div>
                  )
                })
              }
            </div>
          </Card>
          <Card>
            <h1 className='blue-text'>
              Teclado
            </h1>
            <div className='variables-buttons'>
              {
                Object.keys(variables).map((variable, index) => {
                  return (
                    <button 
                      key={ index } 
                      className='logic-button white' 
                      onClick={ (e) => updateBoard(e, currentCell, 
                        currentRow, inputObject, board, setCurrentCell, setBoard) }
                    >
                      { variable }
                    </button>
                  )
                })
              }
              <button className='logic-button white' onClick={ (e) => updateBoard(e, currentCell, 
                        currentRow, inputObject, board, setCurrentCell, setBoard) }>(</button>
              <button className='logic-button white' onClick={ (e) => updateBoard(e, currentCell, 
                        currentRow, inputObject, board, setCurrentCell, setBoard) }>)</button>
              <button className="logic-button white delete" onClick={ handleDelete }>
                <span className="material-symbols-outlined">backspace</span>
              </button>
            </div>
            <LogicButtons color='white' clickFunction={ (e) => updateBoard(e, currentCell, 
                        currentRow, inputObject, board, setCurrentCell, setBoard) }/>
            <Button color='green' clickFunction={ getResult }>Aceptar</Button>
          </Card>
        </section>)
      }
      <section className='board'>
        {
          board.map((row, rowIndex) => {
            return (<div key={ rowIndex } className={ `board-row ${rowIndex}` }>
            {
              row.map((cell, cellIndex) => {
                return <div key={ cellIndex } className={ `board-cell ${rowIndex}-${cellIndex}` }>{ cell }</div>
              })
            }</div>)
          })
        }
      </section>
    </main>
    </>
  )
}

export default App
