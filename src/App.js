import React, { Fragment, useState, useEffect, useRef } from 'react';
import './App.css';
import Canvas from './components/Canvas'
import HomeScreen from './components/HomeScreen'
import HostRoom from './components/HostRoom'
import Waiting from './components/Waiting'
import Header from './components/Header'
import Guess from './components/Guess'
import Loading from './components/Loading'
const io = require('socket.io-client');


function App() {

  // var socket = io('http://localhost:8080');
  const canvasData = useRef(null);
  const retrieveGuess = useRef(null);
  // console.log(canvasData.current.convertToBlob());

  const { current: socket } = useRef(io('http://localhost:8080'));

  //USE THIS FOR HOSTING OTHER DEVICES: (SHOULD BE YOUR LOCAL IP)
  //const { current: socket } = useRef(io('http://172.46.0.158:8080'));
  
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
    gameID: null,
    drawing: null,
    promptID: null,
    guess: "",
    endGameInfo: [],
  });

  
  const generateRandomString = function() {
    const possibleCharacters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let newShortURL = "";
    while (newShortURL.length < 4) {
      newShortURL = newShortURL + possibleCharacters[Math.floor(Math.random() * 34)];
    }
    return newShortURL;
  };


  //MAIN FUNCTIONS
  function enterRoom(name, room){ //TRIGGERS ON JOINING ROOM
    console.log("the join room button has been pressed")
    setState({ ...state, name: name, roomID: room.toUpperCase() });
  }
  
  function createRoom(){ //TRIGGERS ON MAIN PAGE
    let roomCode = generateRandomString()
    socket.emit('createRoom', { roomCode: `${roomCode}` });
    setState({ ...state, hostMachine: true, roomID: roomCode })
  }

  function startGame(){ //TRIGGERS AFTER ROOM HAS BEEN CREATED. ONLY AVAILABLE ON HOST MACHINE
    setState(prevState => ({ ...prevState, round: 0, ready: [] }))
    socket.emit('startGame', state.roomID);
  }

  function ready(){ //AVAILABLE ON MOBILE DEVICES ON CLIENT WAITING PAGE, DRAWING PAGE, AND GUESS PAGE
    socket.emit('Ready', state.roomID, state.name);
  }

  function nextRound(data) {
    console.log("next round command has been sent")
    socket.emit('nextRound', state.gameID, state.round, state.roomID);
  }

  function convertToImage(blob) {
    const arrayBufferView = new Uint8Array(blob.data);
    const blobData = new Blob([arrayBufferView], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blobData);
    return imageUrl;
  };

  //EVENT HANDLERS AND HELPER FUNCTIONS BELOW

  useEffect(() => { //Add player name to lobby by adding player to players array in state
    socket.on('hostMode', function (player) {
      console.log(`receiving a message that ${player} is joining the room.`)
      setState(prevState => ({ ...prevState, players: [ ...prevState.players, player] }))
    });

    return () => {
      socket.off('hostMode')
    }

  }, [])

  useEffect(() =>{ //Add player name to ready state array when received
    socket.on('Ready', function (name) {
      console.log("ready players: ",state.ready)
 
      if (state.ready.includes(name)){
        //do nothing
        console.log("the ready player is already in ready state")
      } else {
          setState(prevState => ({ ...prevState, ready: [ ...prevState.ready, name] }))
      }
    });
    return () => {
      socket.off('Ready')
    }
  },[state.ready])

  useEffect(() =>{ //Automatically start the next round once all players are ready.
    console.log(state.players, state.ready)
    if (state.ready.length === state.players.length && state.gameID && state.hostMachine === true){
      socket.emit('nextRound', state.gameID, state.round, state.roomID);
    }
  },[state.ready])

  useEffect(()=>{ //Start the game when command has been received. Display prompt, set round to 0.
    socket.on('startGame', (data) => {
      console.log("starting game command has been issued")
      data.forEach((wordPair)=>{
        if (wordPair[1] === state.playerPosition) {
          setState(prevState => ({ ...prevState, round: 0, prompt: wordPair[0], promptID: wordPair[2]}))
        } else {
        }
      })
      console.log(state.hostMachine)
      if (state.hostMachine === true) {
        setState(prevState => ({ ...prevState, round: 0}))
      }
    });

    return () => {
      socket.off('startGame')
    }

  },[state.playerPosition])

  useEffect(()=>{ //Receive player position after attempting to join room. Will reset state if duplicate name is received
    socket.on('joinRoom', function (name, position) {
      console.log(`Receiving a player position for ${name} and assigning ${position}`)
      if (name === state.name && position === "error" && state.playerPosition === null) {
        setState(prevState => ({ ...prevState, name: "", roomID: "" }))
      } else if (name === state.name){
        console.log("the position has been assigned", position)
        setState(prevState => ({ ...prevState, playerPosition: position }))
        }
    });
    return () => {
      socket.off('joinRoom')
    }
  },[state.name])

  useEffect(()=>{ //once the name in state has successfully changed during Join Room, send to the server the name and roomID
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
      } else {
        setState(prevState => ({ ...prevState, phase: "guess" }))
      }
    }
  },[state.round])

  useEffect(()=>{
    socket.on('game', function (game) {
      setState(prevState => ({ ...prevState, gameID: game }))

    });
    return () => {
      socket.off('game')
    }
  },[])

  function holdIt(data) {
    setState(prevState => ({ ...prevState, drawing: data}))

  }

  
  useEffect(()=>{
    socket.on('nextRound', function (game, round) {
      console.log("received a message for next round ", game, round)
      console.log("this is the current round", state.round)
      // setState(prevState => ({ ...prevState, phase: "loading"}))
      if (state.hostMachine === true) {
        setState(prevState => ({ ...prevState, round: round+1, ready: []}))
        console.log("I am the host machine you have no power over me")
        //do nothing
      } else if (state.round % 2 === 0) {
          canvasData.current.convertToBlob();
          console.log("this round is even! setting next round to odd!")
        } else {
          // socket.emit('')
          console.log("this round is odd! setting next round to even!")
          socket.emit('storeInfo', state.promptID, state.gameID, state.guess, state.round);
          setState(prevState => ({ ...prevState, phase: "loading"}))
        }
      });
      return () => {
        socket.off('nextRound')
      }
  },[state])
  
  
  useEffect(()=>{
    if (state.round % 2 === 0 && state.drawing){
      console.log("the drawing state has been set")
      console.log("emitting the following", state.promptID, state.gameID, state.drawing, state.gameID, state.round)
      socket.emit('storeInfo', state.promptID, state.gameID, state.drawing, state.round);
      setState(prevState => ({ ...prevState, phase: "loading"}))
      //setState(prevState => ({ ...prevState, drawing: null}))
    } else if (state.drawing === null) {
      console.log("there is no drawing son!")
    } else {
    console.log("the drawing state has been set for guess phase")
    }

  },[state.drawing])

  useEffect(()=>{
    socket.on('nextRoundInfo', function (submissionData) { //content, promptID, roundID, playerposition  received in array of arrays.
      console.log("I have received the content to start the next round", submissionData)
      if (submissionData){
        console.log("submission data actuvated")
      submissionData.forEach((wordPair)=>{
        if (wordPair[3] === state.playerPosition) {
          console.log('MATCHED!!!')
          console.log("prompt:", wordPair[0])
          console.log("promptID: ",wordPair[1])
          console.log("round: ",wordPair[2])

          if (wordPair[2] % 2 === 0) {
            setState(prevState => ({ ...prevState, prompt: wordPair[0], promptID: wordPair[1], round: wordPair[2]}))
          } else {
            setState(prevState => ({ ...prevState, drawing: wordPair[0], promptID: wordPair[1], round: wordPair[2]}))
          }

        } else {
          // Do nothing
        }
      });
    }
    return () => {
      socket.off('nextRoundInfo')
    }
  })
  },[state.playerPosition])

  useEffect(()=>{
    socket.on('endGame',function (finalArray) {
      setState(prevState => ({ ...prevState, endGameInfo: finalArray, phase: "endgame"}))
      console.log("this is the final", finalArray);
    })

    return () => {
      socket.off('endGame')
    }

   },[])

  

  
  return (
    <Fragment>
      <Header
        room = {state.roomID}
      >  
      </Header>

      {state.phase === "endgame" && !state.hostMachine &&
        <Fragment>
          <div className="endStyle">
            <h1>The Game has Ended</h1>
            <h1>Check the Screen for results!</h1>
          </div>
        </Fragment>
      }


      {state.phase === "draw" && !state.hostMachine &&//Client Draw Phase
      <Fragment>
        <h3 id="draw-this-title"style={{ textAlign: 'center' }}>Draw this: {state.prompt}</h3>

        <Canvas ref={ref => canvasData.current = ref }
                onData={(data) => holdIt(data)}
                ready={ready} />
      </Fragment>
      }

      {state.phase === "guess" && !state.hostMachine &&//Client Guess Phase
        <Fragment>
          <Guess
            ready={ready}
            setGuess={setState}
            imageSource={convertToImage(state.drawing)}
            ref={ref => retrieveGuess.current = ref }
          />
        </Fragment>
      }
      

      {state.roomID && state.hostMachine &&//HostMachine requires RoomID to properly excecute the game
      <Fragment>
        <HostRoom
          ready={state.ready}
          roomID={state.roomID}
          players={state.players}
          startGame={startGame}
          phase={state.phase}
          nextRound={nextRound}
          endGameInfo={state.endGameInfo}
        >
        </HostRoom>

      </Fragment>
      }

      {!state.roomID && !state.hostMachine &&//If client does not have a roomID, Client is in homescreen
        <Fragment>
          <HomeScreen
            onClick={enterRoom}
            createRoom={createRoom}
          >
          </HomeScreen>

       </Fragment>
      }

      {state.roomID && !state.hostMachine && state.phase === "" &&//If the client receives room ID and is not the host machine, put client in waiting room
      <Fragment>
        <Waiting
          name={state.name}
          room={state.roomID}
          message="Waiting for Game to Start"
          onClick={ready}
        ></Waiting>
      </Fragment>
      }

      {!state.hostMachine && state.phase === "loading" && //Client transtion from one round to another
      <Fragment>
        <Loading>

        </Loading>
      
      
      </Fragment>
      }

    </Fragment>
  );
}

export default App;
