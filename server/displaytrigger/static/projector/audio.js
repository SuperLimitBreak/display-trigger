var audio = {};

(function(external, options){
	options = _.extend({
		target_selector: '#offscreen',
		default_event_listeners: {}
	}, options);
	

	function precache() {
		
	}

	function start() {
		
	}

	function stop() {
		
	}

	_.extend(external, {
		precache: precache,
		start: start,
		stop: stop,
	});

}(audio, utils.functools.get('options.audio')));
