import React, { useState } from "react"

export default function HomeScreen(props) {
  const [name, setName] = useState(props.name || "")
  const [room, setRoom] = useState(props.name || "")

  function validate() {
    if (name === "") {
      console.log("Name cannot be blank")
      return
    }
    if (room === "") {
      console.log("Room ID cannot be blank")
      return
    }
    props.onClick(name, room)
  }

  return (
    <form autoComplete="off">
      <div class="flex flex-col bg-gray-200 m-auto mt-16 w-3/5 lg:w-4/12 p-6 space-y-4">
        <input
          id="name-field"
          value={name}
          type="text"
          placeholder="Enter your name"
          onChange={event => setName(event.target.value)}
        />
        <input
          id="room-field"
          value={room}
          type="text"
          placeholder="Enter Room ID"
          onChange={event => setRoom(event.target.value)}
        />
        <button id="join-room" onClick={() => validate()}>
          Join Room
        </button>
        <button id="create-room" onClick={() => props.createRoom()}>
          Create Room
        </button>
      </div>
    </form>
  )
}
