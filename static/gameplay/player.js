const socket = io('/player');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_player", gameID);

    generalSocket.emit("get_game_state", gameID, function (state) {
        console.log(JSON.stringify(state, null, 2));
        $('#message').text(JSON.stringify(state, null, 2));
    });
});

function answerQuestion() {
    socket.emit("answer_question", gameID);
}
