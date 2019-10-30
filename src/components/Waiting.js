import React, { Fragment }  from "react";

import Button from './Button'

export default function Waiting(props) {

  return (
    <Fragment>
      <h1>{props.message}</h1>
      <Button>Ready</Button>

    </Fragment>
    
  );


}