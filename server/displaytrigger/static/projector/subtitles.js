var subtitles = {};

//subtitles.load('/static/assets/test.srt')


// Display ---------------------------------------------------------------------

(function(external, options){
	options = _.extend({
		selector_holder: '#screen',
		scroll_time: 200,
	}, options);
	
	function display(a, b, c) {
		var $container = $(options.selector_holder);
		$container.empty();
		
		var time = 0;
		if (a) {
			time = a.stop - a.start;
		};
		
		function line(subtitle, index) {
			if (!index) {index=1;}
			var $subtitle = $('<div/>');
			$subtitle.addClass('subtitle');
			$subtitle.addClass('subtitle_'+index);
			if (subtitle) {
				$subtitle.text(subtitle.text);
			}
			return $subtitle;
		}
		function timer(subtitle) {
			$timer = $('<div/>');
			$timer.addClass('subtitle_timer');
			if (subtitle) {
				$timer.css({
					animation: 'full_width '+time+'ms linear',
				});
			}
			return $timer;
		}
		
		$container.append(line(a, 1));
		$container.append(timer(a));
		$container.append(line(b, 2));
		
		$container.find('.subtitle').css({
			animation: 'scroll_out '+options.scroll_time+'ms '+(time-options.scroll_time)+'ms',
		})
	}
	
	external.display = display;
}(
	subtitles,{
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
		return _.map(data, parse_srt_record);
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
		var start_timestamp = Date.now();
		if (seek_to_time) {
			start_timestamp += -seek_to_time;
		}
		function update() {
			var timestamp = Date.now() - start_timestamp;
			var subtitle = get_subtitle_at_timestamp(timestamp);
			var next_subtitle = subtitles[!_.isUndefined(subtitle) && subtitle.index || 0];
			console.log(timestamp, subtitle, next_subtitle);
			options.display_function(subtitle, next_subtitle);
			if (next_subtitle) {
				timeout = setTimeout(update, next_subtitle.start - timestamp);
			}
			else {
				stop();
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
	subtitles, {
		display_function: subtitles.display,
	}
));
