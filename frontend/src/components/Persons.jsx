import React from "react";

const Persons = (props) => {
    //console.log("Persons: ", props.newSearch);
    const handleDeletePerson = (event) => {
      props.handleDeletePerson(event)
    }

    return (
        <div>
            <ul>
            {
              props.newSearch.map(person =>
                <li key={person.id}>
                  {person.name} {person.number}{' '}
                  <button onClick={() => handleDeletePerson(person.id)}>
                  Delete
                  </button>
                </li>
              )
            }
          </ul>
        </div>
    )
}

export default Persons