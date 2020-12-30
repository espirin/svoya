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
                    .append($("<img>")
                        .addClass("card-img-top")
                        .attr("src", "/static/app/images/bobr.jpg"))
                    .append($("<div></div>")
                        .addClass("card-body")
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
                .append($("<img>")
                    .addClass("card-img-top")
                    .attr("src", "/static/app/images/bobr.jpg"))
                .append($("<div></div>")
                    .addClass("card-body")
                    .append($("<div></div>")
                        .addClass("col")
                        .append($("<h5></h5>").addClass("card-title text-center text-truncate")
                            .text(clients['host']["name"])).append($("<h5></h5>").addClass("card-title text-center font-weight-bold")
                            .text("хост"))))))

}
