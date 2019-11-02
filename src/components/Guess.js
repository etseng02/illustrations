import React, { Fragment, useState } from 'react';

export default function Guess(props) {

  const [guess, setGuess] = useState("");

  return (
    <Fragment>
      <h1 >Guess what this is!</h1>

      <input
          value={guess}
          type="text"
          placeholder="Enter your guess here!"
          onChange={(event) => setGuess(event.target.value)}
        />

    </Fragment>
  )
}