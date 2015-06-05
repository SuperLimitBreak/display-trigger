var subtitle_display = {};
(function(external, options){
	options = _.extend({
		selector_holder: '#screen',
	}, options);

    var SRT_INDEX = 0;
    var SRT_INDEX_TIMING = 1;
    var SRT_INDEX_TEXT = 2;
    
    function parse_srt_time(value) {
        //00:00:16,563  00:00:19,891
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
    
    function load_subtitle_data(data) {
        data = data.replace(/(\r\n|\r|\n)/g, '\n').split('\n\n');
        data = _.map(data, function(element, index, list){
            var line = element.split('\n');
            console.log(line);
            var times = parse_srt_time(line[SRT_INDEX_TIMING]);
            return {
                'index': line[SRT_INDEX],
                'start': times[0],
                'stop': times[1],
                'text': times[SRT_INDEX_TEXT],
            }
        });
        console.log(data);
    };
    
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
