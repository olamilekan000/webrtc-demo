"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var simple_peer_1 = __importDefault(require("simple-peer"));
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var options = {
    rememberUpgrade: true,
    transports: ['websocket'],
    secure: true,
    rejectUnauthorized: false,
    reconnect: true,
};
var PORT = parseInt(localStorage.getItem('PORT'), 10);
console.log('port ===', PORT);
var socket = socket_io_client_1.default.connect(window.location.hostname + ":" + PORT, { reconnect: true });
// const socket = io.connect(`http://localhost:${PORT}`, options);
var video = document.getElementById('video');
var getsdp = document.getElementById('getsdp');
var connect = document.getElementById('connect');
var createCallConn = document.getElementById('createCallConn');
var answer = document.getElementById('answerCall');
var gettheirsdp = document.getElementById('gettheirsdp');
answer.disabled = true;
connect.disabled = true;
createCallConn.disabled = true;
var videoSream = peerConn;
var peerConn = peerConn;
if (navigator.getUserMedia) {
    console.log('yeaa');
}
navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
    navigator.mediaDevices.webkitGetUserMedia ||
    navigator.mediaDevices.mozGetUserMedia;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(function (stream) {
    // video.srcObject = stream
    // video.play()
    // videoSream = stream
    getStream(stream);
})
    .catch(function (err) { console.log(err.name + ': ' + err.message); });
var getStream = function (stream) {
    videoSream = stream;
};
var vidStreams = function () {
    var peer = new simple_peer_1.default({ initiator: (location.hash === '#call'), stream: videoSream, trickle: false });
    peerConn = peer;
    createCallConn.disabled = true;
    socket.emit('createConnection');
};
createCallConn.onclick = function () {
    if (location.hash = '#call') {
        socket.emit('creatingConnection');
        return vidStreams();
    }
    else {
        location.hash = '#call';
    }
};
// Accept connection from the next user
answer.onclick = function (e) {
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
    peerConn.on('error', function (err) { return console.log('error', err); });
};
connect.onclick = function () {
    connect.disabled = true;
    peerConn.signal(JSON.parse(gettheirsdp.value));
    peerConn.on('stream', function (mediaStream) {
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
            console.log('loaded: accepted offer', e);
            video.play();
        };
    });
    socket.emit('connectionAccepted');
};
socket.on('offer', function (data) {
    if (data.type == 'answer') {
        answer.disabled = true;
    }
    else {
        answer.disabled = false;
    }
    gettheirsdp.value = JSON.stringify(data);
});
socket.on('connectionCreated', function () {
    peerConn.on('signal', function (data) {
        socket.emit('offer', data);
        getsdp.value = JSON.stringify(data);
    });
});
socket.on('connectionAccepted', function () {
    connect.disabled = false;
});
socket.on('connectionAcceptedToUsers', function () {
    answer.disabled = true;
});
socket.on('creatingConnectionWithANewUser', function () {
    createCallConn.disabled = true;
});
socket.on('connected_to_socket_server', function () {
    createCallConn.disabled = false;
});
console.log(window.location.hostname + ":" + PORT);
