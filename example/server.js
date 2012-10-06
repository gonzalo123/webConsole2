var LOCAL_PORT = 5600;
var SOKET_IO_PORT = 8000;
var ioClients = [];

var io = require('socket.io').listen(SOKET_IO_PORT);

var server = require('net').createServer(function (socket) {
    socket.on('data', function (msg) {
        ioClients.forEach(function (ioClient) {
            ioClient.emit('log', msg.toString().trim());
        });
    });
}).listen(LOCAL_PORT);

io.sockets.on('connection', function (socketIo) {
    ioClients.push(socketIo);
});

server.on('listening', function () {
    console.log("TCP server accepting connection on port: " + LOCAL_PORT);
});
