var iframe = {};

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
        iframe_id: 'iframe_id',
	}, options);

    function init(data) {
        if (!data.src) {console.error("No src provided for iframe"); return;}
        $(options.target_selector).html(
            "<iframe id='IFRAME_ID' src='SRC' scrolling='no'>".replace('SRC', data.src).replace('IFRAME_ID', options.iframe_id)
        );
    }

    function function_call(data, _options) {
        _options = _.extend({}, options, _options);
        
        if (!data.func_iframe) {console.error("no function provided to execute on iframe"); return;}
        
        var iframe_element = document.getElementById(_options.iframe_id);
        var iframe_window = iframe_element.contentWindow;
        if (!iframe_window) {log.error("Invalid trigger target", _options.iframe_id); return;}
        
        try {
            // Attempt direct javascript call to iframe
            utils.functools.get_func(data.func_iframe, iframe_window)(data);
        }
        catch (error) {
            // Fallback to html5 postMessage()
            if (error.name != "SecurityError") {console.error(error); return}
            iframe_window.postMessage(JSON.stringify(data), data.target_domain || "*"); //iframe_element.src  //window.location.origin
        }

    }

	_.extend(external, {
        init: init,
        function_call: function_call,
	});

}(iframe, utils.functools.get('options.iframe')));
