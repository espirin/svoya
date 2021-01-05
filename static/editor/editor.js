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

$(document).ready(function () {
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
                                    .attr("id", topic['id'] + "QuestionsList"))));

                for (const question of topic['questions']) {
                    $("#" + topic['id'] + "QuestionsList").append(
                        $("<li></li>").addClass("list-group-item").append(
                            $("<div></div>")
                                .addClass("row question align-items-center")
                                .attr("id", question['id'] + "QuestionsRow").append(
                                $("<form></form>")
                                    .addClass("ml-2 col")
                                    .append($("<input>")
                                        .attr("type", "text")
                                        .attr("id", question['id'] + "QuestionText")
                                        .addClass("form-control")
                                        .attr("placeholder", "Вопрос")
                                        .val(question['text']))).append(
                                $("<form></form>")
                                    .addClass("ml-2 col")
                                    .append($("<input>")
                                        .attr("type", "text")
                                        .attr("id", question['id'] + "QuestionAnswer")
                                        .addClass("form-control")
                                        .attr("placeholder", "Ответ")
                                        .val(question['answer'])))));

                    if (question['video_id'] == null) {
                        $("#" + question['id'] + "QuestionsRow").append(
                            $("<div></div>").addClass("col text-center").append(
                                $("<button></button>")
                                    .addClass("btn btn-secondary")
                                    .text("Добавить видео")
                                    .attr("onclick", "viewVideoInfo(" + question['id'] + ")")));
                    } else {
                        $("#" + question['id'] + "QuestionsRow").append(
                            $("<div></div>")
                                .addClass("col")
                                .append(
                                    $("<img>")
                                        .attr("src", "https://img.youtube.com/vi/" + question['video_id'] + "/mqdefault.jpg")
                                        .attr("onclick", "viewVideoInfo(" + question['id'] + ")")
                                        .addClass("editor-video-image rounded mx-auto d-block")));
                    }

                    if (question['image_url'] == null) {
                        $("#" + question['id'] + "QuestionsRow").append(
                            $("<div></div>")
                                .addClass("col")
                                .attr("id", question['id'] + "Dropzone"));

                        new Dropzone($("#" + question['id'] + "Dropzone").get(0), {
                            paramName: 'file',
                            chunking: false,
                            url: '/editor/upload_image',
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
                        });
                    } else {
                        console.log(question['image_url'])
                        $("#" + question['id'] + "QuestionsRow")
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


//{
//     paramName: 'file',
//     chunking: false,
//     url: '/editor/upload_image',
//     maxFilesize: 10,
//     maxFiles: 1,
//     acceptedFiles: "image/*",
//     resizeQuality: 0.8,
//     resizeWidth: 300,
//     init: function () {
//         this.on("success", function (file, response) {
//
//         })
//         this.on("sending", function (file, xhr, formData) {
//             formData.append("question_id", "loremipsum");
//         });
//     }
// }


//    <div class="tab-pane fade show active" id="rpTab" role="tabpanel"
//                          aria-labelledby="routingProblemPill">
//                         <div class="card mt-2">
//                             <div class="card-body">
//                                 <h5 class="card-title">Раунд 1</h5>
//                                 <div class="card">
//                                     <div class="card-body">
//                                         <h5 class="card-title">Тема 1</h5>
//                                         <ul class="list-group">
//                                             <li class="list-group-item">
//
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>


//<div class="row" id="123">
//                                                     <form class="ml-2">
//                                                         <input type="text" class="form-control col"
//                                                                placeholder="Вопрос">
//                                                     </form>
//                                                     <form class="ml-2">
//                                                         <input type="text" class="form-control col"
//                                                                placeholder="Ответ">
//                                                     </form>
//                                                     <form class="ml-2">
//                                                         <input type="text" class="form-control col"
//                                                                placeholder="видео">
//                                                     </form>
//                                                     <form method="POST" action='/editor/upload_image'
//                                                           class="dropzone dz-clickable ml-2"
//                                                           enctype="multipart/form-data">
//                                                     </form>
//                                                 </div>
//                                                 <div class="row mt-5" id="123">
//                                                     <form class="ml-2">
//                                                         <input type="text" class="form-control col"
//                                                                placeholder="Вопрос">
//                                                     </form>
//                                                     <form class="ml-2">
//                                                         <input type="text" class="form-control col"
//                                                                placeholder="Ответ">
//                                                     </form>
//                                                     <form class="ml-2">
//                                                         <input type="text" class="form-control col"
//                                                                placeholder="видео">
//                                                     </form>
//                                                     <div class="col ml-2">
//                                                         <div class="row justify-content-center"><img
//                                                                 src="/static/images/user_content/8qoFJz8c8qU8KFVkyxGugeUJj7FbCHPm.png">
//                                                         </div>
//                                                         <div class="row justify-content-center">
//                                                             <button class="btn btn-danger"
//                                                                     onclick="removeImage(123)">
//                                                                 Удалить
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>

// $('.the-textarea').on('input propertychange change', function() {
//     console.log('Textarea Change');
//
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(function() {
//         // Runs 1 second (1000 ms) after the last change
//         saveToDB();
//     }, 1000);
// });


//$("div#myId").dropzone({ url: "/file/post" });
//{
//     paramName: 'file',
//     chunking: false,
//     url: '/editor/upload_image',
//     maxFilesize: 10,
//     maxFiles: 1,
//     acceptedFiles: "image/*",
//     resizeQuality: 0.8,
//     resizeWidth: 300,
//     init: function () {
//         this.on("success", function (file, response) {
//
//         })
//         this.on("sending", function (file, xhr, formData) {
//             formData.append("question_id", "loremipsum");
//         });
//     }
// }
