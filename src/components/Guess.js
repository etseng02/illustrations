import React, { Fragment, useState } from 'react';
import { statement } from '@babel/template';
import Button from './Button'


export default function Guess(props) {

  // const [guess, setGuess] = useState("");

  console.log("asdasd", props.imageSource);

  // const imageSource = URL.createObjectURL(props.imageSource);
  // const container = document.getElementById("imageContainer");
  // const img = new Image();
  // img.src = imageSource;

  // function delieverGuess(){
  //   return guess
  // }
  

  return (
    <Fragment>
      <h1 >Guess what this is!</h1>


      <input
          // value={guess}
          type="text"
          placeholder="Enter your guess here!"
          id='guess'
          onChange={() => {
            let guess = document.getElementById('guess').value
            props.setGuess(prev => ({
              ...prev,
              guess
            }))
          }}
        />
        <Button onClick = {() => props.ready()}>Ready</Button>
        <img src={props.imageSource}></img>
        <div id="imageContainer"></div>

    </Fragment>
  )





}
