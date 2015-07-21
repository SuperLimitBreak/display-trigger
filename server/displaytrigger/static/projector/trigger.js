var trigger = {};

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
		iframe_id: 'iframe_id',
	}, options);
	
	
	function empty(data) {
		fader.fade_out(function() {
			$(options.target_selector).html('');
		});
	}

	external = _.extend(external, {
		empty: empty,
	});

}(trigger, {
	target_selector: '#screen',
}));
