import React, { useState } from "react";

import Button from './Button'

export default function JoinRoom(props) {

  const [name, setName] = useState(props.name || "");
  const [room, setRoom] = useState(props.name || "");

  function validate() {
    if (name === "") {
      console.log("Name cannot be blank");
      return;
    } 
    if (room === "") {
      console.log("Room ID cannot be blank");
      return;
    }
    props.onClick(name, room)
  }

  return (
    <form autoComplete="off">
    <input
      value={name}
      type="text"
      placeholder="Enter your name"
      onChange={(event) => setName(event.target.value)}
    />
    <input
      value={room}
      type="text"
      placeholder="Enter Room ID"
      onChange={(event) => setRoom(event.target.value)}
    />
    <Button onClick = {() => validate()}>Join Room</Button>
  </form>
  );
}