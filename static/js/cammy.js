// This is just an alias that can be used in the actionFunctionMap
function log_to_console(data) {
    console.log(data);
}

var messageSocket = {
    'actionFunctionMap': {
        'update_playlist': log_to_console
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

searching = {
    'doSearch': function() {
        searchTerm = $("#searchItem").val();

        $.get("/api/search_videos/", {
            "search_term": searchTerm
        }, function(results) {
            // Get the template, populate it and then append it to the table


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

$(document).ready(function() {
    $("#search-form").submit(searching.doSearch);
});
