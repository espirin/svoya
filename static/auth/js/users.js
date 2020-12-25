function deleteUser(username) {
    let host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    $.ajax({
        url: host + "/users/delete",
        type: "POST",
        data: JSON.stringify(username),
        contentType: "application/json",
        complete: function () {
            location.reload();
        }
    })
}
