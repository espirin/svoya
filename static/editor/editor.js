const socket = io();
let packID = $("#packID").text();

$(function () {
    Dropzone.autoDiscover = false;

    $("#packName")
        .addClass("col-4")
        .append(
            $("<input>")
                .attr("id", "PackName" + packID)
                .addClass("form-control")
                .attr("maxlength", "128")
                .attr("placeholder", "Раунд")
                .val($("#packHiddenName").text())
                .on("input propertychange change", function () {
                    try {
                        clearTimeout(window["updatePackNameTimeout" + packID]);
                    } catch {
                    }
                    window["updatePackNameTimeout" + packID] = setTimeout(function () {
                        socket.emit("update_pack_name", {
                            "pack_id": packID,
                            "name": $("#PackName" + packID).val()
                        });
                    }, 500);
                }))

    socket.emit("get_boards", packID, function (boards) {
        for (let i = 0; i < boards.length; i++) {
            addBoard(boards[i], i);
        }
    })
})

function addAddVideoButton(element, questionID) {
    element.append(
        $("<button></button>")
            .addClass("btn btn-secondary")
            .text("Добавить")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#" + "ModalVideoEditor" + questionID));
}

function addVideoPreview(element, videoID, questionID) {
    element
        .append($("<img>")
            .attr("src", "https://img.youtube.com/vi/" + videoID + "/mqdefault.jpg")
            .attr("data-bs-toggle", "modal")
            .attr("data-bs-target", "#" + "ModalVideoEditor" + questionID)
            .addClass("rounded mx-auto d-block h-100 max-width-100 dim-image"))
    element
        .append($("<button></button>")
            .attr("type", "button")
            .attr("data-bs-toggle", "modal")
            .addClass("show-on-hover-button hide-button edit-button")
            .attr("data-bs-target", "#" + "ModalVideoEditor" + questionID));
}

function addModalVideoEditor(element, questionID, videoID, videoStart, videoEnd) {
    element.append($("<div></div>")
        .addClass("modal fade")
        .attr("id", "ModalVideoEditor" + questionID)
        .attr("tabindex", "-1")
        .attr("aria-labelledby", "ModalVideoEditorLabel" + questionID)
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
                                        .attr("id", "ModalVideoEditorLabel" + questionID)
                                        .text("Добавь видео"))
                                .append(
                                    $("<button></button>")
                                        .addClass("btn-close")
                                        .attr("type", "button")
                                        .attr("data-bs-dismiss", "modal")))
                        .append(
                            $("<div></div>")
                                .addClass("modal-body col")
                                .append(
                                    $("<form></form>")
                                        .addClass("row video-editor-id-row")
                                        .append(
                                            $("<div></div>")
                                                .addClass("col-8 h-100")
                                                .append(
                                                    $("<label></label>")
                                                        .attr("for", "VideoID" + questionID)
                                                        .text("ID"))
                                                .append(
                                                    $("<input>")
                                                        .attr("maxlength", "11")
                                                        .attr("id", "VideoID" + questionID)
                                                        .addClass("form-control")
                                                        .attr("placeholder", "ID")
                                                        .val(videoID)
                                                        .on("input propertychange change", function () {
                                                            checkVideo(questionID, true);
                                                        })))
                                        .append(
                                            $("<div></div>")
                                                .addClass("col-4 h-100")
                                                .append(
                                                    $("<img>")
                                                        .attr("id", "ModalVideoPreviewImage" + questionID)
                                                        .attr("src", (videoID == null) ?
                                                            "/static/images/warning_icon.png" :
                                                            "https://img.youtube.com/vi/" + videoID + "/mqdefault.jpg")
                                                        .addClass("h-100 row rounded mx-auto"))
                                                .append($("<div></div>")
                                                    .addClass("row h-100 align-items-center justify-content-center text-center")
                                                    .attr("style", "display: none")
                                                    .attr("id", "ModalVideoPreviewImageText" + questionID))))
                                .append(
                                    $("<form></form>")
                                        .addClass("row mt-2")
                                        .append(
                                            $("<div></div>")
                                                .addClass("col")
                                                .append(
                                                    $("<label></label>")
                                                        .attr("for", "VideoStart" + questionID)
                                                        .text("Начало (сек)"))
                                                .append(
                                                    $("<input>")
                                                        .attr("type", "number")
                                                        .attr("min", "0")
                                                        .attr("oninput", "this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null")
                                                        .attr("id", "VideoStart" + questionID)
                                                        .addClass("form-control")
                                                        .attr("placeholder", "0")
                                                        .val(videoStart))))
                                .append(
                                    $("<form></form>")
                                        .addClass("row mt-2")
                                        .append(
                                            $("<div></div>")
                                                .addClass("col")
                                                .append(
                                                    $("<label></label>")
                                                        .attr("for", "VideoEnd" + questionID)
                                                        .text("Конец (сек)"))
                                                .append(
                                                    $("<input>")
                                                        .attr("type", "number")
                                                        .attr("min", "0")
                                                        .attr("oninput", "this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null")
                                                        .attr("id", "VideoEnd" + questionID)
                                                        .addClass("form-control")
                                                        .attr("placeholder", "10")
                                                        .val(videoEnd)))))
                        .append(
                            $("<div></div>")
                                .addClass("modal-footer")
                                .append(
                                    $("<button></button>")
                                        .addClass("btn btn-secondary")
                                        .attr("type", "button")
                                        .attr("data-bs-dismiss", "modal")
                                        .text("Закрыть"))
                                .append(
                                    $("<button></button>")
                                        .addClass("btn btn-danger")
                                        .attr("type", "button")
                                        .attr("onclick", "removeVideo(" + questionID + ")")
                                        .text("Удалить"))
                                .append(
                                    $("<button></button>")
                                        .addClass("btn btn-primary")
                                        .attr("type", "button")
                                        .attr("id", "saveVideoButton" + questionID)
                                        .attr("onclick", "saveVideoData(" + questionID + ")")
                                        .text("Сохранить"))))));

    document.getElementById("ModalVideoEditor" + questionID).addEventListener('show.bs.modal', function () {
        resetVideoData(questionID);
    })
}

function addImagePreview(element, url, questionID) {
    element
        .append($("<img>")
            .attr("src", url)
            .addClass("rounded mx-auto d-block h-100 max-width-100 dim-image"));
    element
        .append($("<button></button>")
            .addClass("btn-close show-on-hover-button hide-button")
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

function saveVideoData(questionID) {
    let newVideoID = $("#VideoID" + questionID).val();
    socket.emit("update_video", {
        "question_id": questionID,
        "video_id": newVideoID,
        "video_start": $("#VideoStart" + questionID).val(),
        "video_end": $("#VideoEnd" + questionID).val(),
    }, function (oldVideoID) {
        if (newVideoID !== oldVideoID) {
            let videoColumn = $("#videoColumn" + questionID);
            videoColumn.empty();
            addVideoPreview(videoColumn, newVideoID, questionID);
        }
    });

    $("#ModalVideoEditor" + questionID).modal('hide');
}

function removeVideo(questionID) {
    socket.emit("remove_video", questionID);

    let videoColumn = $("#videoColumn" + questionID);
    videoColumn.empty();
    let modalVideoEditor = $("#ModalVideoEditor" + questionID);
    addAddVideoButton(videoColumn, questionID);
    modalVideoEditor.modal('hide');
    modalVideoEditor.remove()
    addModalVideoEditor($("#QuestionsRow" + questionID), questionID, null, null,
        null);
}

function resetVideoData(questionID,) {
    socket.emit("get_video_data", questionID, function (response) {
        $("#VideoID" + questionID).val(response['video_id']);
        $("#VideoStart" + questionID).val(response['video_start']);
        $("#VideoEnd" + questionID).val(response['video_end']);

        checkVideo(questionID, false);
    })
}

function checkVideo(questionID, withTimeout) {
    if (withTimeout) {
        try {
            clearTimeout(window["updateVideoTimeout" + questionID]);
        } catch {
        }
    }

    let newVideoID = $("#VideoID" + questionID).val();
    let modalImageText = $("#ModalVideoPreviewImageText" + questionID);
    let modalVideoPreview = $("#ModalVideoPreviewImage" + questionID);
    let modalVideoSaveButton = $("#saveVideoButton" + questionID);

    if (newVideoID.length !== 11) {
        modalVideoPreview.attr("src", "/static/images/not_found_icon.png");
        modalVideoPreview.show();
        modalImageText.hide();
        modalVideoSaveButton.prop('disabled', true);
    }

    if (withTimeout) {
        window["updateVideoTimeout" + questionID] = setTimeout(function () {
            checkVideoOnServer(newVideoID, modalVideoPreview, modalImageText, modalVideoSaveButton)
        }, 500);
    } else {
        checkVideoOnServer(newVideoID, modalVideoPreview, modalImageText, modalVideoSaveButton)
    }

}

function checkVideoOnServer(newVideoID, modalVideoPreview, modalImageText, modalVideoSaveButton) {
    socket.emit("check_video",
        newVideoID,
        function (response) {
            if (response === "ok") {
                let videoPreviewURL = "https://img.youtube.com/vi/" + newVideoID + "/mqdefault.jpg";
                if (modalVideoPreview.attr("src") !== videoPreviewURL) modalVideoPreview.attr("src", videoPreviewURL);
                modalVideoPreview.show();
                modalImageText.hide();
                modalVideoSaveButton.prop('disabled', false);
            }
            if (response === "video_id_incorrect" || response === "not_found" || response === "error") {
                modalVideoPreview.attr("src", "/static/images/not_found_icon.png");
                modalVideoPreview.show();
                modalImageText.hide();
            }
            if (response === "not_embeddable") {
                modalVideoPreview.hide();
                modalImageText.text("Невозможно встроить видео");
                modalImageText.show();
            }
        });
}

function addQuestion(topicID, question) {
    $("#" + "QuestionsList" + topicID).append(
        $("<li></li>")
            .attr("id", "questionListItem" + question['id'])
            .addClass("list-group-item")
            .append(
                $("<div></div>")
                    .addClass("row question align-items-center")
                    .attr("id", "QuestionsRow" + question['id'])
                    .append(
                        $("<form></form>")
                            .addClass("col h-100")
                            .append(
                                $("<textarea>")
                                    .attr("rows", "3")
                                    .attr("id", "QuestionText" + question['id'])
                                    .addClass("form-control h-100")
                                    .attr("placeholder", "Вопрос")
                                    .val(question['text'])
                                    .on("input propertychange change", function () {
                                        try {
                                            clearTimeout(window["updateQuestionTextTimeout" + question['id']]);
                                        } catch {
                                        }
                                        window["updateQuestionTextTimeout" + question['id']] = setTimeout(function () {
                                            socket.emit("update_question_text", {
                                                "question_id": question['id'],
                                                "text": $("#QuestionText" + question['id']).val()
                                            });
                                        }, 500);
                                    }))).append(
                    $("<form></form>")
                        .addClass("ml-2 col h-100")
                        .append(
                            $("<textarea>")
                                .attr("rows", "3")
                                .attr("id", "QuestionAnswer" + question['id'])
                                .addClass("form-control h-100")
                                .attr("placeholder", "Ответ")
                                .val(question['answer'])
                                .on("input propertychange change", function () {
                                    try {
                                        clearTimeout(window["updateQuestionAnswerTimeout" + question['id']]);
                                    } catch {
                                    }
                                    window["updateQuestionAnswerTimeout" + question['id']] = setTimeout(function () {
                                        socket.emit("update_question_answer", {
                                            "question_id": question['id'],
                                            "answer": $("#QuestionAnswer" + question['id']).val()
                                        });
                                    }, 500);
                                }))).append(
                    $("<form></form>")
                        .addClass("ml-2 col h-100")
                        .append(
                            $("<input>")
                                .attr("id", "QuestionPrice" + question['id'])
                                .attr("type", "number")
                                .attr("min", "0")
                                .addClass("form-control h-100")
                                .attr("placeholder", "100")
                                .val(question['price'])
                                .on("input propertychange change", function () {
                                    try {
                                        clearTimeout(window["updateQuestionPriceTimeout" + question['id']]);
                                    } catch {
                                    }
                                    window["updateQuestionPriceTimeout" + question['id']] = setTimeout(function () {
                                        socket.emit("update_question_price", {
                                            "question_id": question['id'],
                                            "price": $("#QuestionPrice" + question['id']).val()
                                        });
                                    }, 500);
                                })))));

    let questionsRow = $("#" + "QuestionsRow" + question['id']);

    // Video
    let videoColumn = $("<div></div>")
        .addClass("col-2 ml-2 h-100 d-flex align-items-center justify-content-center button-with-image-overlay")
        .attr("style", "position:relative; display:inline-block")
        .attr("id", "videoColumn" + question['id']);
    questionsRow.append(videoColumn);

    if (question['video_id'] == null) {
        addAddVideoButton(videoColumn, question['id']);
    } else {
        addVideoPreview(videoColumn, question['video_id'], question['id']);
    }
    addModalVideoEditor(questionsRow, question['id'], question['video_id'], question['video_start'],
        question['video_end']);

    // Image
    let imageColumn = $("<div></div>")
        .addClass("col-2 ml-2 h-100 d-flex align-items-center justify-content-center button-with-image-overlay")
        .attr("style", "position:relative; display:inline-block")
        .attr("id", "imageColumn" + question['id']);
    questionsRow.append(imageColumn);

    if (question['image_url'] == null) {
        addModalImageDropzone(imageColumn, question['id']);
    } else {
        addImagePreview(imageColumn, question['image_url'], question['id']);
    }

    questionsRow.append(
        $("<div></div>")
            .addClass("col-1")
            .append(
                $("<button></button>")
                    .addClass("btn btn-close")
                    .attr("onclick", "deleteQuestion(" + question['id'] + ")")))
}

function addTopic(boardBody, topic) {
    boardBody.append(
        $("<div></div>")
            .addClass("card mt-3")
            .attr("id", "topic" + topic['id'])
            .append(
                $("<div></div>")
                    .addClass("card-body")
                    .append(
                        $("<div></div>")
                            .addClass("row")
                            .append(
                                $("<h5></h5>")
                                    .addClass("col-2")
                                    .text("Тема"))
                            .append(
                                $("<div></div>")
                                    .addClass("col-8"))
                            .append(
                                $("<button></button>")
                                    .addClass("col-2 btn btn-danger align-self-center")
                                    .attr("onclick", "deleteTopic(" + topic['id'] + ")")
                                    .text("Удалить тему")))
                    .append(
                        $("<form></form>")
                            .addClass("col-4")
                            .append(
                                $("<input>")
                                    .attr("id", "TopicName" + topic['id'])
                                    .addClass("form-control")
                                    .attr("maxlength", "128")
                                    .attr("placeholder", "Тема")
                                    .val(topic['name'])
                                    .on("input propertychange change", function () {
                                        try {
                                            clearTimeout(window["updateTopicNameTimeout" + topic['id']]);
                                        } catch {
                                        }
                                        window["updateTopicNameTimeout" + topic['id']] = setTimeout(function () {
                                            socket.emit("update_topic_name", {
                                                "topic_id": topic['id'],
                                                "name": $("#TopicName" + topic['id']).val()
                                            });
                                        }, 500);
                                    })))
                    .append($("<ul></ul>")
                        .addClass("list-group mt-2")
                        .attr("id", "QuestionsList" + topic['id']))
                    .append($("<div></div>")
                        .addClass("row ms-1 me-1 mt-3")
                        .append($("<button></button>")
                            .addClass("btn btn-primary col-2")
                            .text("Добавить вопрос")
                            .attr("onclick", "addNewQuestion(" + topic['id'] + ");"))
                        .append($("<div></div>")
                            .addClass("col-8")))));

    for (const question of topic['questions']) {
        addQuestion(topic['id'], question);
    }
}

function addBoard(board, i) {
    $("#tabsHeader").append(
        $("<li></li>")
            .addClass("nav-item")
            .attr("role", "presentation")
            .append($("<a></a>")
                .addClass((i === 0) ? "nav-link active" : "nav-link")
                .attr("id", "Pill" + board['id'])
                .attr("data-bs-toggle", "pill")
                .attr("href", "#" + "Tab" + board['id'])
                .attr("role", "tab")
                .attr("aria-controls", "Tab" + board['id'])
                .attr("aria-selected", (i === 0) ? "true" : "false")
                .text(board['name'])));

    $("#tabsContent").append(
        $("<div></div>")
            .addClass((i === 0) ? "tab-pane fade show active" : "tab-pane fade")
            .attr("id", "Tab" + board['id'])
            .attr("role", "tabpanel")
            .attr("aria-labelledby", "Pill" + board['id'])
            .append(
                $("<div></div>")
                    .addClass("card mt-2 mb-3")
                    .append(
                        $("<div></div>")
                            .addClass("card-body")
                            .attr("id", "boardBody" + board['id'])
                            .append(
                                $("<div></div>")
                                    .addClass("row")
                                    .append(
                                        $("<h5></h5>")
                                            .addClass("col-2")
                                            .text("Раунд"))
                                    .append(
                                        $("<div></div>")
                                            .addClass("col-8"))
                                    .append(
                                        $("<button></button>")
                                            .addClass("col-2 btn btn-danger align-self-center")
                                            .attr("onclick", "deleteBoard(" + board['id'] + ")")
                                            .text("Удалить раунд")))
                            .append(
                                $("<form></form>")
                                    .addClass("col-4")
                                    .append(
                                        $("<input>")
                                            .attr("id", "BoardName" + board['id'])
                                            .addClass("form-control")
                                            .attr("maxlength", "128")
                                            .attr("placeholder", "Раунд")
                                            .val(board['name'])
                                            .on("input propertychange change", function () {
                                                try {
                                                    clearTimeout(window["updateBoardNameTimeout" + board['id']]);
                                                } catch {
                                                }
                                                window["updateBoardNameTimeout" + board['id']] = setTimeout(function () {
                                                    let newName = $("#BoardName" + board['id']).val();
                                                    socket.emit("update_board_name", {
                                                        "board_id": board['id'],
                                                        "name": newName
                                                    });
                                                    $("#Pill" + board['id']).text(newName);
                                                }, 500);
                                            }))
                            )
                            .append(
                                $("<div></div>").attr("id", "topicsList" + board['id'])))));

    for (const topic of board['topics']) {
        addTopic($("#topicsList" + board['id']), topic);
    }
    $("#boardBody" + board['id']).append($("<button></button>")
        .addClass("btn btn-primary mt-3")
        .text("Добавить тему")
        .attr("onclick", "addNewTopic(" + board['id'] + ");"))
}

function addNewQuestion(topicID) {
    socket.emit("create_question", topicID, function (question) {
        addQuestion(topicID, question);
    });
}

function deleteQuestion(questionID) {
    socket.emit("delete_question", questionID, function () {
        $("#questionListItem" + questionID).remove();
    })
}

function addNewTopic(boardID) {
    socket.emit("create_topic", boardID, function (topic) {
        addTopic($("#topicsList" + boardID), topic);
    });
}

function deleteTopic(topicID) {
    socket.emit("delete_topic", topicID, function () {
        $("#topic" + topicID).remove();
    })
}

function addNewBoard(packID) {
    socket.emit("create_board", packID, function (board) {
        addBoard(board, $("#tabsHeader li").length);
    });
}

function deleteBoard(boardID) {
    socket.emit("delete_board", boardID, function () {
        $("#board" + boardID).remove();
        $("#Pill" + boardID).remove();
        $("#Tab" + boardID).remove();
    })
}
