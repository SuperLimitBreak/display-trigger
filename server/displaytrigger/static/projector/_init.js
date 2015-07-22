
function run_funcs(data) {
	//console.log('message', data);
	if (_.isArray(data)) {
		_.each(data, function(element, index, list){
			run_funcs(element);
		});
	}
	if (_.has(data, 'func')) {
		utils.functools.get_func(data.func)(data);
	}
}

var socket = WebSocketReconnect({
	onopen: function() {},
	onmessage: run_funcs,
});
