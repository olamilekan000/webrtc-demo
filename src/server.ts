
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();
console.log(path.join(__dirname, '../dist'));

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../dist')));

const PORT = process.env.PORT || 9000

app.get('/events', (req, res) => {
  res.json({
    port: PORT
  })
})

const server = app.listen(PORT, function () {
  console.log(`listening for requests on port ${PORT} ,`);
});

const io = socketIo(server);

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
