var displaytrigger = window.displaytrigger || {
	deviceid: "",
};

(function(external){

	function getModuleList(name) {
		var param = utils.url.getUrlParameter(name);
		if (!Boolean(param)) {
			return [];
		}
		return _.map(param.split(','), function(item){return item.trim();});
	}
	//var include = getModuleList('include');
	//var exclude = getModuleList('exclude');
	//console.log(include, exclude);
	
	displaytrigger.deviceid = utils.url.getUrlParameter('deviceid') || displaytrigger.deviceid;
	
	function is_data_for_this_deviceid(data) {
		return data && (!data.deviceid || !displaytrigger.deviceid || displaytrigger.deviceid.search(data.deviceid)>=0);
	}

	var socket = WebSocketReconnect({
		onopen: function() {},
		onmessage: function(data){
			// Filter messages not intended for this device
			if (_.isArray(data)) {
				data = _.filter(data, is_data_for_this_deviceid)
			}
			else if (!is_data_for_this_deviceid(data)) {
				data = {};
			}
			utils.functools.run_funcs(data)
		},
	});
	
	// Exports
	external.socket = socket;
	
})(window);

