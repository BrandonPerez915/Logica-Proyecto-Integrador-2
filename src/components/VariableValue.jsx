/* eslint-disable react/prop-types */
import { TrueFalseSwitch } from "./TrueFalseSwitch"

export const VariableValue = ({ children, index, variable }) => {
  return (
    <div className='variable-value-container'>
      <span className='variable-name'>{ children }</span>
      <TrueFalseSwitch identifier={ index } variable={ variable }/>
    </div>
  )
}
