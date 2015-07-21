
var socket = WebSocketReconnect({
	onopen: function() {},
	onmessage: function(data) {
		//console.log('message', data);
		if (_.has(data, 'func')) {
			utils.functools.get_func(data.func)(data);
		}
	}
});
