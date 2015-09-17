var overlay = {};

(function(external, options){
	options = _.extend({
		element_selector: '#overlay',
		element_selector_top_level: 'body',
		overlay_classname_active: 'show_overlay',
		default_duration: 5000,
	}, options);

	function show_overlay(element_selector, html, classname_active) {
		$(element_selector || options.element_selector).html(html || '');
		$(options.element_selector_top_level).addClass(classname_active || options.overlay_classname_active);
	}
	function hide_overlay(classname_active) {
		$(options.element_selector_top_level).removeClass(classname_active || options.overlay_classname_active);
	}

	var overlay_timeouts = {};
	function clear_overlay_timeout(timeout_name) {
		_.each(overlay_timeouts, function(value, key, dict){
			if (!timeout_name || timeout_name==key) {
				clearTimeout(value);
				// Todo? remove from dict?
			}
		});
	}
	function set_overlay_timeout(timeout_name, timeout_function, duration) {
		overlay_timeouts[timeout_name || 'default'] = setTimeout(timeout_function, duration);
	}

	function html_bubble(data) {
		data = _.extend({
			html            : '',
			duration        : options.default_duration,
			element_selector: options.element_selector,
			classname_active: options.overlay_classname_active,
			timeout_name: 'overlay',
		}, data);
		show_overlay(data.element_selector, data.html, data.classname_active);
		clear_overlay_timeout(data.timeout_name);
		set_overlay_timeout(data.timeout_name, function(){hide_overlay(data.classname_active)}, data.duration);
	}

	_.extend(external, {
		html_bubble: html_bubble,
	});
	
}(overlay, utils.functools.get('options.fader') || {
	
}));
