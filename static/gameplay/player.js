const socket = io('/player');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_player", gameID);

    generalSocket.emit("get_game_state", gameID, function (state) {
        update_state(state)
    });
});

function openQuestion(questionID) {
    socket.emit("open_question", {"question_id": questionID, "game_id": gameID});
}

function answerQuestion() {
    socket.emit("answer_question", gameID, function (response) {
        if (response === "nope") {
            $("#answerButton").hide();
            $("#answerFalseButton").show();
            setTimeout(function () {
                $("#answerButton").show();
                $("#answerFalseButton").hide();
            }, 1000)
        }
    });
}

socket.on("test", function () {
    console.log("test");
});

socket.on("state_update", function (state) {
    update_state(state)
});

socket.on("update_clients", function (clients) {
    update_clients(clients);
});

function update_state(state) {
    if ("question" in state) {
        questionID = state["question"]["id"]
    }
    if (state['state'] === 'LOBBY') {
        $('#message').text("Лобби");
    }
    if (state['state'] === 'BOARD') {
        showBoard(state);
    }
    if (state['state'] === 'QUESTION') {
        showQuestion(state);
    }
    if (state['state'] === 'COUNTDOWN') {
        showQuestion(state);
        showCountdown(state['time']);
    }
    if (state['state'] === 'ANSWERING') {
        clearTimeout();
        showQuestion(state);
    }
}
