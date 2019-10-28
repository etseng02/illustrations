import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import Canvas from './components/Canvas'
import Button from './components/Button'
import JoinRoom from './components/JoinRoom'
import HostRoom from './components/HostRoom'
const io = require('socket.io-client');


function App() {

  var socket = io('http://localhost');

  
  const [state, setState] = useState({
    roomID: "",
    name: "",
    playerPosition: null,
    keyword: "",
    hostMachine: false,
    phase: "",
  });

  //call this function with the number of players
  //IE: generatePlayersArray(players.count()) or something similar
  function generatePlayersArray(size, startAt = 1) {
    const players = [...Array(size).keys()].map(i => i + startAt)
    players.unshift(players.pop())
    players.forEach(() => {
       players.push(players.shift())
       //THIS IS WHERE WE WILL ADD PLAYERS ARRAY INTO JSON
    });
  }

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

  useEffect(() => {
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  })
  
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
