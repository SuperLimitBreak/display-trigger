var image = {};

(function(external, options){
	options = _.extend({
		target_selector: '#screen',
	}, options);

    function precache(data) {
		//if (utils.is_image(data.src)) {
        var img = new Image();
        img.src = data.src;  // TODO: does this actually work?
    };

    function start(data) {
        //if (utils.is_image(data.src)) {
        $(options.target_selector).html("<img src='SRC'>".replace('SRC', data.src));
    };

    _.extend(external, {
        precache: precache,
        start: start,
    });

}(image, {
	'target_selector': '#screen',
}));

