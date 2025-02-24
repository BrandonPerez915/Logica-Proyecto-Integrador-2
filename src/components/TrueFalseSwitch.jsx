/* eslint-disable react/prop-types */

export const TrueFalseSwitch = ({ identifier, variable }) => {
  return (
    <div className='toggler'>
      <input id={ `toggler-${ identifier }` } name={ variable } type='checkbox' value={ true }/>
      <label htmlFor={ `toggler-${ identifier }` }>
        <span className='toggler-on'>V</span>
        <span className='toggler-off'>F</span>
      </label>
    </div>
  )
}
