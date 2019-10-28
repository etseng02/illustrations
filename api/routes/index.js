var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


/*

THIS IS THE SERVER

const http = require('http');
const static = require('node-static');
const file = new static.Server('./');
const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});
const port = 3210;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));


HTML

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>WebSocket Example</title>
    <script src="client.js"></script>
  </head>
  <body>
    <h1>WebSocket Example</h1>
    <p>Open your browser's developer tools to see client/server activity.</p>
  </body>
</html>


REPLACE SOME OF THE SERVER CODE

const http = require('http');
const crypto = require('crypto');
const static = require('node-static');
const file = new static.Server('./');
const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});
server.on('upgrade', function (req, socket) {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request');
    return;
  }
  // Read the websocket key provided by the client: const acceptKey = req.headers['sec-websocket-key']; // Generate the response value to use in the response: const hash = generateAcceptValue(acceptKey); // Write the HTTP response into an array of response lines: const responseHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}` ]; // Write the response back to the client socket, being sure to append two // additional newlines so that the browser recognises the end of the response // header and doesn't continue to wait for more header data: socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
});
 // Don't forget the hashing function described earlier:
function generateAcceptValue (acceptKey) {
  return crypto
  .createHash('sha1')
  .update(acceptKey + '258EAFA5-E914–47DA-95CA-C5AB0DC85B11', 'binary')
  .digest('base64');
}

*/
