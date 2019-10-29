var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
      `, [data.roomCode]).then((res)=>{
        socket.join(data.roomCode);
        console.log("A new room has been created:", data.roomCode)
        //console.log("These are all the current rooms: ", io.sockets.adapter.rooms)\
        console.log(Object.keys(socket.rooms))
        
      }).catch((err)=>{
        console.error(err)
      })
  });

  socket.on('joinRoom', function (data) {
    //console.log(data);
    console.log(Object.keys(socket.rooms))
    socket.join(data.roomCode);
    //console.log(io.sockets.clients(data.roomCode));
    // console.log(io.of(data.roomCode).clients());
    //console.log(Object.keys(io.sockets.sockets))
    socket.to(data.roomCode).emit('system', `A new player has joined ${data.roomCode}`);
  });
});

//Socket connection to handle Join Room logic
// io.on('connection', function (socket) {

//   });
// });


module.exports = app;

