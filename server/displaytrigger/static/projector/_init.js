
(function(){

	function getModuleList(name) {
		var param = utils.url.getUrlParameter(name);
		if (!Boolean(param)) {
			return [];
		}
		return _.map(param.split(','), function(item){return item.trim();});
	}
	var include = getModuleList('include');
	var exclude = getModuleList('exclude');
	
	//console.log(include, exclude);
})();

var socket = WebSocketReconnect({
	onopen: function() {},
	onmessage: utils.functools.run_funcs,
});
