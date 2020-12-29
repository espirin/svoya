const socket = io('/host');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_host", gameID);

    generalSocket.emit("get_game_state", gameID, function (state) {
        console.log(JSON.stringify(state, null, 2));
        $('#message').text(JSON.stringify(state, null, 2));
    });
});

function startGame() {
    socket.emit("start_game", gameID);
}

function correctAnswer() {
    socket.emit("correct_answer", {"question_id": questionID, "game_id": gameID});
}

function wrongAnswer() {
    socket.emit("wrong_answer", {"question_id": questionID, "game_id": gameID});
}

function openBoard() {
    socket.emit("open_board", gameID);
}
