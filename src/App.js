import React, { Fragment, useState } from 'react';
import './App.css';
import Canvas from './components/Canvas'
import Button from './components/Button'
import JoinRoom from './components/JoinRoom'
import HostRoom from './components/HostRoom'

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3030')



function App() {
  
  const [state, setState] = useState({
    roomID: "",
    name: "",
    playerPosition: null,
    keyword: "",
    hostMachine: false,
    phase: "",
  });

  function enterRoom(name, room){
    setState({ ...state, name: name, roomID: room });
  }

  
  const generateRandomString = function() {
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newShortURL = "";
    while (newShortURL.length < 4) {
      newShortURL = newShortURL + possibleCharacters[Math.floor(Math.random() * 36)];
    }
    return newShortURL;
  };

  function createRoom(){
    let roomCode = generateRandomString()
    setState({ ...state, hostMachine: true, roomID: roomCode })
  }
  
  return (
    <Fragment>

      {state.roomID && state.hostMachine &&
      <Fragment>
        <HostRoom
          roomID={state.roomID}
        >
        </HostRoom>

      </Fragment>
      }

      {!state.roomID && !state.hostMachine &&//When roomID is falsy, Join room field, name field, and create room field will be rendered
        <Fragment>
          <JoinRoom
            onClick={enterRoom}
          >
          </JoinRoom>
          <Button
            onClick={createRoom}
          >Create Room</Button>
       </Fragment>
      }

      {state.roomID && !state.hostMachine && //Draw Phase
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Draw Phase</h3>
        <Canvas />
      </Fragment>
      }


    </Fragment>
  );
}

export default App;
