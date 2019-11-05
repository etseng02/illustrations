import React, { Fragment } from 'react';
import Button from './Button'
import './HostRoom.css'

export default function HostRoom({ ready = "", players = [], phase = "", roomID, startGame, nextRound, endGameInfo }) {

  // const [ready] = useState(props.ready || "");
  // const [players] = useState(props.players || "");
  // const [statePhase, setPhase] = useState(props.phase || "");

  //let readyPlayers = players.filter(element => ready.includes(element));
  function convertToImage(blob) {
    const arrayBufferView = new Uint8Array(blob.data);
    const blobData = new Blob([arrayBufferView], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blobData);
    return imageUrl;
  };

  // for(let data of endGameInfo) {
  //   let drawingImg = new Image();
  //   drawingImg.src = convertToImage(data.info.drawings);
  //   let container = document.getElementById("imageContainer");
  //   container.appendChild(drawingImg);
  //   console.log(data.info.drawings);
  // }
  let imageArray = [];
  let drawingImages = endGameInfo.map(image => {
    console.log("these are the infos", image);
    let guessNumber = -1;
    let playerNumber = -2;

    return(
      <Fragment>
        <div className="final">
          <h1>{image.info.player_names[0]}'s Original Word: {image.info.word}</h1>

          {image.info.drawings.map((images) =>{
            guessNumber = guessNumber + 1
            playerNumber = playerNumber + 2
            return (
            <Fragment>
              <div>
              <h1>{image.info.player_names[playerNumber]}'s drawing:</h1>
              <img src={convertToImage(images)}/>
              </div>
              {image.info.guesses[guessNumber]? <h1>{image.info.player_names[playerNumber+1]} guessed: {image.info.guesses[guessNumber]}</h1>: null}
              
            </Fragment>
            )}
          )}

      </div>
    </Fragment>
    )

    // console.log(image.info.drawings[0].data);
    // return <img src={convertToImage(image.info.drawings)}/>
  });

  return (
    <Fragment>

    {phase === "draw" &&
      <Fragment>
        <h1>DRAW PHASE</h1>
        <h2>Draw the prompt on your screen!</h2>
        <h2>Ready players</h2>
        {ready.map(
          (player) => {
            return <h3>{player} is ready!</h3> 
          })
        }
        <Button  onClick = {() => nextRound()}>Next round</Button>
      </Fragment>
    }

    {phase === "guess" &&
      <Fragment>
        <h1>GUESS PHASE</h1>
        <h2>Guess the picture on your screen!</h2>
        <h2>Ready players</h2>
        {ready.map(
          (player) => {
            return <h3>{player} is ready!</h3> 
          })
        }
        <Button  onClick = {() => nextRound()}>Next round</Button>
      </Fragment>
    }

    {phase === "endgame" &&
      <Fragment>
        <h1>The game has ended</h1>
        <div id="imageContainer">{drawingImages}</div>

      </Fragment>

    }

    {phase === "" &&
    <Fragment>
      <h1>Room Code: {roomID}</h1>
      <h2>Players in Lobby</h2>
      {
        players.map(
          (player) => {
            if (ready.includes(player)) {
              return <h3>{player} is Ready!</h3>
            } else
            return <h3>{player}</h3>
        })
      }
      <Button onClick = {() => startGame()}>Start Game</Button>
    </Fragment>
    }
    </Fragment>
    
  );
}