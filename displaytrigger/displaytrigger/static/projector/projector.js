var $screen = $('#screen');

var ADD_HANDLERS = {
    'image': function(data){
        var html = "<img src='"+data.src+"'>";
        console.log(html);
        $screen.html(html);
    },
    'video': function(data){},
    'function': function(data){},
    'iframe': function(data){},
}

var COMMAND_HANDLERS = {
    'add': function(data){ADD_HANDLERS[data.type](data);},
    'next': function(data){},
    'return': function(data){},
};

var socket = WebSocketReconnect({
    onopen: function() {
        console.log('connected');
    },
    onmessage: function(data) {
        console.log('message', data);
        COMMAND_HANDLERS[data.cmd](data);
    }
});