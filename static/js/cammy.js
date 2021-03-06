// This is just an alias that can be used in the actionFunctionMap
function log_to_console(data) {
    console.log(data);
}

var playlist = [];

// TODO: Rename this
function updatePlaylist(data) {
    playlist = data['playlist'];

    // Update the table to display the new playlist
    update_playlist();

    // If there is no video playing, start it
    if (!videos.playing && videos.playerOpen) {
        startPlaying();
    }
}

var videos = {
    'playing': false,
    'playerOpen': false,
    'videoPlayed': function(video_slug) {
        $.post("/api/mark_played/", {
            'playlist_id': $('#playlist-id').val(),
            'video_slug': video_slug
        });
    }
}

var messageSocket = {
    'actionFunctionMap': {
        'update_playlist': updatePlaylist
    },

    'onOpen': function() {
        // We need to identify with the socket telling it our playlist slug
        idData = {
            'playlist_id': messageSocket.playlist_id,
        }

        messageSocket.socket.send(JSON.stringify(idData));

        messageSocket.hideConnectionLostModal();
    },

    'onMessage': function(msg) {
        var data = JSON.parse(msg.data);

        // Now call the function from the map using data object as the only attribute
        messageSocket.actionFunctionMap[data.action](data);
    },

    'onClose': function() {
        messageSocket.showConnectionLostModal();

        // We have lost socket connection, try again in 1 second
        window.setTimeout(messageSocket.connect, 1000);
    },

    'initialise': function(playlist_id) {
        // Set socket arguments
        messageSocket.playlist_id = playlist_id;

        messageSocket.connect();
    },

    'connect': function() {
        try {
            // TODO: Fix this to not just use localhost
            messageSocket.socket = new WebSocket("ws://localhost:8000/socket/");
            messageSocket.socket.onopen = messageSocket.onOpen;
            messageSocket.socket.onmessage = messageSocket.onMessage;
            messageSocket.socket.onclose = messageSocket.onClose;
        } catch(err) {
            messageSocket.onClose();
        }
    },

    'showConnectionLostModal': function() {
        $('#modal-connection-lost').modal({
            backdrop: 'static',
            keyboard: false
        })
    },

    'hideConnectionLostModal': function() {
        $('#modal-connection-lost').modal('hide');
    }
}

var searching = {
    'doSearch': function() {
        searchTerm = $("#searchItem").val();

        $.get("/api/search_videos/", {
            "search_term": searchTerm
        }, function(results) {
            // Get the template, populate it and then append it to the table

            $("#search-results-table").html("");

            for (var i = 0; i < results['results'].length; i++) {
                result = results['results'][i];

                template = $("#search-result-row").html();
                template = template.replace(/\[\[thumbnail_url\]\]/g, result['thumbnail']);
                template = template.replace(/\[\[video_id\]\]/g, result['id']);
                template = template.replace(/\[\[video_title\]\]/g, result['title']);
                $("#search-results-table").append(template);
            };

            // Show the modal
            $('#modal-search-results').modal();
        });

        return false;
    }
}

var voting = {  
    'submitVote': function() {
        var songs = JSON.parse(getCookie("songs"));
        vote_direction = $(this).attr('data-vote-direction');

        if ($.inArray($(this).attr('data-video-id'), songs) !== -1) {
            console.log($(this).attr('data-video-id'));
            console.log(getCookie("songs"));
            console.log($.inArray($(this).attr('data-video-id'), songs));
            alert("You can only vote on a song once.");
        }
        else {
            console.log($(this).attr('data-video-id'));
            console.log(getCookie("songs"));
            console.log($.inArray($(this).attr('data-video-id'), songs));
            $.post("/api/vote/" + vote_direction + "/", {
                "playlist_id": $('#playlist-id').val(),
                "video_id": $(this).attr('data-video-id')
            }, function(data) {
                console.log(data);
            });
            songs.push($(this).attr('data-video-id'));
            console.log(JSON.stringify(songs));
            document.cookie = "songs=" + JSON.stringify(songs);
        }
    }
}

var ui = {
    'showPlayer': function() {
        videos.playerOpen = true;
        startPlaying();
        $("#player-container").removeClass("hidden");

        // Work out whether we should show the player or the no video
        // alert depending on the number of videos in the playlist
        // Hide both initially so we only show the one we want.
        $('#player').addClass("hidden");
        $('#no-video-alert').addClass("hidden");

        if (playlist.length > 0) {
            $('#player').removeClass("hidden");
        } else {
            $('#no-video-alert').removeClass("hidden");
        }

        // Now hide the "open player" button
        $("#btn-show-player").addClass("hidden");
    },

    'transitionToNoVideoNotice': function() {
        $('#player').addClass("hidden");
        $('#no-video-alert').removeClass("hidden");
    },

    'transitionToPlayer': function() {
        $('#player').removeClass("hidden");
        $('#no-video-alert').addClass("hidden");
    }
}

$(document).ready(function() {
    $("#search-form").submit(searching.doSearch);
    $("#btn-show-player").click(ui.showPlayer);
    $("#tab_logic").on("click", ".btn-vote", voting.submitVote);
});
