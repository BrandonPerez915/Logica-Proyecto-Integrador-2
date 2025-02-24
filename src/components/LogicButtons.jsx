/* eslint-disable react/prop-types */
export const LogicButtons = ({ clickFunction, color }) => {
  const LOGICBUTTONS = ['¬', '∧', '∨', '⊕', '⇒', '⇔']
  return (
    <div className='logic-buttons-container'>
      {
        LOGICBUTTONS.map((text,index) => {
          return (
            <button 
              key={ index } 
              className={ `logic-button ${ color }` }
              type='button'
              onClick={ clickFunction }
            >
              { text }
            </button>
          )
        })
      }
    </div>
  )
}
