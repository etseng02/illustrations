import React from "react"

import "../../styles/Header.css"

export default function Header(props) {
  return (
    <>
      <header>
        <h1 id="logo">Skedoodle!</h1>
        <h1 id="room">{props.room}</h1>
      </header>
    </>
  )
}
