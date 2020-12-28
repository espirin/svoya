const generalSocket = io('/');
new ClipboardJS('#copyURLButton');

setInterval(function () {
    let startTime = Date.now();
    generalSocket.emit('ping', function () {
        let latency = Date.now() - startTime;
        console.log("Ping: " + latency + "ms");
    });
}, 2000);

generalSocket.on("connect", function () {
    console.log("Getting game state");
    generalSocket.emit("get_game_state", $("#gameID").text(), function (state) {
        console.log("Received game state");
        console.log(JSON.stringify(state, null, 2));
        $('#message').text(JSON.stringify(state, null, 2));
    });
});

socket.on("state_update", function (state) {
    console.log("state update message");
    console.log(JSON.stringify(state, null, 2));
    $('#message').text(JSON.stringify(state, null, 2));
});
