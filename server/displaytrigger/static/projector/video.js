
(function(external, options){
	options = _.extend({
		selector_holder: '#fullscreen_video',
	}, options);

	function _get_video_element(create, selector_holder, onCreateVideo) {
		if (!selector_holder) {selector_holder = options.selector_holder;}
		var selector_video = selector_holder+' video';
		var video = $(selector_video).get(0);
		if (!video && create) {
			$(selector_holder).append('<video></video>');
			video = $(selector_video).get(0);
			onCreateVideo(video);
		}
		return video || {};
	}

	function load_video(src, _options, event_listeners) {
		_options = _.extend({
			'selector_holder': options.selector_holder,
			'play': true,
			'volume': 1.0,
			'loop': false,
		}, _options);

		$(_options.selector_holder+' :not(video)').remove();
		if (!src) {
			$(_options.selector_holder).empty();
			return;
		}

		var video = _get_video_element(true, _options.selector_holder, function(video){
			_.each(event_listeners || {}, function(value, key, dict){
				video.addEventListener(key, value);
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

	external.load_video = load_video;

}(window, {
	'selector_holder': '#screen',
}));
