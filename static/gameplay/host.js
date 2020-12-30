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

socket.on("test", function () {
    console.log("test");
});

socket.on("state_update", function (state) {
    console.log("state update message");
    $('#message').text(JSON.stringify(state, null, 2));
    if ("question" in state) {
        questionID = state["question"]["id"]
    }
});

socket.on("update_clients", function (clients) {
    update_clients(clients);
});
