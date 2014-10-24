var socket = WebSocketReconnect({
    onopen: function() {
        console.log('connected');
    },
    onmessage: function(data) {
        console.log('message', data);
    }
});

function image(src) {
    socket.send({
        func: 'trigger.precache',
        src: src,
    });
}
