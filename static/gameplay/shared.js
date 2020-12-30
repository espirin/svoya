const generalSocket = io('/');
new ClipboardJS('#copyURLButton');

let questionID = null;
let gameID = $("#gameID").text();

setInterval(function () {
    let startTime = Date.now();
    generalSocket.emit('ping', function () {
        let latency = Date.now() - startTime;
        console.log("Ping: " + latency + "ms");
    });
}, 2000);

function openQuestion(questionID) {
    generalSocket.emit("open_question", [questionID, gameID]);
}

function update_clients(clients) {
    const players = $('#playersCards');
    players.empty();
    $.each(clients['players'], function (i) {
        players.append(
            $('<div/>')
                .addClass("col")
                .append($("<div></div>")
                    .addClass("card")
                    .attr("style", "height: 210px")
                    .append($("<img>")
                        .addClass("card-img-top")
                        .attr("src", "/static/app/images/bobr.jpg"))
                    .append($("<div></div>")
                        .addClass((clients['players'][i]['answering'])
                            ? "card-body" : "card-body text-white bg-primary")
                        .append($("<div></div>")
                            .addClass("col")
                            .append($("<h5></h5>").addClass("card-title text-center text-truncate")
                                .text(clients['players'][i]["name"]))
                            .append($("<h5></h5>").addClass("card-title text-center font-weight-bold")
                                .text(clients['players'][i]["score"]))))))
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
                    .attr("src", "/static/app/images/bobr.jpg"))
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
    let board = $('#board');
    let message = $('#message');
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

function showQuestion(state) {
    $('#board').hide();
    let questionText = $('#questionText');
    questionText.show();
    questionText.text(state['question']['text']);
}

function showCountdown(time) {
    let countdown = $("#countdown");
    countdown.animate({
        width: "100%"
    }, time * 1000);

    setTimeout(function () {
        countdown.hide();
        socket.emit("end_countdown", gameID);
    }, time * 1000)
}
