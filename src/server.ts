
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')
var Pusher = require('pusher');

const app = express();

app.set('view engine', 'ejs');
console.log(path.join(__dirname, '../dist'));

app.use(cors());

const pusher = new Pusher({
  appId: '931646',
  key: '480eee46f1a6a10a75f8',
  secret: 'aee4ebdd4d48d9cbbcbe',
  cluster: 'mt1',
  useTLS: true
});

const PORT = process.env.PORT || 9000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  pusher.trigger('cob', 'get-port', PORT);
  res.send(`

  <p>${PORT}</p>
  <button onClick={window.location='/app/'}>Go to app<button>
  <script>
  
  window.PORT = ${PORT}
  localStorage.setItem('PORT', ${PORT})
  
  </script>

  `)
})

app.use('/app', express.static('dist'));

const server = app.listen(PORT, function () {
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

