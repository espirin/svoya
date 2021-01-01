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

function update_state(state) {
    if (state['state'] === 'LOBBY') {
        $('#message').text("Лобби");
    }
    if (state['state'] === 'BOARD') {
        $("#image").hide();
        showBoard(state);
    }
    if (state['state'] === 'QUESTION') {
        showQuestion(state);
        console.log(state);
        if (state['question']['video_id'] != null) playVideo(state);
        if (state['question']['image_url'] != null) showImage(state);
    }
    if (state['state'] === 'COUNTDOWN') {
        $("#playerContainer").hide();
        showQuestion(state);
        if (state['question']['image_url'] != null) showImage(state);
        showCountdown(state['time'], state['time_remaining']);
    }
    if (state['state'] === 'ANSWERING') {
        hideCountdown();
        showQuestion(state);
        if (state['question']['image_url'] != null) showImage(state);
    }
    if (state['state'] === 'CORRECT_ANSWER') {
        showAnswer(state);
        if (state['question']['image_url'] != null) showImage(state);
    }
}

function showQuestion(state) {
    $('#board').hide();
    let questionText = $('#questionText');
    questionText.show();
    questionText.text(state['question']['text']);
}

function playVideo(state) {
    let container = $("#playerContainer");
    container.show();
    container.attr("src", "/media/" + state['question']['video_id'] + "/" + state['question']['video_start'] + "/"
        + state['question']['video_end']);
}

function showImage(state) {
    let image = $("#image");
    image.attr("src", state["question"]["image_url"]);
    image.show();
}
