
import Peer from 'simple-peer';
import io from 'socket.io-client';
import axios from 'axios'

let PORT

(() => {
  axios.get(`/events`)
    .then((data) => {
      PORT = data.data.port
    })
})()

const socket = io.connect(`${window.location.hostname}:${PORT}`, { reconnect: true });

const video = document.getElementById('video');

const getsdp = document.getElementById('getsdp');
const connect = document.getElementById('connect');
const createCallConn = document.getElementById('createCallConn');
const answer = document.getElementById('answerCall');
const gettheirsdp = document.getElementById('gettheirsdp');

answer.disabled = true;
connect.disabled = true;
createCallConn.disabled = true;

let videoSream = peerConn;
let peerConn = peerConn;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  // video.srcObject = stream
  // video.play()
  // videoSream = stream
  getStream(stream);

})
  .catch(function (err) { console.log(err.name + ': ' + err.message); });

const getStream = (stream) => {
  videoSream = stream;
};

const vidStreams = () => {
  const peer = new Peer({ initiator: (location.hash === '#call'), stream: videoSream, trickle: false });
  peerConn = peer;
  createCallConn.disabled = true;
  socket.emit('createConnection');
};

createCallConn.onclick = () => {
  if (location.hash = '#call') {
    socket.emit('creatingConnection');
    return vidStreams();
  } else {
    location.hash = '#call';
  }
};

// Accept connection from the next user
answer.onclick = (e) => {
  e.preventDefault();
  answer.disabled = true;

  vidStreams();
  peerConn.signal(JSON.parse(gettheirsdp.value));

  peerConn.on('stream', function (mediaStream) {
    console.log(mediaStream);
    video.srcObject = mediaStream;
    video.onloadedmetadata = function (e) {
      console.log('loaded', e);
      video.play();
    };
  });

  socket.emit('acceptConnection');
  peerConn.on('error', err => console.log('error', err));
};

connect.onclick = () => {

  connect.disabled = true;

  peerConn.signal(JSON.parse(gettheirsdp.value));
  peerConn.on('stream', function (mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function (e) {
      console.log('loaded', e);
      video.play();
    };
  });
  socket.emit('connectionAccepted');
};

socket.on('offer', (data) => {
  if (data.type == 'answer') {
    answer.disabled = true;
  } else {
    answer.disabled = false;
  }
  gettheirsdp.value = JSON.stringify(data);
});

socket.on('connectionCreated', () => {
  peerConn.on('signal', data => {
    socket.emit('offer', data);
    getsdp.value = JSON.stringify(data);
  });
});

socket.on('connectionAccepted', () => {
  connect.disabled = false;
});

socket.on('connectionAcceptedToUsers', () => {
  answer.disabled = true;
});

socket.on('creatingConnectionWithANewUser', () => {
  createCallConn.disabled = true;
});

socket.on('connected_to_socket_server', () => {
  createCallConn.disabled = false;
});
