var express = require('express');
var socketIo = require('socket.io');
var http = require('http');
var path = require('path');
var app = express();
console.log(path.join(__dirname, '../dist'));
app.use(express.static(path.join(__dirname, '../dist')));
var PORT = process.env.PORT || 9000;
var server = app.listen(PORT, function () {
    console.log("listening for requests on port " + PORT + " ,");
});
var io = socketIo(server);
io.on('connection', function (socket) {
    console.log('made socket connection', socket.id);
    socket.emit('connected_to_socket_server');
    socket.on('offer', function (data) {
        socket.broadcast.emit('offer', data);
    });
    socket.on('createConnection', function (peerConn) {
        socket.emit('connectionCreated', peerConn);
    });
    socket.on('peer', function (peer) {
        socket.emit('gotPeerConnection', peer);
    });
    socket.on('acceptConnection', function () {
        socket.broadcast.emit('connectionAccepted');
    });
    socket.on('connectionAccepted', function () {
        socket.broadcast.emit('connectionAcceptedToUsers');
    });
    socket.on('creatingConnection', function () {
        socket.broadcast.emit('creatingConnectionWithANewUser');
    });
});
