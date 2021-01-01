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

function update_state(state) {
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
        hideCountdown();
        showQuestion(state);
    }
    if (state['state'] === 'CORRECT_ANSWER') {
        showAnswer(state);
    }
}

function showQuestion(state) {
    $('#board').hide();
    let questionText = $('#questionText');
    questionText.show();
    questionText.text(state['question']['text'] + "\n Ответ:" + state['question']['answer']);
}
