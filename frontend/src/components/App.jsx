import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import personService from '../services/persons'
import Notification from './Notification'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState([])
  const [ successfulMessage, setSuccessfulMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
        setNewSearch(response.data)
      })
  }, [])

  const handleAddPhonebook = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    const found = names.find(name => name === newName)
    if (found === undefined) {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewSearch(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setSuccessfulMessage(`Added ${response.data.name}`)
          setTimeout(() => {
            setSuccessfulMessage(null)
          }, 4000);
          }
        )
        .catch(e => {
          console.log(e.response.data)
        })
    } else {
      const existingPerson = persons.find(person => person.name === found)
      const personObject = {
        name: found,
        number: newNumber
      }
      if (window.confirm(`${found} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setNewSearch(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setNewName('')
            setNewNumber('')
            setSuccessfulMessage(`Changed ${response.data.number}`)
            setTimeout(() => {
              setSuccessfulMessage(null)
            }, 4000);
          })
          .catch( error => {
            setErrorMessage(`Information of ${found} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 4000);
          })
      } else {
        return null
      }
    }
  }
  
  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }
  
  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase();
    const filtered = persons.filter(person =>
      person.name.toLowerCase().includes(search)
    );
    //console.log("App:", filtered);
    setNewSearch(filtered);
  };

  const handleDeletePerson = id => {
    //console.log(id);

    if (window.confirm('Do you want to delete this person?')) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNewSearch(newSearch.filter(person => person.id !== id))
        })
        .catch(error => {
          setErrorMessage('Information of this person has already been removed from server')
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000);
          setPersons(persons.filter(person => person.id !== id))
          setNewSearch(newSearch.filter(person => person.id !== id))
        })
    } else {
      return null
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text='Filter shown with:' persons={persons} handleSearch={handleSearch}/>
      
      <Notification message={[successfulMessage,errorMessage]}/>
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAddPhonebook={handleAddPhonebook}
      />

      <h2>Numbers</h2>
      <Persons newSearch={newSearch} handleDeletePerson={handleDeletePerson}/>
    </div>
  )
}

export default App
