
var utils = function() {
    var utils = {};
    
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
    utils.get_func = get_func;
    
    utils.is_image = function(src) {
        return src && src.match(/\.(jpg|png|bmp|gif|jpeg|svg|tiff)$/);
    }
    utils.is_video = function(src) {
        return src && src.match(/\.(mp4|avi|mov|mkv|ogm|3gp)$/);
    }

    return utils;
}();
    
var socket = WebSocketReconnect({
    onopen: function() {},
    onmessage: function(data) {
        //console.log('message', data);
        if (_.has(data, 'func')) {
            utils.get_func(window, data.func)(data);
        }
    }
});


var trigger = {
    precache: function(data) {
        //console.log('precache', data);
        if (utils.is_image(data.src)) {
            var img = new Image();
            img.src = data.src;
        }
    },
    start: function(data) {
        //console.log('start', data);
        if (utils.is_image(data.src)) {
            $('#screen').html("<img src='SRC'>".replace('SRC', data.src));
        }
    },
    stop: function(data) {
        console.log('stop');
    }
};