function viewPack(pack_id) {
    $.ajax({
        url: "/user_packs/view_pack",
        data: JSON.stringify(pack_id),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
            $('#packName').text(data['name']);
            $('#createLobbyButton').attr("href", "/lobby/host/" + data['id']);

            const topics = $('#topicsList');
            topics.empty();
            $.each(data['topics'], function (i) {
                $('<a/>')
                    .text(data['topics'][i])
                    .addClass("list-group-item list-group-item-action")
                    .attr("role", "tab")
                    .appendTo(topics);
            });
        }
    })
}
