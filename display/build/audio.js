var audio = {};

(function(external, options){
	options = _.extend({
		target_selector: '#offscreen',
		default_event_listeners: {
			//timeupdate: function (event) {
			//	var current_time = event.target.currentTime;
			//	console.log('timeupdate', current_time);
			//}
		}
	}, options);
	
	
	function load(src, _options, event_listeners) {
		_options = _.extend({
			'target_selector': options.target_selector,
			'play': true,
			'volume': 1.0,
			'loop': false,
		}, _options);
		
		var $audio = $(_options.target_selector+" audio");
		if (!$audio.length) {
			$(_options.target_selector).append('<audio/>');
			$audio = $(_options.target_selector+" audio");
		}
		var audio = $audio.get(0);
		
		_.each(event_listeners || {}, function(value, key, dict){
			//audio.detachEvent(key);
			audio.addEventListener(key, value);
			// Future Feature: Consider a custom event that fires a few seconds before the end to allow a smooth fade out
		});
		
		audio.loop = _options.loop;
		audio.volume = _options.volume;
		audio.controls = true;
		audio.preload = "auto";
		audio.autoplay = _options.play;
		
		if (audio.currentSrc.indexOf(src) > -1) {
			console.log('audio already loaded');
			audio.pause();
		}
		else {
			console.log('audio loading')
			audio.src = src;
			audio.load();
		}
		audio.currentTime = _options.currentTime || 0;
		if (_options.play) {
			audio.play();
		}

	}
	
	function precache(data) {
		load(
			data.src,
			_.extend({}, data, {play: false})
		);
	}

	function start(data, event_listeners) {
		load(
			data.src,
			_.extend({}, data, {play: true}),
			_.extend({}, options.default_event_listeners, event_listeners)
		);
	}

	function stop() {
		$(options.target_selector+" audio").remove();
	}

	// EventBus ----------------------------------------------------------------
	$.subscribe('trigger.stop', stop);

	// Export ------------------------------------------------------------------
	_.extend(external, {
		precache: precache,
		start: start,
		stop: stop,
	});

}(audio, utils.functools.get('options.audio')));
