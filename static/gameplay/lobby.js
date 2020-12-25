const socket = io('/lobby');

socket.on("connect", function () {
    console.log("hey");
    socket.emit('test', 'TeSt')
});
