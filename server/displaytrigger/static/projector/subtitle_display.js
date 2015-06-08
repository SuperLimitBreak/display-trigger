var subtitles = {};
(function(external, options){
	options = _.extend({
		selector_holder: '#screen',
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
    
    function load_subtitles(src, _options, event_listeners) {
		_options = _.extend({
			'selector_holder': options.selector_holder,
			'play': true,
		}, _options);

		if (!src) {
			$(_options.selector_holder).empty();
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
                    load_subtitles(src, _options, event_listeners);
                },
            });
            return;
        }
        
        if (!_.isEmpty(subtitles) && _options.play) {
            play();
        }

    };

    // Play --------------------------------------------------------------------
    
    function play() {
        var start_timestamp = Date.now();
        function update() {
            var timestamp = Date.now() - start_timestamp;
            var subtitle = get_subtitle_at_timestamp(timestamp);
            var next_subtitle = subtitles[!_.isUndefined(subtitle) && subtitle.index || 0];
            options.display_function(subtitle, next_subtitle);
            if (!_.isUndefined(next_subtitle) && (next_subtitle.index + 1 < subtitles.length)) {
                timeout = setTimeout(update, next_subtitle.start-timestamp);
            }
        }
        update();
    }
    
    function stop() {
        if (timeout) {
            clearInterval(timeout);
        }
    }
    
    // Export ------------------------------------------------------------------
    
    external.load_subtitles = load_subtitles;
    external.play = play;
    external.stop = stop;
    
}(
	subtitles, {
	}
));
