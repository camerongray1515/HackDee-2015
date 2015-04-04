// This is just an alias that can be used in the actionFunctionMap
function log_to_console(data) {
    console.log(data);
}

var messageSocket = {
    'actionFunctionMap': {
        'submitvote': {
            'update_playlist': log_to_console
        }
    },

    'onOpen': function() {
        // We need to identify with the socket telling it our playlist slug and realm
        idData = {
            'playlist_id': messageSocket.playlist_id,
        }

        messageSocket.socket.send(JSON.stringify(idData));

        messageSocket.hideConnectionLostModal();
    },

    'onMessage': function(msg) {
        var data = JSON.parse(msg.data);

        // Now call the function from the map using data object as the only attribute
        messageSocket.actionFunctionMap[messageSocket.realm][data.action](data);
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
            messageSocket.socket = new WebSocket("ws://" + window.location.host + "/socket/");
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
