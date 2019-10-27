import React, { useState } from "react";

import Button from './Button'

export default function JoinRoom(props) {

  const [name, setName] = useState(props.name || "");

  function validate() {
    // if (name === "") {
    //   setError("Student name cannot be blank");
    //   return;
    // }
    console.log("This works!")
  }

  return (
    <form autoComplete="off">
    <input
      value={name}
      type="text"
      placeholder="Enter the room ID"
      onChange={(event) => setName(event.target.value)}
    />
    <Button confirm onClick = {() => validate()}>Save Name</Button>
  </form>
  );
}