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
            source_screen_height: 168,
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
			source_screen_height: 240,
            source_width: 16896,
            source_height: 14336,			
		},
		super_metroid_cut: {
			background_url: '/ext/SuperMetroidMapZebes_cut.png',
			source_screen_height: 240,
            source_width: 3074,
            source_height: 240,
		}
	}
	
	var scrolls = [
		_.extend({}, backgrounds.super_metroid_cut, {
			name: "Super Metroid: Morph ball",
			startX: 0,
            startY: 0,
			endX: -2700,
            duration: '10s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Outside",
            startX: 0,
            startY: -1563,
			endX: -540,
			duration: '20s',
        }),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: First hall",
            startX: -767,
            startY: -1550,
			endX: -2119,
			duration: '20s',
        }),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Cave",
            startX: -4256,
            startY: -1724,
			endX: -5254,
			duration: '20s',
        }),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Bridge",
            startX: -2096,
            startY: -590,
			endX: -4090,
			duration: '20s',
        }),
		/*
		_.extend({}, backgrounds.castelvania_sotn, {
            startX: -528,
            startY: -8968,
			endX: 2000,
            duration: '30s',
		}),
		_.extend({}, backgrounds.super_metroid, {
            startX: -4100,
            startY: -7200,
			endX: -6916,
            duration: '10s',
		}),
		*/
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
			$(this).off('transitionend');
			setup_background($parent, _scrolls.pop(), next);
		}
		next();
	}
    
    function setup_background($element, params, func_complete) {
console.log(params);
console.log("1");
		if (!func_complete) {
			func_complete = function() {};
		}		
		
		if (typeof(params.endX) != 'number') {
			params.endX = params.startX
		}
		if (typeof(params.endY) != 'number') {
			params.endY = params.startY
		}
console.log("2");
        var ratio = $element.innerHeight() / params.source_screen_height;
		function px(value) {
			return ''+(value*ratio)+'px';
		}
		function px2(x, y) {
			return ''+px(x)+' '+px(y);
		}
		var $image = $element.find('img');
		var image_in_dom = ($image.attr('src') == params.background_url);
console.log("3");
		if (!image_in_dom) {
console.log("3a");
			$element.empty();
			var $container = $('<div/>');
			$image = $('<img/>');
			$container.css(BACKGROUND_CSS);
			$container.append($image);
			$element.append($container);
		}
console.log("4");
		function transition_image() {
console.log("4a");
			var targetX = params.endX - params.startX;
			var targetY = params.endY - params.startY;
			console.log("target1", targetX, targetY);
			console.log("target-", $element.innerWidth(), $element.innerHeight() ,ratio);
			if (params.endX < params.startX) {
				targetX += $element.innerWidth() / -ratio;
			}
			if (params.endY < params.startY) {
				targetY += $element.innerHeight() / -ratio;
			}
			console.log("target2", targetX, targetY);
			$image.css({
				transition: 'all '+params.duration+' linear',
				transform: 'translateX('+px(targetX)+') translateY('+px(targetY)+')',
			});
			$image.on('transitionend', func_complete);
		}
		function postion_image() {
console.log("4b");
			$image.css({
				top: px(params.startY),
				left: px(params.startX),
				transition: '',
				transform: '',
			});
		}
console.log("5");
		if (!image_in_dom) {
console.log("5a");
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
console.log("5c");
			postion_image();
			setTimeout(transition_image, 200);  // Fucking hack
			//transition_image();
		}
console.log("6");
    }

    // External Export ---------------------------------------------------------
    
    external.setup_background = setup_background;
	external.scroller = scroller;

}(background_scroller, {}));
