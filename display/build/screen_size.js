var screen_size = {};

(function(external, options){

    const set_screen_size = (css_dict) => {
        console.log('set_screen_size', css_dict);
        $('#master').css(_.extend({}, {
            position: 'absolute',
        }, css_dict));
    };
    
    _.extend(external, {
        set: set_screen_size,
	});

}(screen_size, utils.functools.get('options.screen_size')));
