import React, { Fragment } from "react"
import Button from "./common/Button"
import "../styles/HostRoom.css"

export default function HostRoom({
  ready = "",
  players = [],
  phase = "",
  roomID,
  startGame,
  nextRound,
  endGameInfo,
}) {
  function convertToImage(blob) {
    const arrayBufferView = new Uint8Array(blob.data)
    const blobData = new Blob([arrayBufferView], { type: "image/png" })
    const imageUrl = URL.createObjectURL(blobData)
    return imageUrl
  }

  // const [state, setState] = useState({
  //   word: "this word"
  // })
  // function animateClick() {
  //   setState({ word: "that word" });
  // }

  // let imageArray = [];
  let drawingImages = endGameInfo.map(image => {
    console.log("these are the infos", image)
    let guessNumber = -1
    let playerNumber = -2

    return (
      <Fragment>
        <div className="final">
          <div className="originalWord">
            <h3>
              {image.info.player_names[0]}'s Original Word: {image.info.word}
            </h3>
          </div>
          {image.info.drawings.map(images => {
            guessNumber = guessNumber + 1
            playerNumber = playerNumber + 2
            return (
              <Fragment>
                <div className="drawingAndGuess">
                  {playerNumber === 0 ? (
                    <h3 id="player-drawing">
                      {image.info.player_names[playerNumber]}'s drawing of{" "}
                      {image.info.word}
                    </h3>
                  ) : (
                    <h3 id="player-drawing">
                      {" "}
                      {image.info.player_names[playerNumber]}'s drawing of{" "}
                      {image.info.guesses[guessNumber - 1]}
                    </h3>
                  )}
                  <img alt="end result" src={convertToImage(images)} />
                  {image.info.guesses[guessNumber] ? (
                    <h3 id="player-guess">
                      {image.info.player_names[playerNumber + 1]} guessed:{" "}
                      {image.info.guesses[guessNumber]}
                    </h3>
                  ) : (
                    <h3 id="final-original-word">
                      {image.info.word.toUpperCase()} BECAME{" "}
                      {image.info.guesses[guessNumber - 1].toUpperCase()}
                    </h3>
                  )}
                </div>
              </Fragment>
            )
          })}
          {/* <h3 id="final-original-word">Original Word: {image.info.word}</h3> */}
        </div>
      </Fragment>
    )
  })

  return (
    <Fragment>
      {phase === "draw" && (
        <Fragment>
          <div className="drawPhaseStyle">
            <h1 className="phase-title">DRAW PHASE</h1>
            <h2>Draw the prompt on your screen!</h2>
            <h2>Ready players</h2>
            {ready.map(player => {
              return <h3>{player} is ready!</h3>
            })}
            <Button onClick={() => nextRound()}>Next round</Button>
          </div>
        </Fragment>
      )}

      {phase === "guess" && (
        <Fragment>
          <div className="guessPhaseStyle">
            <h1 className="phase-title">GUESS PHASE</h1>
            <h2>Guess the picture on your screen!</h2>
            <h2>Ready players</h2>
            {ready.map(player => {
              return <h3>{player} is ready!</h3>
            })}
            <Button onClick={() => nextRound()}>Next round</Button>
          </div>
        </Fragment>
      )}

      {phase === "endgame" && (
        <Fragment>
          <h1 id="end-title" className="phase-title">
            The game has ended
          </h1>
          <div id="imageContainer">{drawingImages}</div>
        </Fragment>
      )}

      {phase === "" && (
        <Fragment>
          <div className="hostRoom">
            <h1>Room Code: {roomID}</h1>
            <h2>Players in Lobby</h2>
            {players.map(player => {
              if (ready.includes(player)) {
                return <h3>{player} is Ready!</h3>
              } else return <h3>{player}</h3>
            })}
            <Button onClick={() => startGame()}>Start Game</Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
