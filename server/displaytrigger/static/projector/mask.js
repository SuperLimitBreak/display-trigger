var mask = {};

(function(external, options){
	options = _.extend({
		element_selector: '#mask',
		element_selector_top_level: 'body',
	}, options);

	function mask(data) {
		//var $overlay = $("#fader");
		//$mask = $("<img>");
		//$mask.attr("src", data.src);
		//$overlay.append($mask);
		//console.log("do", options.element_selector_top_level, data.css_class);
		$(options.element_selector_top_level).addClass(data.css_class);
	}

    function empty() {
        $(options.element_selector_top_level).removeClass("reignite_mask");
    }
    
    $.subscribe('trigger.stop', empty);
    
	_.extend(external, {
		mask: mask,
	});
	
}(mask, utils.functools.get('options.mask') || {
	
}));
