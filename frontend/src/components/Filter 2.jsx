import React from "react";

const Filter = (props) => {
    //console.log('Filter: ', props)
    const persons = props.persons.map(person => person)
    //console.log('Filter: ', persons)
    const handleChange = (event) => {
        props.handleSearch(event);
    };
    return (
        <div>
            {props.text} <input type="text" onChange={handleChange}/>
        </div>
    )
}

export default Filter