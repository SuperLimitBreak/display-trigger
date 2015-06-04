
var utils = function() {
	var utils = {};

	function get_func(obj, cmd) {
		//console.log('get_func', obj, cmd);
		if (typeof(cmd) == "string") {cmd = cmd.split(".");}
		if (cmd.length == 1) {return obj[cmd.shift()];}
		if (cmd.length > 1) {
			var next_cmd = cmd.shift();
			var next_obj = obj[next_cmd];
			if (typeof(next_obj) == "undefined") {
				console.error(""+obj+" has no attribute "+next_cmd);
				return function(){};
			}
			return get_func(next_obj, cmd);}
		console.error('What?');
		return function(){};
	}
	utils.get_func = get_func;
	
	utils.is_image = function(src) {
		return src && src.match(/\.(jpg|png|bmp|gif|jpeg|svg|tiff)$/);
	}
	utils.is_audio = function(src) {
		return src && src.match(/\.(mp3|wav|ogg|flac|ac3|mp2)$/);
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
