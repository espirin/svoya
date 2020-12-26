const socket = io('/lobby');

socket.on("connect", function () {
    console.log("connected to lobby");
    socket.emit("connect_player", $("#lobbyID").text(), function (lobbyURL) {
        $("#lobbyURL").text(lobbyURL)
    });
});

socket.on("host_disconnected", function () {
    console.log("host disconnected");
    $("#lobbyURL").text("Хост отключился");
});
