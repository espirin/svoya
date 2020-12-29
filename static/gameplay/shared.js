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

socket.on("state_update", function (state) {
    console.log("state update message");
    $('#message').text(JSON.stringify(state, null, 2));
    if ("question" in state) {
        questionID = state["question"]["id"]
    }
});

function openQuestion(questionID) {
    generalSocket.emit("open_question", [questionID, gameID]);
}
