import React, { Fragment, useState } from 'react';

export default function Guess(props) {

  const [guess, setGuess] = useState("");

  console.log("asdasd", props.imageSource);

  // const imageSource = URL.createObjectURL(props.imageSource);
  // const container = document.getElementById("imageContainer");
  // const img = new Image();
  // img.src = imageSource;
  

  return (
    <Fragment>
      <h1 >Guess what this is!</h1>

      <input
          value={guess}
          type="text"
          placeholder="Enter your guess here!"
          onChange={(event) => setGuess(event.target.value)}
        />
        <img src={props.imageSource}></img>
        <div id="imageContainer"></div>

    </Fragment>
  )
}