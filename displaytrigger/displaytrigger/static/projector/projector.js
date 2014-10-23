var socket = WebSocketReconnect({
    onopen: function() {
        console.log('connected');
    },
    onmessage: function(data) {
        console.log('message', data);
    }
});