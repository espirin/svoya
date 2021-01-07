const socket = io();
let packID = $("#packID").text();

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
                    let videoColumn = $("<div></div>")
                        .addClass("col-2 ml-2 h-100 d-flex align-items-center justify-content-center")
                        .attr("id", "videoColumn" + question['id']);
                    questionsRow.append(videoColumn);
                    if (question['video_id'] == null) {
                        addAddVideoButton(videoColumn, question['id']);
                    } else {
                        addVideoPreview(videoColumn, question['video_id'], question['id']);
                    }

                    // Image
                    let imageColumn = $("<div></div>")
                        .addClass("col-2 ml-2 h-100 d-flex align-items-center justify-content-center")
                        .attr("style", "position:relative; display:inline-block")
                        .attr("id", "imageColumn" + question['id']);
                    questionsRow.append(imageColumn);
                    if (question['image_url'] == null) {
                        addModalImageDropzone(imageColumn, question['id']);
                    } else {
                        addImagePreview(imageColumn, question['image_url'], question['id']);
                    }
                }
            }
        }
    })
})

function addAddVideoButton(element, questionID) {
    element.append(
        $("<button></button>")
            .addClass("btn btn-secondary")
            .text("Добавить")
            .attr("onclick", "viewVideoInfo(" + questionID + ")"));
}

function addVideoPreview(element, videoID, questionID) {
    element
        .append($("<img>")
            .attr("src", "https://img.youtube.com/vi/" + videoID + "/mqdefault.jpg")
            .attr("onclick", "viewVideoInfo(" + questionID + ")")
            .addClass("rounded mx-auto d-block h-100 max-width-100"));
}

function addImagePreview(element, url, questionID) {
    element
        .append($("<img>")
            .attr("src", url)
            .addClass("rounded mx-auto d-block h-100 max-width-100 image-x"));
    element
        .append($("<button></button>")
            .addClass("btn-close x-icon hide-button")
            .attr("type", "button")
            .attr("onclick", "removeImage(" + questionID + ")"));
}

function addModalImageDropzone(element, questionID) {
    element.append($("<button></button>")
        .addClass("btn btn-primary")
        .attr("type", "button")
        .attr("data-bs-toggle", "modal")
        .attr("data-bs-target", "#" + "ModalDropzone" + questionID)
        .text("Загрузить"));

    element.append($("<div></div>")
        .addClass("modal fade")
        .attr("id", "ModalDropzone" + questionID)
        .attr("tabindex", "-1")
        .attr("aria-labelledby", "ModalDropzoneLabel" + questionID)
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
                                        .attr("id", "ModalDropzoneLabel" + questionID)
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
                                        .attr("id", "Dropzone" + questionID)
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

    $("#" + "Dropzone" + questionID).dropzone(
        {
            url: "/editor/upload_image",
            paramName: 'file',
            chunking: false,
            maxFilesize: 10,
            maxFiles: 1,
            acceptedFiles: "image/*",
            resizeQuality: 0.9,
            resizeMimeType: "image/jpeg",
            resizeWidth: 1500,
            init: function () {
                this.on("success", function (file, response) {
                    $("#ModalDropzone" + questionID).modal('hide');
                    element.empty();
                    addImagePreview(element, response, questionID);
                })
                this.on("sending", function (file, xhr, formData) {
                    formData.append("question_id", questionID);
                });
            }
        })
}

function removeImage(questionID) {
    socket.emit("remove_image", questionID, function (response) {
        if (response === "success") {
            let imageColumn = $("#" + "imageColumn" + questionID);
            imageColumn.empty();
            addModalImageDropzone(imageColumn, questionID);
        }
    });
}

// $('.the-textarea').on('input propertychange change', function() {
//     console.log('Textarea Change');
//
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(function() {
//         // Runs 1 second (1000 ms) after the last change
//         saveToDB();
//     }, 1000);
// });
