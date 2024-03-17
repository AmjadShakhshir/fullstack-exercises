import { useState, useEffect } from "react";

import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import PersonServices from "./services/PersonServices";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    PersonServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName) && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const person = persons.find((person) => person.name === newName);
      const changedPerson = { ...person, number: newNumber };

      PersonServices.updated(person.id, changedPerson)
        .then((returnedPerson) => {
          setPersons(persons.map((person) => (person.id !== returnedPerson.id ? person : returnedPerson)));
          setMessage(`${returnedPerson.name} Changed his number.`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          setNewName("");
          setNewNumber("");
        })
        .catch(() => {
          setErrorMessage(`Information of ${person.name} has already been removed from server.`);
        });
    } else {
      const personObject = {
        id: JSON.stringify(persons.length + 1),
        name: newName,
        number: newNumber,
      };

      if (!persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
        PersonServices.create(personObject)
          .then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson));
            setMessage(`Added ${returnedPerson.name}.`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setNewName("");
            setNewNumber("");
          })
          .catch(() => {
            setErrorMessage(`There was an error while adding ${personObject.name}.`);
          });
      }
    }
  };

  const deletePerson = (id) => {
    if (window.confirm("Do you really want to delete this person?")) {
      PersonServices.deleted(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`Deleted person.`);
        })
        .catch(() => {
          setErrorMessage(`Information of ${persons.find((person) => person.id === id).name} has already been removed from server.`);
        });
    }
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const personsToShow = newFilter ? persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase())) : persons;

  return (
    <div>
      <h1>
        <b>Phonebook</b>
      </h1>
      {message && <Notification message={message} />}
      {errorMessage && <Notification message={errorMessage} error={true} />}
      <Filter handleFilterChange={handleFilterChange} />
      <h2>
        <b>Add a new</b>
      </h2>
      <PersonForm addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
