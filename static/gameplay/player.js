const socket = io('/player');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_player", gameID);

    generalSocket.emit("get_game_state", gameID, function (state) {
        update_state(state)
    });
});

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

socket.on("state_update", function (state) {
    update_state(state)
});

socket.on("update_clients", function (clients) {
    update_clients(clients);
});

function showQuestion(state) {
    $('#board').hide();
    let questionText = $('#questionText');
    questionText.show();
    questionText.text(state['question']['text']);
}

function showLobbyButtons() {
}

function showBoardButtons() {

}

function showQuestionButtons() {

}

function showCountdownButtons() {

}

function showAnswerButtons() {

}

function showCorrectAnswerButtons() {

}
