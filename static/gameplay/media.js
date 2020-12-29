let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: $("#videoID").text(),
        playerVars: {
            'controls': 1,
            'showinfo': 0,
            'cc_load_policy': 0,
            'disablekb': 1,
            'end': 50,
            'fs': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'playsinline': 1,
            'start': 25
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
}

function onStateChange(event) {
    if (event.data === 0) {
        $("#player").hide();
    }
    if (event.data === 2) {
        event.target.playVideo();
    }
}
