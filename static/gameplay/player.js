const socket = io('/player');
const generalSocket = io('/');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_player", $("#gameID").text());
});

setInterval(function () {
    let startTime = Date.now();
    generalSocket.emit('ping', function () {
        let latency = Date.now() - startTime;
        console.log(latency);
    });
}, 2000);
