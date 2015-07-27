var image = {};

/*

	Display images from triggers.
	Known image positions can be setup using image_id's. These are defined in css.
	

*/

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
		fullscreen_image_id: 'fullscreen',
		image_id_prefix: 'image_',
	}, options);

	function precache(data) {
		var src = data.src || data;
		if (utils.is_image(src)) {
			var img = new Image();
			img.src = src;  // TODO: does this actually work?
		}
	};

	function precache_list(data) {
		$.ajax({
			method: 'get',
			url: data.src,
			success: function(data) {
				_.each(data, precache(data));
			},
		});
	};

	function stop(data) {
		if (data.id) {
			$(options.image_id_prefix + data.id).remove();
		}
		else if (data.src) {
			// Todo - investigate jquery selector for src attribute
			//$(options.target_selector+' img src=' + data.src).remove();
		}
		else {
			$(options.target_selector).empty();
		}
	}

	function start(data) {
		var $target = $(options.target_selector);
		var image_id = options.image_id_prefix + (data.id || options.fullscreen_image_id);
		if (!data.id) {
			$target.empty();
		}
		var $exisiting_image = $target.find('#'+image_id);
		if ($exisiting_image.length) {
			$exisiting_image.attr('src', data.src);
		}
		else {
			$target.append("<img id='ID' src='SRC'>".replace('ID', image_id).replace('SRC', data.src));
		}
	};

	_.extend(external, {
		precache: precache,
		start: start,
	});

}(image, utils.functools.get('options.image')));

