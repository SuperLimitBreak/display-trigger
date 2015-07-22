
var socket = WebSocketReconnect({
	onopen: function() {},
	onmessage: utils.functools.run_funcs,
});
