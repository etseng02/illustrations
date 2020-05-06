import React, { useState } from "react";

import Button from './Button'
import "../styles/HomeScreen.css";

export default function HomeScreen(props) {

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
      id="name-field"
      value={name}
      type="text"
      placeholder="Enter your name"
      onChange={(event) => setName(event.target.value)}
    />
    <input
      id="room-field"
      value={room}
      type="text"
      placeholder="Enter Room ID"
      onChange={(event) => setRoom(event.target.value)}
    />
    <Button id="join-room" onClick = {() => validate()}>Join Room</Button>
    <Button id="create-room" onClick = {() => props.createRoom()}>Create Room</Button>
  </form>
  );
}