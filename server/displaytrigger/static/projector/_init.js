var displaytrigger = window.displaytrigger || {
	deviceids: ['all'],
};

(function(external){
	var options = {
		disconnected_class: 'websocket_disconnected',
	};

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
	
	displaytrigger.deviceids = _.union(
		_.filter(
			_.map((utils.url.getUrlParameter('deviceid') || "").split(','), function(item){return item.trim();}),
			function (item) {return item;}
		),
		displaytrigger.deviceids
	);
	
	function is_data_for_this_deviceid(data) {
		if (_.isEmpty(displaytrigger.deviceids)) {
			console.log('emplty', displaytrigger.deviceids);
            return true;
        }
		return _.find(displaytrigger.deviceids, function(deviceid){
			return data && (!data.deviceid || !deviceid || deviceid.search(data.deviceid)>=0);
		});
	}

	var socket = SubscriptionSocketReconnect({
		subscriptions: displaytrigger.deviceids,
	}, {
		onconnected: function() {
			$('body').removeClass(options.disconnected_class);
		},
		ondisconnected: function() {
			$('body').addClass(options.disconnected_class);
		},
		onmessage: function(data){
			if (!is_data_for_this_deviceid(data)) {
				data = {};
			}
			utils.functools.run_funcs(data)
		},
	});
	
	// Exports
	external.socket = socket;
	
})(window);

