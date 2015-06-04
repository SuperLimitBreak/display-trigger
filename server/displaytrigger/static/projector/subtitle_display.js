var subtitle_display = {};
(function(external, options){
	options = _.extend({
		selector_holder: '#screen',
	}, options);

    var SRT_INDEX = 0;
    var SRT_INDEX_TIMING = 1;
    var SRT_INDEX_TEXT = 2;
    
    
    function load_subtitle_data(data) {
        data = data.replace(/(\r\n|\r|\n)/g, '\n').split('\n\n');
        data = _.map(data, function(index, element, list){
            var line = element.split('\n');
            var times = parse_srt_time(line[SRT_INDEX_TIMING]);
            return {
                'index': line[SRT_INDEX],
                'start': times[0],
                'stop': times[1],
                'text': times[SRT_INDEX_TEXT],
            }
        });
        
    }
    
    function load_subtitles(src, _options, event_listeners) {
		_options = _.extend({
			'selector_holder': options.selector_holder,
			'play': true,
		}, _options);

		if (!src) {
			$(_options.selector_holder).empty();
			return;
		}

        $.ajax({
            method: 'get',
            url: src,
            success: load_subtitle_data,
        });

    };
    
    external.load_subtitles = load_subtitles;
    
}(
	subtitle_display, {
	}
));
