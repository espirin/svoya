function viewPack(pack_id) {
    $.ajax({
        url: "/user_packs/view_pack",
        data: JSON.stringify(pack_id),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
            $('#packName').text(data['name']);
            $('#createGameButton').on("click", function () {
                createGame(data['id']);
            });
            $('#editPackButton').on("click", function () {
                window.location.href = data['editor_url'];
            });

            const topics = $('#topicsList');
            topics.empty();
            $.each(data['topics'], function (i) {
                $('<a/>')
                    .text(data['topics'][i])
                    .addClass("list-group-item")
                    .appendTo(topics);
            });
            $("#packColumn").show();
        }
    })
}

function createGame(pack_id) {
    $.ajax({
        url: "/create_game",
        data: JSON.stringify(pack_id),
        type: "POST",
        contentType: "application/json",
        success: function (gameURL) {
            window.location.href = gameURL;
        }
    })
}

function createPack() {
    $.ajax({
        url: "/editor/create_pack",
        type: "POST",
        contentType: "application/json",
        success: function (editorURL) {
            window.location.href = editorURL;
        }
    })
}
