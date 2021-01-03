const socket = io();

function removeImage(questionID) {
    socket.emit("remove_image", questionID, function (response) {
        if (response === "success") {
            //    remove image, put form
            //     $("#" + questionID).
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
