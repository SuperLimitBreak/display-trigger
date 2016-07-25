var mask = {};

(function(external, options){
	options = _.extend({
		element_selector: '#mask',
		//element_selector_top_level: 'body',
	}, options);

	function mask(data) {
		//var $overlay = $("#fader");
		//$mask = $("<img>");
		//$mask.attr("src", data.src);
		//$overlay.append($mask);
		//console.log("do", options.element_selector_top_level, data.css_class);
		
		//$(options.element_selector_top_level).addClass(data.css_class);
		var $mask_container = $(options.element_selector);
		var $mask_image = $("<img>");
		$mask_image.attr("src", data.src);
		$mask_container.append($mask_image);
	}

    function empty() {
        //$(options.element_selector_top_level).removeClass("reignite_mask");
		var $mask_container = $(options.element_selector);
		$mask_container.clear();
    }
    
    $.subscribe('trigger.stop', empty);
    
	_.extend(external, {
		mask: mask,
	});
	
}(mask, utils.functools.get('options.mask') || {
	
}));
