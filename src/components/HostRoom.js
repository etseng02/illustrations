import React, { Fragment, useState } from 'react';
import Button from './Button'

export default function HostRoom({ ready = "", players = [], phase = "", roomID, onClick }) {

  // const [ready] = useState(props.ready || "");
  // const [players] = useState(props.players || "");
  // const [statePhase, setPhase] = useState(props.phase || "");

  let readyPlayers = players.filter(element => ready.includes(element));

  return (
    <Fragment>

    {phase === "draw" &&
      <Fragment>
        <h1>DRAW PHASE</h1>
        <h2>Draw the prompt on your screen!</h2>
      </Fragment>
    }

    {phase === "guess" &&
      <Fragment>
        <h1>GUESS PHASE</h1>
        <h2>Guess the picture on your screen!</h2>
      </Fragment>
    }

    {phase === "" &&
    <Fragment>
      <h1>Room Code: {roomID}</h1>
      <h2>Players in Lobby</h2>
      {
        players.map(
          (player) => <h3>{player}</h3>
        )
      }
      <h2>Ready Players</h2>
      {
        ready.map(
          (player) => <h3>{player}</h3>
        )
      }
      <Button onClick = {() => onClick()}>Start Game</Button>
    </Fragment>
    }
    </Fragment>
    
  );
}