setup_websocket(
    // onConnect()
    function() {
        console.log('connected');
    },
    
    // onMessage
    function(data) {
        console.log('message', data);
    }
);