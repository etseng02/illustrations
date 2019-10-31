import React, { Fragment } from 'react';

import "./Header.css";

export default function Header(props) {

  return (
    <Fragment>
      <header>
        <h1 id="logo">Skedoodle!</h1>
        <h1 id="room">{props.room}</h1>
      </header>

    </Fragment>
  )
}