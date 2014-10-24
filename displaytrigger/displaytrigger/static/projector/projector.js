var $screen = $('#screen');

var COMMAND_HANDLERS = {};

function get_func(obj, cmd) {
    if (typeof(cmd)=="string") {cmd = cmd.split(".");}
    if (cmd.length == 1) {
        return obj[cmd.shift()];
    }
    if (cmd.length > 1) {
        return get_func(obj[cmd.shift()], cmd);
    }
    console.error('What?');
    return function(){};
}

var socket = WebSocketReconnect({
    onopen: function() {},
    onmessage: function(data) {
        console.log('message', data);
        if (_.has(data, 'func')) {
            get_func(window, data.func)(data);
        }
    }
});

var trigger = {
    precache: function() {
        console.log('precache');
    },
    start: function() {
        console.log('start');
    },
    stop: function() {
        console.log('stop');
    }
};