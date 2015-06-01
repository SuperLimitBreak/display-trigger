var background_scroller = {};


(function(external, options) {
    // Constants ---------------------------------------------------------------

	var DEFAULT_THING = 5;
    var BACKGROUND_CSS = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        //image-rendering: -webkit-optimize-contrast,
        //image-rendering: -webkit-crisp-edges,
        //'image-rendering': "-moz-crisp-edges",
        //image-rendering: -o-crisp-edges,
        'image-rendering': 'pixelated',
        'background-color': 'black',
		overflow: 'hidden',
    };

	// Options -----------------------------------------------------------------

	options = _.extendOwn({
        thing: DEFAULT_THING,
	}, options);


	// Variables ---------------------------------------------------------------

	var css = {};

	var backgrounds = {
		castelvania_1: {
			background_url: '/ext/castlevaniafullgamemapempty.PNG',
            source_screen_height: 184,
            source_width: 9928,
            source_height: 1908,
		},
		castelvania_sotn: {
            background_url: '/ext/sotn-castle.png',
            source_screen_height: 206,
            source_width: 15648,
            source_height: 12000,
		},
		super_metroid: {
			background_url: '/ext/SuperMetroidMapZebes.png',
			source_screen_height: 192,
            source_width: 16896,
            source_height: 14336,			
		}
	}
	
	var scrolls = [
		_.extend({}, backgrounds.super_metroid, {
            startX: -4100,
            startY: -8968,
			endX: 1000,
            duration: '10s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
            startX: 0,
            startY: -1563,
			endX: 1000,
			duration: '10s',
        }),
		_.extend({}, backgrounds.castelvania_1, {
            startX: -4254,
            startY: -1724,
			endX: 1000,
			duration: '10s',
        }),
		_.extend({}, backgrounds.castelvania_1, {
            startX: -2096,
            startY: -586,
			endX: 1000,
			duration: '10s',
        }),
		_.extend({}, backgrounds.castelvania_sotn, {
            startX: -528,
            startY: -8968,
			endX: 2000,
            duration: '30s',
		}),
	]
	
    // Functions ---------------------------------------------------------------

	// Cache load fix - http://mikefowler.me/2014/04/22/cached-images-load-event/
	function on_load($image, f) {
		$image.on('load', f);
		if ($image[0].complete) {
		  $image.load();
		}	
	}
	
	function scroller($parent) {
		var _scrolls = _.clone(scrolls).reverse();
		function next() {
			setup_background($parent, _scrolls.pop(), next);
		}
		next();
	}
    
    function setup_background($element, params, func_complete) {
		console.log(params);
		if (!func_complete) {
			func_complete = function() {};
		}		
		
		if (typeof(params.endX) == 'undefined') {
			params.endX = params.startX
		}
		if (typeof(params.endY) == 'undefined') {
			params.endY = params.startY
		}

        var ratio = $element.innerHeight() / params.source_screen_height;
		function px(value) {
			return ''+(value*ratio)+'px';
		}
		function px2(x, y) {
			return ''+px(x)+' '+px(y);
		}
console.log('1');
		var $image = $element.find('img');
		var image_loaded = ($image.attr('src') == params.background_url);
		
		if (!image_loaded) {
console.log('2');
			$element.empty();
			var $container = $('<div/>');
			$image = $('<img/>');
			$container.css(BACKGROUND_CSS);
			$container.append($image);
			$element.append($container);
		}
console.log('3');
		function transition_image() {
console.log('4');
			$image.css({
				transition: 'all '+params.duration+' linear',
				transform: 'translateX('+px(params.startX-params.endX)+') translateY('+px(params.startY-params.endY)+')',
			});
		}
		function postion_image() {
console.log('5');
			$image.css({
				top: px(params.startY),
				left: px(params.startX),
				transition: '',
				transform: '',
			});
		}
console.log('6');
		if (!image_loaded) {
console.log('7');
			//$image.on('load', transition_image);
			on_load($image, transition_image);
			$image.attr('src', params.background_url);
			$image.css({
				position: 'absolute',
				width: px(params.source_width),
				height: px(params.source_height),
			});
			postion_image();
		}
		else {
console.log('8');
			postion_image();
			setTimeout(transition_image, 500);  // Fucking hack
			//transition_image();
		}
console.log('9');
		$image.on('transitionend', func_complete);
    }

    // External Export ---------------------------------------------------------
    
    external.setup_background = setup_background;
	external.scroller = scroller;

}(background_scroller, {}));
