const express = require('express');
const app = express();
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', socket => {
    let nsData = namespaces.map( ns => {
        return {
            image: ns.image,
            endpoint: ns.endpoint
        }
    });

    socket.emit('nsList', nsData);
});

namespaces.forEach( namespace => {
    io.of(namespace.endpoint).on('connection', nsSocket => {
        nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            nsSocket.join(roomToJoin);
            const clientsCount = io.of('/wiki').sockets.size;

            numberOfUsersCallback(clientsCount);
        });
        nsSocket.on('newMessageToServer', msg => {
            console.log(msg);
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: "farshid",
                avatar: 'https://via.placeholder.com/30'
            }

            const roomTitle = Object.keys(nsSocket.rooms)[1];
            console.log(nsSocket.adapter.rooms);
            io.of('/wiki').to(roomTitle).emit('messageToClients', fullMsg);
        })
    });
});