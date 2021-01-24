const generalSocket = io('/');
new ClipboardJS('#copyURLButton');

let currentState;
let gameID = $("#gameID").text();
let username = $("#username").text();

setInterval(function () {
    let startTime = Date.now();
    generalSocket.emit('ping', function () {
        let latency = Date.now() - startTime;
        console.log("Ping: " + latency + "ms");
    });
}, 2000);

function openQuestion(questionID) {
    socket.emit("open_question", {"game_id": gameID, "question_id": questionID});
}

function update_clients(clients) {
    const players = $('#playersCards');
    players.empty();
    $.each(clients['players'], function (i) {
        if (clients['players'][i]['username'] === username) {
            if (clients['players'][i]['can_answer']) {
                $("#answerDisabledButton").hide();
                $("#answerButton").show();
            } else {
                $("#answerButton").hide();
                $("#answerDisabledButton").show();
            }
        }
        players.append(
            $('<div/>')
                .addClass("col")
                .append($("<div></div>")
                    .addClass("card")
                    .attr("style", "height: 210px")
                    .append($("<img>")
                        .addClass("card-img-top")
                        .attr("src", "/static/images/bobr.jpg"))
                    .append($("<div></div>")
                        .attr("id", "cardBody" + clients['players'][i]['username'])
                        .append($("<div></div>")
                            .addClass("col")
                            .append($("<h5></h5>").addClass("card-title text-center text-truncate")
                                .text(clients['players'][i]["name"]))
                            .append($("<h5></h5>").addClass("card-title text-center font-weight-bold")
                                .text(clients['players'][i]["score"]))))))
        if (clients['players'][i]['countdown_winner']) {
            $("#cardBody" + clients['players'][i]['username']).addClass("card-body text-white bg-primary")
        } else if (clients['players'][i]['can_answer']) {
            $("#cardBody" + clients['players'][i]['username']).addClass("card-body")
        } else {
            $("#cardBody" + clients['players'][i]['username']).addClass("card-body bg-secondary")
        }
    });

    const host = $('#hostCard');
    host.empty();
    host.append(
        $('<div/>')
            .addClass("col")
            .append($("<div></div>")
                .addClass("card")
                .attr("style", "height: 210px")
                .append($("<img>")
                    .addClass("card-img-top")
                    .attr("src", "/static/images/bobr.jpg"))
                .append($("<div></div>")
                    .addClass("card-body")
                    .append($("<div></div>")
                        .addClass("col text-center")
                        .attr("id", "hostCardBody")))))

    let hostCardBody = $("#hostCardBody");
    if (clients['host']['name'] == null) {
        hostCardBody.append(
            $("<a></a>")
                .addClass("btn btn-info")
                .text("Стать")
                .attr("href", "/host/" + gameID))
    } else {
        hostCardBody.append($("<h5></h5>").addClass("card-title text-center text-truncate")
            .text((clients['host']["name"] == null) ? "-" : clients['host']["name"]))
    }

    hostCardBody.append($("<h5></h5>")
        .addClass("card-title text-center font-weight-bold mt-2")
        .text("хост"))
}

function showBoard(state) {
    clearTimeout();
    $('#questionText').hide();
    let board = $('#board');
    let message = $('#message');
    message.text("Вопросы");
    board.empty();
    board.show();
    for (const topic of state['board']) {
        let row = $("<btn-group></btn-group>")
            .addClass("btn-group btn-group-lg mt-2")
            .attr("role", "group")
            .append($("<button></button>")
                .addClass("btn btn-info text-truncate")
                .attr("style", "width: 200px")
                .html(topic['name']));
        for (const question of topic['questions']) {
            if (question['answered']) {
                row.append($("<button></button>")
                    .attr("type", "button")
                    .addClass("btn btn-secondary")
                    .html(question['price']));
            } else {
                row.append($("<button></button>")
                    .attr("id", "questionButton" + question['id'])
                    .attr("type", "button")
                    .addClass("btn btn-primary")
                    .html(question['price'])
                    .attr("onclick", "openQuestion(" + question['id'] + ");"));
            }
        }
        board.append(row);
        board.append($("<br>"));
    }
}

function showAnswer(state) {
    $('#questionText').text("Правильный ответ: " + state['question']['answer']);
}

function showCountdown(time, timeRemaining) {
    let countdown = $("#countdown");
    let countdownStripe = $("#countdownStripe");
    countdownStripe.attr("style", "width: " + Math.floor((time - timeRemaining) * 100 / time) + "%");
    countdown.show();
    countdownStripe.animate({
        width: "100%"
    }, {
        duration: timeRemaining,
        easing: "linear",
        complete: function () {
            $("#countdown").hide();
            socket.emit("end_countdown", gameID);
        }
    });
}

function hideCountdown() {
    $("#countdown").hide();
    $("#countdownStripe").stop();
}

function playVideo(state) {
    let container = $("#playerContainer");
    container.show();
    container.attr("src", "/media/" + state['question']['video_id'] + "/" + state['question']['video_start'] + "/"
        + state['question']['video_end']);
}

function hideVideo() {
    let player = $("#playerContainer");
    player.attr("src", "about:blank");
    player.hide();
}

function showImage(state) {
    let image = $("#image");
    image.attr("src", state["question"]["image_url"]);
    image.show();
}

function showQuestionSelection(state) {
    let questionButton = $("#questionButton" + state['question']['id']);
    questionButton.addClass("btn-success");
    questionButton.removeAttr("onclick");
    setTimeout(function () {
        showQuestionData(state);
    }, 500)
}

function showQuestionData(state) {
    showQuestion(state);
    showQuestionButtons();
    if (state['question']['video_id'] != null) playVideo(state);
    if (state['question']['image_url'] != null) showImage(state);
}

function update_state(state) {
    if (state['state'] === 'LOBBY') {
        $('#message').text("Лобби");
        showLobbyButtons();
    }
    if (state['state'] === 'BOARD') {
        $("#image").hide();
        hideVideo();
        showBoard(state);
        showBoardButtons();
    }
    if (state['state'] === 'QUESTION') {
        if (currentState === "BOARD") {
            showQuestionSelection(state)
        } else {
            showQuestionData(state)
        }

    }
    if (state['state'] === 'COUNTDOWN') {
        hideVideo();
        showQuestion(state);
        showCountdownButtons();
        if (state['question']['image_url'] != null) showImage(state);
        showCountdown(state['time'], state['time_remaining']);
    }
    if (state['state'] === 'ANSWERING') {
        hideCountdown();
        showQuestion(state);
        showAnswerButtons();
        if (state['question']['image_url'] != null) showImage(state);
    }
    if (state['state'] === 'CORRECT_ANSWER') {
        showAnswer(state);
        showCorrectAnswerButtons();
        if (state['question']['image_url'] != null) showImage(state);
    }
    currentState = state['state'];
}
