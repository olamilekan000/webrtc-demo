"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var simple_peer_1 = __importDefault(require("simple-peer"));
var socket = io.connect('http://localhost:9000');
console.log('socklkk', socket);
console.log('socklkk');
socket.on('news', function (data) {
    console.log(data);
});
// const userId = uuidv1().split('-')[4];
// const peer = new Peer(userId);
var video = document.getElementById('video');
var video2 = document.getElementById('video2');
var call = document.getElementById('call');
var genCallId = document.getElementById('genCallId');
var callId = document.getElementById('callId');
var getsdp = document.getElementById('getsdp');
var connect = document.getElementById('connect');
var generate = document.getElementById('generate');
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
}).then(function (stream) {
    var peer = new simple_peer_1.default({ initiator: (location.hash === '#call'), stream: stream, trickle: false });
    console.log(peer);
    generate.onclick = function () {
    };
    peer.on('signal', function (data) {
        console.log(data);
        getsdp.value = JSON.stringify(data);
    });
    peer.on('stream', function (stream) {
        video.srcObject = stream;
        video.play();
    });
    connect.onclick = function () {
        peer.signal(JSON.parse(getsdp.value));
    };
})
    .catch(function (err) { console.log(err.name + ': ' + err.message); });
