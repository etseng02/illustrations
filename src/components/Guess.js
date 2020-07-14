import React, { Fragment } from "react"
import Button from "./common/Button"
import "../styles/Guess.css"

export default function Guess(props) {
  return (
    <Fragment>
      <div className="playerGuessStyle">
        <h1>Guess what this is!</h1>
        <input
          // value={guess}
          type="text"
          placeholder="Enter your guess here!"
          id="guess"
          onChange={() => {
            let guess = document.getElementById("guess").value
            props.setGuess(prev => ({
              ...prev,
              guess,
            }))
          }}
        />
        <Button onClick={() => props.ready()}>Ready</Button>
        <img alt="guess" src={props.imageSource}></img>
      </div>
    </Fragment>
  )
}
