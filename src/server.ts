
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

console.log(path.join(__dirname, '../dist'));

app.use(cors());

const PORT = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use('/app', express.static('dist'));

app.get('/', (req, res) => {
  res.send(`

  <p>${PORT}</p>
  <button onClick={window.location='/app/'}>Go to app<button>
  <script>

  window.PORT = ${PORT}
  localStorage.setItem('PORT', ${PORT})

  </script>

  `);
});

const server = http.createServer(app)
server.listen(PORT, function () {
  console.log(`listening for requests on port ${PORT} ,`);
});

const io = socketIo(server);
io.set('origins', '*:*');

io.on('connection', (socket) => {

  console.log('made socket connection', socket.id);
  socket.emit('connected_to_socket_server');

  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('createConnection', (peerConn) => {
    socket.emit('connectionCreated', peerConn);
  });

  socket.on('peer', (peer) => {
    socket.emit('gotPeerConnection', peer);
  });

  socket.on('acceptConnection', () => {
    socket.broadcast.emit('connectionAccepted');
  });

  socket.on('connectionAccepted', () => {
    socket.broadcast.emit('connectionAcceptedToUsers');
  });

  socket.on('creatingConnection', () => {
    socket.broadcast.emit('creatingConnectionWithANewUser');
  });

});
