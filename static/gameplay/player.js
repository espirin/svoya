const socket = io('/player');

socket.on("connect", function () {
    console.log("connected to game");
    socket.emit("connect_player", gameID);

    generalSocket.emit("get_game_state", gameID, function (state) {
        let message = $('#message');
        let board = $('#board');

        message.text(JSON.stringify(state, null, 2));
        if (state['state'] === 'LOBBY') {
            message.text("Лобби");
        }
        if (state['state'] === 'BOARD') {
            message.text("Вопросы");
            board.empty();
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
                            .html(question['price'])
                            .attr("onclick", "openQuestion(" + question['id'] + ");"));
                    } else {
                        row.append($("<button></button>")
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
    console.log("state update message");
    $('#message').text(JSON.stringify(state, null, 2));
    if ("question" in state) {
        questionID = state["question"]["id"]
    }
});

socket.on("update_clients", function (clients) {
    update_clients(clients);
});
