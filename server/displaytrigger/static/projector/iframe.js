/*
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
					utils.functools.get_func(data.func_iframe, iframe_window)(data);
				}
				// Fallback to html5 postMessage()
				catch (error) {
					if (error.name != "SecurityError") {log.error(error); return}
					iframe_window.postMessage(JSON.stringify(data), data.target_domain || "*"); //iframe_element.src  //window.location.origin
				}
			}
		},
*/