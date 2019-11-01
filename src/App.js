import React, { Fragment, useState, useEffect, useRef } from 'react';
import './App.css';
import Canvas from './components/Canvas'
import Button from './components/Button'
import JoinRoom from './components/JoinRoom'
import HostRoom from './components/HostRoom'
import Waiting from './components/Waiting'
import Header from './components/Header'
const io = require('socket.io-client');


function App() {

  // var socket = io('http://localhost:8080');
  const { current: socket } = useRef(io('http://localhost:8080'));
  
  const [state, setState] = useState({
    roomID: "",
    name: "",
    playerPosition: null,
    prompt: "",
    hostMachine: false,
    phase: "",
    players:[],
    ready: [],
    round: null,
  });

  
  const generateRandomString = function() {
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newShortURL = "";
    while (newShortURL.length < 4) {
      newShortURL = newShortURL + possibleCharacters[Math.floor(Math.random() * 36)];
    }
    return newShortURL;
  };

  function enterRoom(name, room){
    console.log("the join room button has been pressed")
    setState({ ...state, name: name, roomID: room });
  }
  
  function createRoom(){
    let roomCode = generateRandomString()
    socket.emit('createRoom', { roomCode: `${roomCode}` });
    
    setState({ ...state, hostMachine: true, roomID: roomCode })
  }

  function startGame(){
    socket.emit('startGame', state.roomID);
  }

  function ready(){
    //console.log(state.room, state.name, "is going to be sent to the server as ready")
    socket.emit('Ready', state.roomID, state.name);
  }

  useEffect(() => {
    socket.on('hostMode', function (player) {
      console.log(`receiving a message that ${player} is joining the room.`)
      //console.log(player)
      setState(prevState => ({ ...prevState, players: [ ...prevState.players, player] }))
      //console.log(state.players)
    });
  }, [])

  useEffect(() =>{
    socket.on('Ready', function (name) {
      //console.log("I have received a message")
      if (state.ready.includes(name)){
        //do nothing
        console.log("the ready player is already in ready state")
      } else {
          setState(prevState => ({ ...prevState, ready: [ ...prevState.ready, name] }))
      }
    });
  },[])

  useEffect(()=>{
  //   console.log('HOOK REDEFINED', state);
    socket.on('startGame', (data) => {
      console.log("starting game command has been issued")
      console.log("this is the data received:",data)
      // console.log("thats the state son:",state)
      data.forEach((wordPair)=>{
        // console.log(wordPair, state.playerPosition)
        if (wordPair[1] === state.playerPosition) {
          // console.log('MATCHED!!!');
          setState(prevState => ({ ...prevState, round: 0, prompt: wordPair[0]}))
        } else {
          // console.log('DID NOT MATCH', wordPair[1], state.playerPosition);
        }
      })
    });

    return () => {
      socket.off('startGame')
    }

  },[state.playerPosition])

  useEffect(()=>{
    socket.on('joinRoom', function (name, position) {
      // console.log(`Receiving a player position for ${name} and assigning ${position}`)
      // console.log ("this is the client name: ", state.name)
      // console.log ("this is the server name: ", name)
      console.log(`Receiving a player position for ${name} and assigning ${position}`)
      if (name === state.name){
        console.log("the position has been assigned", position)
        setState(prevState => ({ ...prevState, playerPosition: position }))
        }
    });
    return () => {
      socket.off('joinRoom')
    }
  },[state.name])

  useEffect(()=>{
    if (state.name){
      console.log("the name state has changed, sending to the server a joinRoom Command")
      socket.emit('joinRoom', state.name, state.roomID );
    }
  },[state.name])

  useEffect(()=>{
    if (state.round === null) {

    } else if (state.round >= 0){
      console.log("the round state has changed")
      if (state.round % 2 == 0) {
        setState(prevState => ({ ...prevState, phase: "draw" }))
      }
    }
  },[state.round])

  

  //delete later this is for testing purposes
  function draw() {
    setState({ ...state, phase: "draw" })
  }

  
  return (
    <Fragment>
      <Header
        room = {state.roomID}
      >  
      </Header>


      {state.phase === "draw" && !state.hostMachine &&//Draw Phase
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Draw this: {state.prompt}</h3>
        <Canvas />
      </Fragment>
      }

      {state.roomID && state.hostMachine &&
      <Fragment>
        <HostRoom
          ready={state.ready}
          roomID={state.roomID}
          players={state.players}
          onClick={startGame}
          phase={state.phase}
        >
        </HostRoom>

      </Fragment>
      }

      {!state.roomID && !state.hostMachine &&//When roomID is falsy, Join room field, name field, and create room field will be rendered
        <Fragment>
          <Button
            onClick={draw}
          >Draw Iceman</Button>
          <JoinRoom
            onClick={enterRoom}
          >
          </JoinRoom>
          <Button
            onClick={createRoom}
          >Create Room</Button>
       </Fragment>
      }

      {state.roomID && !state.hostMachine && //If the client receives room ID and is not the host machine, put client in waiting room
      <Fragment>
        <Waiting
          name={state.name}
          room={state.roomID}
          message="Waiting for Game to Start"
          onClick={ready}
        ></Waiting>
      </Fragment>
      }

       



    </Fragment>
  );
}

export default App;
