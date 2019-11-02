var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const prompt = require('./utils/sentencer.js')
const generatePlayersArray = require('./utils/generatePlayersArray.js')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
const db = require("./db");

const rooms = require("./routes/create_room")
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.send('I am alive!');
});


//Socket connection to handle Room Creation Logic
io.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  //console.log('a user connected');

  socket.on('createRoom', function (data) {
    console.log(data);
      db.query(`
      INSERT INTO rooms (code)
      VALUES 
      ($1);
      `, [data.roomCode])
      
      .then((res)=>{
      socket.name = "host";
      socket.join(data.roomCode);
      console.log("A new room has been created:", data.roomCode)
      //console.log("These are all the current rooms: ", io.sockets.adapter.rooms)\
      //console.log(Object.keys(socket.rooms))
        
      }).catch((err)=>{
        console.error(err)
      })
  });

  socket.on('joinRoom', function (name, room) {

    db.query(`
      INSERT INTO players (name, room_id, player_position)
        VALUES ($1, 
          (SELECT id FROM rooms WHERE rooms.code = $2), 
          (SELECT COUNT (players.id) FROM players
            JOIN rooms ON rooms.id = players.room_id
            WHERE rooms.code = $2) +1);
    `, [name, room])
    .then((res) => {
      return db.query(`
        SELECT player_position FROM players 
        WHERE players.name = $1 AND players.room_id = (SELECT rooms.id FROM rooms WHERE rooms.code = $2)
      `, [name, room])
    }).then((res) => {
      socket.join(room);
      return res
    })
    .then((res) => {
      
      console.log(res.rows[0].player_position)
      socket.name = name;
      io.in(room).emit('joinRoom', name, res.rows[0].player_position)
      console.log(`${socket.name} has joined ${room}`)
      //add db query here use name and room
      
      // var clients = io.sockets.adapter.rooms[room].sockets;   
      // console.log(clients)
      socket.to(room).emit('hostMode', `${name}`);

    }).catch((err) => {
      console.log(err)
    })
    
    
  });

  socket.on('Ready', function (room, name) {
    console.log(`${name} is ready in ${room}`)
    socket.to(room).emit('Ready', `${name}`);
  });

  socket.on('startGame', function (room) {
    console.log(`${room} has requested to start a game`)
    //insert start game query logic here
    db.query(`
      INSERT INTO games (room_id)
      VALUES ((SELECT rooms.id FROM rooms WHERE rooms.code = $1))
      RETURNING games.id;
      `, [room])
      .then((res) => {
        io.in(room).emit('game', res.rows[0].id)
      })

    .then((res) => {
      return db.query(`
        SELECT COUNT (players.id) FROM players
        WHERE players.room_id = (SELECT id FROM rooms WHERE code = $1);
      `, [room])
      
    })
    
    .then((res) => {
      // console.log(res)
      let numberOfPlayers = parseInt(res.rows[0].count)
      
      let prompts = [];
      let playerArray = generatePlayersArray(numberOfPlayers);
      for (let i = 1; i <= res.rows[0].count; i++) {
        prompts.push(prompt());
      }
      // console.log(prompts, playerArray);
      //socket.to(room).emit('startGame', 'start');
      for(let i = 1; i <= res.rows[0].count; i++) {
        // console.log(prompts[i-1])
        // console.log(playerArray[i-1])

        db.query(`
          INSERT INTO prompts (game_id, info)
          VALUES ((SELECT id FROM games WHERE games.room_id = (SELECT id FROM rooms WHERE code = $1)),
          $2)
          RETURNING info;
        `, [room, JSON.stringify(`{"word": "${prompts[i-1]}", "queue": [${playerArray[i-1]}], "drawings": [], "guesses": []}`)])
      }
      

    }).then((res) => {
      return db.query(`
      SELECT info, id FROM prompts
      WHERE game_id = (SELECT id FROM games WHERE games.room_id = (SELECT id FROM rooms WHERE code = $1));
      `, [room])
    }).then((res) => {
      // console.log("this is adding id value", res.rows)
      let wordArray = [];
      let positionArray = [];
      let idArray = [];
      for(let i = 0; i < res.rows.length; i++) {

        let jsonData = JSON.parse(res.rows[i].info);
        wordArray.push(jsonData.word)
        positionArray.push(jsonData.queue[0])
        idArray.push(res.rows[i].id)
      }
      // console.log("these are the arrays", wordArray, positionArray)
      let finalArray = [];
      for(let i = 0; i < wordArray.length; i++) {
        finalArray.push([wordArray[i], positionArray[i], idArray[i]]);
      }
      console.log(finalArray);
      io.in(room).emit('startGame', finalArray)
      //socket.to(room).emit('startGame', finalArray);
    })
    .catch((err) => {
      console.log(err)
    })
    
  });



  socket.on('nextRound', function(game, round, room){
    //console.log("Testing game and round here", game, round, room)
    console.log("this is the round number", round)
    if (round === 0) {
      socket.to(room).emit('nextRound', game, round)
    } else {
      socket.to(room).emit('nextRound', game, round)
    }

    setTimeout(() => 

      db.query(`
      SELECT info, id FROM prompts
      WHERE game_id = $1;
      `, [game])
      .then((res) => {
        console.log("this is the response", res.rows)
        let infoArray = res.rows;
        let submissionData = [];

        if (round % 2 === 0) {
          round = round + 1;
          for (let i = 0; i < infoArray.length; i++) {
            // why does this not need to be parsed?
            let infoQueue = infoArray[i].info.queue
            console.log(infoQueue)
            let jsonInfo = infoArray[i].info
            let drawingsLength = jsonInfo.drawings.length - 1;
            submissionData.push([jsonInfo.drawings[drawingsLength], infoArray[i].id, round, infoQueue[round]])
          }
          console.log(submissionData)
          io.in(room).emit('nextRoundInfo', submissionData)
          return submissionData;
          
        } else {
          round = round + 1;
          for (let i = 0; i < infoArray.length; i++) {
            let jsonInfo = infoArray[i].info
            let infoQueue = infoArray[i].info.queue
            let guessesLength = jsonInfo.guesses.length - 1;
            submissionData.push([jsonInfo.guesses[guessesLength], infoArray[i].id, round, infoQueue[round]])
          }
          io.in(room).emit('nextRoundInfo', submissionData)
          return submissionData;
        }
    }).catch((err) => {
      console.error(err)
    }), 5000) 
    
  })

  // socket.on('clientNextRound', function(game, round, prompt, blob) {
    
  // })
  socket.on('storeInfo', function(promptID, gameID, content, round){
    //console.log("Testing game and round here", game, round, room)
    // console.log("Content received", promptID, content, gameID, round)
    console.log("this is the ocntent", content);
    db.query(`
      SELECT info FROM prompts
      WHERE prompts.id = $1
    `, [promptID])
    .then((res) => {
      // console.log(res.rows)
      console.log(res.rows[0]);
      let jsonInfo = JSON.parse(res.rows[0].info)
      if(round % 2 === 0) {
        jsonInfo.drawings.push(content)
      } else{
        jsonInfo.guesses.push(content)
      } 
      db.query(`
        UPDATE prompts
        SET info = $1
        WHERE prompts.id = $2
      `, [JSON.stringify(jsonInfo), promptID])
      // console.log("this is th json object", jsonInfo)
    })
    .catch((err) => {
      console.error(err);
    })
  })


});


module.exports = app;

