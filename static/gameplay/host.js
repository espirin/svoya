const socket = io('/host');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_host", $("#gameID").text());
});

function startGame() {
    socket.emit("start_game", $("#gameID").text());
}
