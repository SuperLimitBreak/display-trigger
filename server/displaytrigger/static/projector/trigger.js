var trigger = {};

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
	}, options);
	
	
	function empty(data) {
		fader.fade_out(function() {
			$.publish('trigger.stop', null);
			$(options.target_selector).html('');
		});
	}
	
	$.subscribe('trigger.empty', empty);
	
	external = _.extend(external, {
		empty: empty,
	});

}(trigger, utils.functools.get('options.trigger')));
