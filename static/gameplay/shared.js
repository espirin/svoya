const generalSocket = io('/');

function copyToClipboard(element) {
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

setInterval(function () {
    let startTime = Date.now();
    generalSocket.emit('ping', function () {
        let latency = Date.now() - startTime;
        console.log("Ping: " + latency + "ms");
    });
}, 2000);

generalSocket.on("connect", function () {
    console.log("Getting game state");
    generalSocket.emit("get_game_state", $("#gameID").text(), function (state) {
        console.log("Received game state");
        console.log(JSON.stringify(state, null, 2));
        $('#message').text(JSON.stringify(state, null, 2));
    });
});
