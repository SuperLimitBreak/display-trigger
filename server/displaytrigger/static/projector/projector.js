
var utils = function() {
	var utils = {};

	function get_func(obj, cmd) {
		//console.log('get_func', obj, cmd);
		if (typeof(cmd) == "string") {cmd = cmd.split(".");}
		if (cmd.length == 1) {return obj[cmd.shift()];}
		if (cmd.length > 1) {
			var next_cmd = cmd.shift();
			var next_obj = obj[next_cmd];
			if (typeof(next_obj) == "undefined") {
				console.error(""+obj+" has no attribute "+next_cmd);
				return function(){};
			}
			return get_func(next_obj, cmd);}
		console.error('What?');
		return function(){};
	}
	utils.get_func = get_func;
	
	utils.is_image = function(src) {
		return src && src.match(/\.(jpg|png|bmp|gif|jpeg|svg|tiff)$/);
	}
	utils.is_audio = function(src) {
		return src && src.match(/\.(mp3|wav|ogg|flac|ac3|mp2)$/);
	}
	utils.is_video = function(src) {
		return src && src.match(/\.(mp4|avi|mov|mkv|ogm|3gp)$/);
	}

	return utils;
}();
	
var socket = WebSocketReconnect({
	onopen: function() {},
	onmessage: function(data) {
		//console.log('message', data);
		if (_.has(data, 'func')) {
			utils.get_func(window, data.func)(data);
		}
	}
});

var overlay = {};
(function(external, options){
	options = _.extend({
		element_selector: '#overlay',
		element_selector_top_level: 'body',
		overlay_classname_active: 'show_overlay',
		default_duration: 5000,
		fade_classname_active: 'fade',
	}, options);

	function show_overlay(element_selector, html, classname_active) {
		$(element_selector || options.element_selector).html(html || '');
		$(options.element_selector_top_level).addClass(classname_active || options.overlay_classname_active);
	}
	function hide_overlay(classname_active) {
		$(options.element_selector_top_level).removeClass(classname_active || options.overlay_classname_active);
	}

	var overlay_timeouts = {};
	function clear_overlay_timeout(timeout_name) {
		_.each(overlay_timeouts, function(value, key, list){
			if (!timeout_name || timeout_name==key) {
				clearTimeout(value);
			}
		});
	}
	function set_overlay_timeout(timeout_name, timeout_function, duration) {
		overlay_timeouts[timeout_name || 'default'] = setTimeout(timeout_function, duration);
	}

	external.overlay_html = function(data) {
		data = _.extend({
			html            : '',
			duration        : options.default_duration,
			element_selector: options.element_selector,
			classname_active: options.overlay_classname_active,
		}, data);
		show_overlay(data.element_selector, data.html, data.classname_active);
		clear_overlay_timeout();
		set_overlay_timeout(null, function(){hide_overlay(data.classname_active)}, data.duration);
	}
	
	external.fade_out = function(callback_fade_complete) {
		var fade_key = 'fade';
		show_overlay('#fader', '', fade_key);
		clear_overlay_timeout(fade_key);
		set_overlay_timeout(null, function(){
			callback_fade_complete();
			hide_overlay(fade_key);
		}, 1500);
	}
}(
	overlay, {
	}
));

var trigger = {};
(function(external, options){
	options = _.extend({
		target_selector: '#screen',
		iframe_id: 'iframe_id',
	}, options);
	
	function set_target(html) {
		$(options.target_selector).html(html);
	}
	
	external = _.extend(external, {
		precache: function(data) {
			if (utils.is_image(data.src)) {
				var img = new Image();
				img.src = data.src;
			}
			if (utils.is_video(data.src)) {
				load_video(data.src, _.extend(data, {play: false}));
			}
		},
		start: function(data) {
			if (utils.is_image(data.src)) {
				set_target("<img src='SRC'>".replace('SRC', data.src));
			}
			if (utils.is_video(data.src)) {
				load_video(data.src, _.extend(data, {play: true}));
			}
		},
		stop: function(data) {
			console.log('stop');
		},
		iframe: function(data) {
			if (data.src) {
				set_target("<iframe id='IFRAME_ID' src='SRC' scrolling='no'>".replace('SRC', data.src).replace('IFRAME_ID', options.iframe_id));
			}
			if (data.func_iframe) {
				var iframe_element = document.getElementById(options.iframe_id);
				var iframe_window = iframe_element.contentWindow;
				if (!iframe_window) {log.error("Invalid trigger target", options.iframe_id); return;}
				// Attempt direct javascript call to iframe
				try {
					utils.get_func(iframe_window, data.func_iframe)(data);
				}
				// Fallback to html5 postMessage()
				catch (error) {
					if (error.name != "SecurityError") {log.error(error); return}
					iframe_window.postMessage(JSON.stringify(data), data.target_domain || "*"); //iframe_element.src  //window.location.origin
				}
			}
		},
		empty: function(data) {
			overlay.fade_out(function() {
				set_target("");
			});
		},
		overlay: function(data) {
			overlay.overlay_html(data);
		},
	});
}(trigger, {
	target_selector: '#screen',
}));


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
		if (!event_listeners) {event_listeners = {};}
		_options = _.extend({
			'selector_holder': options.selector_holder,
			'play': true,
			'volume': 1.0,
		}, _options);

		$(_options.selector_holder+' :not(video)').remove();
		if (!src) {
			$(_options.selector_holder).empty();
			return;
		}

		var video = _get_video_element(true, _options.selector_holder, function(video){
			_.each(event_listeners, function(key, value, dict){
				video.addEventListener(key, value);
			});
		});

		video.loop = false;
		video.volume = _options.volume;
		video.controls = false;
		//video.poster = '';
		video.preload = "auto";
		video.autoplay = _options.play;
		console.log(video.currentSrc, src);
		if (video.currentSrc.indexOf(src) > -1) {
			video.pause();
			video.currentTime = 0;
		}
		else {
			video.src = src;
			video.load();
		}
		if (_options.play) {
			video.play();
		}
	}

	external.load_video = load_video;

}(window, {
	'selector_holder': '#screen',
}));
