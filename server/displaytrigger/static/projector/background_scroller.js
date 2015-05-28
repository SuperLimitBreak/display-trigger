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

    // Functions ---------------------------------------------------------------

	function scroller($parent, params) {
		
	}
    
    function setup_backgoround($element, params) {
		params = {
            background_url: '/ext/castlevaniafullgamemapempty.PNG',
            source_screen_height: 184,
            source_width: 9928,
            source_height: 1908,
            startX: 0,
            startY: -1563,
			duration: 2000,
			endX: 2000,
			endY: -1563,
        }
        /*
            background_url: 'sotn-castle.png',
            scource_screen_height: 206,
            source_width: 15648,
            source_height: 12000,
            startX: -528,
            startY: -8968,
            endX: 0,
            endY: 0,
            duration: 3000,
         */
		
		
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
		
		$image.attr('src', params.background_url);
		$image.css({
			position: 'absolute',
			top: px(params.startY),
			left: px(params.startX),
			width: px(params.source_width),
			height: px(params.source_height),
		});
		/*
        $element.css(_.extend(BACKGROUND_CSS, {
            background: "url("+params.background_url+")",
            backgroundSize: px_str(params.source_width, params.source_height, ratio),
            backgroundPosition: px_str(params.startX, params.startY, ratio),
        }));
        */
    }
    
	function scroll_background($element, params) {
		$element.find('img').css({
			transition: 'all '+params.duration+' linear',
			transform: 'translateX('+px(params.endX)+') translateY('+px(params.endY)+')',
		});
	}
	
    // External Export ---------------------------------------------------------
    
    external.scroll_backgoround = scroll_backgoround;
	external.scroll = scroll;

}(background_scroller, {}));
