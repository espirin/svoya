const socket = io();
let packID = $("#packID").text();

function removeImage(questionID) {
    socket.emit("remove_image", questionID, function (response) {
        if (response === "success") {
            //    remove image, put form
            //     $("#" + questionID).
        }
    });
}

$(function () {
    Dropzone.autoDiscover = false;

    socket.emit("get_boards", packID, function (boards) {
        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];
            $("#tabsHeader").append(
                $("<li></li>")
                    .addClass("nav-item")
                    .append($("<a></a>")
                        .addClass((i === 0) ? "nav-link active" : "nav-link")
                        .attr("id", board['id'] + "Pill")
                        .attr("data-toggle", "pill")
                        .attr("href", "#" + board['id'] + "Tab")
                        .attr("role", "tab")
                        .attr("aria-controls", board['id'] + "Tab")
                        .attr("aria-selected", "true")
                        .text(board['name'])));

            $("#tabsContent").append(
                $("<div></div>")
                    .addClass((i === 0) ? "tab-pane fade show active" : "tab-pane fade")
                    .attr("id", board['id'] + "Tab")
                    .attr("role", "tabpanel")
                    .attr("aria-labelledby", board['id'] + "Pill")
                    .append(
                        $("<div></div>")
                            .addClass("card mt-2")
                            .append(
                                $("<div></div>")
                                    .addClass("card-body")
                                    .append($("<h5></h5>")
                                        .text(board['name']))
                                    .attr("id", "boardBody"))));

            for (const topic of board['topics']) {
                $("#boardBody").append(
                    $("<div></div>")
                        .addClass("card mt-2")
                        .append(
                            $("<div></div>")
                                .addClass("card-body")
                                .append($("<h5></h5>")
                                    .addClass("card-title")
                                    .text(topic['name'])
                                    .attr("id", topic['id']))
                                .append($("<ul></ul>")
                                    .addClass("list-group")
                                    .attr("id", "QuestionsList" + topic['id']))));

                for (const question of topic['questions']) {
                    $("#" + "QuestionsList" + topic['id']).append(
                        $("<li></li>").addClass("list-group-item").append(
                            $("<div></div>")
                                .addClass("row question align-items-center")
                                .attr("id", "QuestionsRow" + question['id']).append(
                                $("<form></form>")
                                    .addClass("col h-100")
                                    .append($("<textarea>")
                                        .attr("rows", "3")
                                        .attr("id", "QuestionText" + question['id'])
                                        .addClass("form-control h-100")
                                        .attr("placeholder", "Вопрос")
                                        .val(question['text']))).append(
                                $("<form></form>")
                                    .addClass("ml-2 col h-100")
                                    .append($("<textarea>")
                                        .attr("rows", "3")
                                        .attr("id", "QuestionAnswer" + question['id'])
                                        .addClass("form-control h-100")
                                        .attr("placeholder", "Ответ")
                                        .val(question['answer'])))));

                    let questionsRow = $("#" + "QuestionsRow" + question['id']);

                    // Video
                    if (question['video_id'] == null) {
                        questionsRow.append(
                            $("<div></div>").addClass("col text-center").append(
                                $("<button></button>")
                                    .addClass("btn btn-secondary")
                                    .text("Добавить видео")
                                    .attr("onclick", "viewVideoInfo(" + question['id'] + ")")));
                    } else {
                        questionsRow.append(
                            $("<div></div>")
                                .addClass("col h-100")
                                .append(
                                    $("<img>")
                                        .attr("src", "https://img.youtube.com/vi/" + question['video_id'] + "/mqdefault.jpg")
                                        .attr("onclick", "viewVideoInfo(" + question['id'] + ")")
                                        .addClass("h-100 rounded mx-auto d-block")));
                    }

                    // Image
                    if (question['image_url'] == null) {
                        questionsRow.append(
                            $("<div></div>")
                                .addClass("col ml-2 text-center")
                                .append($("<button></button>")
                                    .addClass("btn btn-primary")
                                    .attr("type", "button")
                                    .attr("data-bs-toggle", "modal")
                                    .attr("data-bs-target", "#" + "ModalDropzone" + question['id'])
                                    .text("Загрузить")));

                        questionsRow.append($("<div></div>")
                            .addClass("modal fade")
                            .attr("id", "ModalDropzone" + question['id'])
                            .attr("tabindex", "-1")
                            .attr("aria-labelledby", "ModalDropzoneLabel" + question['id'])
                            .attr("aria-hidden", "true")
                            .append(
                                $("<div></div>")
                                    .addClass("modal-dialog")
                                    .append(
                                        $("<div></div>")
                                            .addClass("modal-content")
                                            .append(
                                                $("<div></div>")
                                                    .addClass("modal-header")
                                                    .append(
                                                        $("<h5></h5>")
                                                            .addClass("modal-title")
                                                            .attr("id", "ModalDropzoneLabel" + question['id'])
                                                            .text("Добавь картинку"))
                                                    .append(
                                                        $("<button></button>")
                                                            .addClass("btn-close")
                                                            .attr("type", "button")
                                                            .attr("data-bs-dismiss", "modal")
                                                            .attr("aria-label", "Закрыть")))
                                            .append(
                                                $("<div></div>")
                                                    .addClass("modal-body")
                                                    .append(
                                                        $("<div></div>")
                                                            .attr("id", "Dropzone" + question['id'])
                                                            .addClass("dropzone")))
                                            .append(
                                                $("<div></div>")
                                                    .addClass("modal-footer")
                                                    .append(
                                                        $("<button></button>")
                                                            .addClass("btn btn-secondary")
                                                            .attr("type", "button")
                                                            .attr("data-bs-dismiss", "modal")
                                                            .text("Закрыть"))))));

                        $("#" + "Dropzone" + question['id']).dropzone(
                            {
                                url: "/editor/upload_image",
                                paramName: 'file',
                                chunking: false,
                                maxFilesize: 10,
                                maxFiles: 1,
                                acceptedFiles: "image/*",
                                resizeQuality: 0.8,
                                resizeWidth: 300,
                                init: function () {
                                    this.on("success", function (file, response) {

                                    })
                                    this.on("sending", function (file, xhr, formData) {
                                        formData.append("question_id", question['id']);
                                    });
                                }
                            })
                    } else {
                        questionsRow
                            .append($("<div></div>")
                                .addClass("col text-center")
                                .append($("<img>")
                                    .attr("src", question['image_url'])
                                    .addClass("editor-image row rounded mx-auto d-block"))
                                .append($("<button></button>")
                                    .addClass("btn btn-danger row mt-2")
                                    .attr("onclick", "removeImage(" + question['id'] + ")")
                                    .text("Удалить")));
                    }
                }
            }
        }
    })
})


// $('.the-textarea').on('input propertychange change', function() {
//     console.log('Textarea Change');
//
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(function() {
//         // Runs 1 second (1000 ms) after the last change
//         saveToDB();
//     }, 1000);
// });
