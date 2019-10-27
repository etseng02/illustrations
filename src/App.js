import React, { Fragment, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas'
import Button from './components/Button'
import JoinRoom from './components/JoinRoom'

function App() {
  
  const [state, setState] = useState({
    roomID: "",
    playerPosition: null,
    name: ""
  });

  return (
    <Fragment>

      {state.roomID === "" && 
        <Fragment>
          <JoinRoom></JoinRoom>
       </Fragment>
      }


      <h3 style={{ textAlign: 'center' }}>Draw</h3>
      <Canvas />
    </Fragment>
  );
}

export default App;
