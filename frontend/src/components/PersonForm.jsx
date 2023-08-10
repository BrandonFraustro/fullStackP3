import React from "react";

const PersonForm = (props) => {
    const handleAddPhonebook = (event) => {
      props.handleAddPhonebook(event)
    }
    
    const handleNameChange = (event) => {
        props.handleNameChange(event)
    }
    const handleNumberChange = (event) => {
        props.handleNumberChange(event)
    }

    return (
        <div>
            <form>
              <div className="inputs">
                <div>
                  name: <input onChange={handleNameChange} />
                </div>
                <div>
                  number: <input onChange={handleNumberChange} />
                </div>
              </div>
              <div className='button'>
                <button type='submit' onClick={handleAddPhonebook}>add</button>
              </div>
            </form>
        </div>
    )
}

export default PersonForm