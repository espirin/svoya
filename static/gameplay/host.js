const socket = io('/host');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_host", gameID);

    generalSocket.emit("get_game_state", gameID, function (state) {
        update_state(state)
    });
});

function startGame() {
    socket.emit("start_game", gameID);
}

function startCountdown() {
    socket.emit("start_countdown", gameID);
}

function correctAnswer() {
    socket.emit("correct_answer", gameID);
}

function wrongAnswer() {
    socket.emit("wrong_answer", gameID);
}

function openBoard() {
    socket.emit("open_board", gameID);
}

socket.on("test", function () {
    console.log("test");
});

socket.on("state_update", function (state) {
    update_state(state);
});

socket.on("update_clients", function (clients) {
    update_clients(clients);
});

function showQuestion(state) {
    $('#board').hide();
    let questionText = $('#questionText');
    questionText.show();
    questionText.text(state['question']['text'] + "\n Ответ:" + state['question']['answer']);
}

function showLobbyButtons() {
    $("#startGameButton").show();
}

function showBoardButtons() {
    $("#openBoardButton").hide();
    $("#startGameButton").hide();
}

function showQuestionButtons() {
    $("#startTimerButton").show();
}

function showCountdownButtons() {
    $("#startTimerButton").hide();
    $("#correctAnswerButton").hide();
    $("#wrongAnswerButton").hide();
}

function showAnswerButtons() {
    $("#correctAnswerButton").show();
    $("#wrongAnswerButton").show();
}

function showCorrectAnswerButtons() {
    $("#openBoardButton").show();
    $("#correctAnswerButton").hide();
    $("#wrongAnswerButton").hide();
}
