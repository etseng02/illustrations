import React, { Fragment, useState }  from "react";

import Button from './Button'

export default function Waiting(props) {

  const [name] = useState(props.name || "");
  const [room] = useState(props.room || "");

  return (
    <Fragment>
      <h1>Name: {name}</h1>
      <h1>Connected to room: {room}</h1>
      <h1>{props.message}</h1>
      <Button onClick = {() => props.onClick(room, name)}>Ready</Button>

    </Fragment>
    
  );


}