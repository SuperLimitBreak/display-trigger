var subtitles = {};

//subtitles.load('/static/assets/test.srt')


// Display ---------------------------------------------------------------------

(function(external, options){
	options = _.extend({
		selector_holder: '',
		scroll_time: 200,
	}, options);
	
	function display(a, b, c) {
		var $container = $(options.selector_holder);
		$container.empty();
		
		function get_duration(subtitle) {
			if (subtitle) {
				return (subtitle.stop - subtitle.start);
			}
			return 0;
		}
		function get_duration_difference(subtitle, next_subtitle) {
			if (next_subtitle) {
				return next_subtitle.start - (subtitle && subtitle.start || 0);
			}
			return 0;
		}
		
		function line(index, subtitle, duration) {
			index = index || 1;
			duration = duration || 0;
			var $subtitle = $('<div/>');
			$subtitle.addClass('subtitle');
			$subtitle.addClass('subtitle_'+index);
			if (subtitle) {
				$subtitle.text(subtitle.text);
				$subtitle.css({
					animation: 'scroll_out '+options.scroll_time+'ms '+(duration - options.scroll_time)+'ms',
				});
				$subtitle.on('animationend', function(){$subtitle.empty()});
			}
			return $subtitle;
		}
		
		function timer(duration) {
			$timer = $('<div/>');
			$timer.addClass('subtitle_timer');
			if (duration) {
				$timer.css({
					animation: 'full_width '+duration+'ms linear',
				});
			}
			return $timer;
		}
		
		$container.append(line(1, a, get_duration(a)));
		$container.append(timer(get_duration(a)));
		$container.append(line(2, b, get_duration_difference(a, b)));
		
	}
	
	external.display = display;
}(
	subtitles,{
		selector_holder: '#screen',
	}
));


// Model -----------------------------------------------------------------------

(function(external, options){
	options = _.extend({
		display_function: function(a,b,c){console.log(a,b,c);},
	}, options);

	var SRT_INDEX = 0;
	var SRT_INDEX_TIMING = 1;
	var SRT_INDEX_TEXT = 2;

	var subtitle_src = "";
	var subtitles = [];
	
	var timeout;
	
	// Utils -------------------------------------------------------------------

	function get_subtitle_at_timestamp(timestamp) {
		return _.find(subtitles, function(subtitle) {
			return subtitle && subtitle.start < timestamp && subtitle.stop > timestamp;
		});
	}

	function safe_get(list, index) {
		if (!list) {return undefined;}
		if (index < list.length) {return list[index];}
		return undefined;
	}
	
	// Parse SRT ---------------------------------------------------------------
	
	function parse_srt_time(value) {
		return _.map(value.split('-->'), function(element, index, list){
			var t1, t2, t3, t4, tx;
			tx = element.split(',');
			t4 = tx[1];
			tx = tx[0].split(':');
			t1 = tx[0];
			t2 = tx[1];
			t3 = tx[2];
			return (((Math.floor(t1) * 60 * 60) + (Math.floor(t2) * 60) + Math.floor(t3)) * 1000) + Math.floor(t4);
		});
	};
	
	function parse_srt_record(record) {
		_return = {index: 0, start: 0, stop : 0, text : ""};
		try {
			var record_split = record.split('\n');
			record_split[SRT_INDEX_TIMING] = parse_srt_time(record_split[SRT_INDEX_TIMING]);
			_return.index = Math.floor(record_split[SRT_INDEX]);
			_return.start = record_split[SRT_INDEX_TIMING][0];
			_return.stop = record_split[SRT_INDEX_TIMING][1];
			_return.text = record_split[SRT_INDEX_TEXT];
		} catch(e) {
			if (record) {
				console.warn("Unable to parse line: ", record);
			}
		}
		return _return;
	}
	
	function parse_subtitle_data(data) {
		data = data.replace(/(\r\n|\r|\n)/g, '\n').split('\n\n');
		return _.filter(_.map(data, parse_srt_record), function(element){return element.text});
	};
	

	// Load --------------------------------------------------------------------
	
	function load(src, _options, event_listeners) {
		_options = _.extend({
			'play': true,
		}, _options);

		if (!src) {
			subtitles = [];
			return;
		}

		if (src != subtitle_src) {
			$.ajax({
				method: 'get',
				url: src,
				success: function(data) {
					subtitles = parse_subtitle_data(data);
					subtitle_src = src;
					load(src, _options, event_listeners);
				},
			});
			return;
		}
		
		if (!_.isEmpty(subtitles) && _options.play) {
			play();
		}

	};

	// Play --------------------------------------------------------------------
	
	function play(seek_to_time) {
		stop();
		var start_timestamp = _.now();
		if (_.isNumber(seek_to_time)) {
			start_timestamp += -seek_to_time;
		}
		function update() {
			var timestamp = _.now() - start_timestamp;
			if (timestamp > _.last(subtitles).stop) {
				stop();
				return;
			}
			var subtitle = get_subtitle_at_timestamp(timestamp);
			var next_subtitle_index = !_.isUndefined(subtitle) && subtitle.index;
			var next_subtitle = subtitles[next_subtitle_index || 0];
			
			// Display ---
			options.display_function(subtitle, next_subtitle);
			
			// Next ---
			var next_time = (next_subtitle || {}).start || (subtitle || {}).stop;
			if (next_time) {
				timeout = setTimeout(update, next_time - timestamp);
			}
		}
		update();
	}
	
	function stop() {
		options.display_function(null, null);
		if (timeout) {
			clearInterval(timeout);
		}
	}
	
	// Export ------------------------------------------------------------------
	
	external.load = load;
	external.play = play;
	external.stop = stop;
	
}(
	subtitles, utils.functools.get('options.subtiles') || {
		display_function: subtitles.display,
	}
));
