var fader = {};

(function(external, options){
	options = _.extend({
		target_selector: '',
		fade_duration: 1000,
		fade_classname_active: 'fade',
	}, options);

	var timeout = null;
	
	function fade_out(callback_fade_complete) {
		$(options.target_selector).addClass(options.fade_classname_active);
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		timeout = setTimeout(
			function(){
				if (callback_fade_complete) {
					callback_fade_complete();
				}
				$(options.target_selector).removeClass(options.fade_classname_active);
			},
			options.fade_duration
		);
	}
	
	_.extend(external, {
		fade_out: fade_out,
	});

}(fader, utils.functools.get('options.fader') || {
	'target_selector': '#fader',
	'fade_duration': 1500,
}));
