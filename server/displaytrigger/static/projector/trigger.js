var trigger = {};
(function(external, options){
	options = _.extend({
		target_selector: '#screen',
		iframe_id: 'iframe_id',
	}, options);
	
	function set_target(html) {
		$(options.target_selector).html(html);
	}
	
	var trigger_cmds = {
		precache: function(data) {
			if (utils.is_image(data.src)) {
				var img = new Image();
				img.src = data.src;
			}
			if (utils.is_video(data.src)) {
				load_video(data.src, _.extend(data, {play: false}));
			}
		},
		start: function(data) {
			if (utils.is_image(data.src)) {
				set_target("<img src='SRC'>".replace('SRC', data.src));
			}
			if (utils.is_video(data.src)) {
				load_video(data.src, _.extend(data, {play: true}), {ended: trigger_cmds.empty});
			}
		},
		stop: function(data) {
			console.log('stop');
		},
		iframe: function(data) {
			if (data.src) {
				set_target("<iframe id='IFRAME_ID' src='SRC' scrolling='no'>".replace('SRC', data.src).replace('IFRAME_ID', options.iframe_id));
			}
			if (data.func_iframe) {
				var iframe_element = document.getElementById(options.iframe_id);
				var iframe_window = iframe_element.contentWindow;
				if (!iframe_window) {log.error("Invalid trigger target", options.iframe_id); return;}
				// Attempt direct javascript call to iframe
				try {
					utils.get_func(iframe_window, data.func_iframe)(data);
				}
				// Fallback to html5 postMessage()
				catch (error) {
					if (error.name != "SecurityError") {log.error(error); return}
					iframe_window.postMessage(JSON.stringify(data), data.target_domain || "*"); //iframe_element.src  //window.location.origin
				}
			}
		},
		empty: function(data) {
			overlay.fade_out(function() {
				set_target("");
			});
		},
		overlay: function(data) {
			overlay.overlay_html(data);
		},
	}
	external = _.extend(external, trigger_cmds);
}(trigger, {
	target_selector: '#screen',
}));
