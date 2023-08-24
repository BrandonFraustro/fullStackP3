import React from "react";

const Filter = (props) => {
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