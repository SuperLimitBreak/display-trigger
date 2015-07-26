var image = window.image || {};

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
	}, options);

	_.extend(external, {
	});

}(image, utils.functools.get('options.image_flicker')));

