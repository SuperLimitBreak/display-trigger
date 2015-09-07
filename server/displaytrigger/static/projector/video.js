var video = {};

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
		default_event_listeners: {}
	}, options);
	
	function _get_video_element(create, target_selector, onCreateVideo) {
		if (!target_selector) {target_selector = options.target_selector;}
		var selector_video = target_selector+' video';
		var video = $(selector_video).get(0);
		if (!video && create) {
			$(target_selector).append('<video></video>');
			video = $(selector_video).get(0);
			onCreateVideo(video);
		}
		return video || {};
	}

	function load(src, _options, event_listeners) {
		_options = _.extend({
			'target_selector': options.target_selector,
			'play': true,
			'volume': 1.0,
			'loop': false,
		}, _options);
		
		$(_options.target_selector+' :not(video)').remove();
		if (!src) {
			$(_options.target_selector).empty();
			return;
		}

		var video = _get_video_element(true, _options.target_selector, function(video){
			_.each(event_listeners || {}, function(value, key, dict){
				video.addEventListener(key, value);
				// Future Feature: Consider a custom event that fires a few seconds before the end to allow a smooth fade out
			});
		});

		video.loop = _options.loop;
		video.volume = _options.volume;
		video.controls = false;
		//video.poster = '';
		video.preload = "auto";
		video.autoplay = _options.play;
		if (video.currentSrc.indexOf(src) > -1) {
			console.log('video already loaded');
			video.pause();
		}
		else {
			console.log('video loading')
			video.src = src;
			video.load();
		}
		video.currentTime = _options.currentTime || 0;
		if (_options.play) {
			video.play();
		}
	}
	
	function precache(data, event_listeners) {
		load(
			data.src,
			_.extend({}, data, {play: false}),
			_.extend({}, options.default_event_listeners, event_listeners)
		);
	}

	function start(data, event_listeners) {
		load(
			data.src,
			_.extend({}, data, {play: true}),
			_.extend({}, options.default_event_listeners, event_listeners)
		);
	}
	
	_.extend(external, {
		precache: precache,
		start: start,
	});

}(video, utils.functools.get('options.video')));
