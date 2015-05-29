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
            scource_screen_height: 206,
            source_width: 15648,
            source_height: 12000,
		}
	}
	
	var scrolls = [
		_.extend(backgrounds.castelvania_1, {
            startX: 0,
            startY: -1563,
			endX: 2000,
			duration: '5000ms',
        }),
		_.extend(backgrounds.castelvania_sotn, {
            startX: -528,
            startY: -8968,
            duration: '5000ms',
		}),
	]
	
    // Functions ---------------------------------------------------------------

	function scroller($parent) {
		var _scrolls = _.clone(scrolls);
		console.log(_scrolls);
		function next() {
			setup_backgoround($parent, _scrolls.pop(), next);
		}
		next();
	}
    
    function setup_backgoround($element, params, func_complete) {
		console.log(params);
		if (!func_complete) {
			func_complete = function() {};
		}		
		
		if (typeof(params.endX) == 'undefined') {
			params.endY = params.startX
		}
		if (typeof(params.endY) == 'undefined') {
			params.endY = params.startY
		}
		
		$element.empty();
		var $container = $('<div/>');
		var $image = $('<img/>');
		$container.css(BACKGROUND_CSS);
		$container.append($image);
		$element.append($container);

        var ratio = $element.innerHeight() / params.source_screen_height;
		function px(value) {
			return ''+(value*ratio)+'px';
		}
		function px2(x, y) {
			return ''+px(x)+' '+px(y);
		}

		$image.on('load', function () {
			$image.css({
				transition: 'all '+params.duration+' linear',
				transform: 'translateX('+px(params.startX-params.endX)+') translateY('+px(params.startY-params.endY)+')',
			});
		});

		$image.on('transitionend', func_complete);
		
		$image.attr('src', params.background_url);
		$image.css({
			position: 'absolute',
			top: px(params.startY),
			left: px(params.startX),
			width: px(params.source_width),
			height: px(params.source_height),
		});
    }

    // External Export ---------------------------------------------------------
    
    external.setup_backgoround = setup_backgoround;
	external.scroller = scroller;

}(background_scroller, {}));
