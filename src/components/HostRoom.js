import React, { Fragment, useState } from 'react';
import Button from './Button'

export default function HostRoom(props) {

  const [ready] = useState(props.ready || "");
  const [players] = useState(props.players || "");

  let readyPlayers = players.filter(element => ready.includes(element));

  return (
    <Fragment>
      <h1>Room Code: {props.roomID}</h1>
      <h2>Players in Lobby</h2>
      {
        props.players.map(
          (player) => <h3>{player}</h3>
        )
      }
      <h2>Ready Players</h2>
      {
        props.ready.map(
          (player) => <h3>{player}</h3>
        )
      }
      <Button onClick = {() => props.onClick()}>Start Game</Button>

    </Fragment>
  );
}