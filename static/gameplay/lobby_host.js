const socket = io('/lobby_host');

socket.on("connect", function () {
    console.log("connected to lobby");
    socket.emit("connect_host", $("#packID").text(), function (lobbyURL) {
        $("#lobbyURL").text(lobbyURL)
    });
});

socket.on("reload_host", function () {
    location.reload(true);
});
