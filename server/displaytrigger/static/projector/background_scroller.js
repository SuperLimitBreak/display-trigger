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

	// TODO: move backgrounds and scrolls to 'options'
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
		/*
		_.extend({}, backgrounds.super_metroid_cut, {
			name: "Super Metroid: Morph ball",
			startX: 0,
			startY: 0,
			endX: -2700,
			duration: '10s',
		}),
		*/
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Outside",
			startX: 0,
			startY: -1563,
			endX: -752,
			duration: '5s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: First hall",
			startX: -767,
			startY: -1550,
			endX: -2304,
			duration: '5s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Bridge",
			startX: -2096,
			startY: -590,
			endX: -4510,
			duration: '5s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Drop",
			startX: -4260,
			startY: -590,
			endY: -1896,
			duration: '2s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Cave",
			startX: -4256,
			startY: -1724,
			endX: -5790,
			duration: '5s',
		}),
		_.extend({}, backgrounds.castelvania_1, {
			name: "Castelvania: Bridge 2",
			startX: -7610,
			startY: -1026,
			endX: -6106,
			duration: '5s',
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
	function on_image_load($image, f) {
		$image.on('load', f);
		if ($image[0].complete) {
		  $image.load();
		}	
	}
	
	function scroller($parent) {
		var _scrolls = _.clone(scrolls).reverse();
		function next() {
			$(this).off('transitionend');
			setup_background($parent, _scrolls.pop(), null, next);
		}
		next();
	}
	
	function setup_background($element, params, on_start, on_end) {
console.log(params);

		if (!on_start) {
			on_start = function() {};
		}
		if (!on_end) {
			on_end = function() {};
		}
		
		if (typeof(params.endX) != 'number') {
			params.endX = params.startX
		}
		if (typeof(params.endY) != 'number') {
			params.endY = params.startY
		}

		var ratio = $element.innerHeight() / params.source_screen_height;
		function px(value) {
			return ''+(value*ratio)+'px';
		}
		function px2(x, y) {
			return ''+px(x)+' '+px(y);
		}
		var $image = $element.find('img');
		var image_in_dom = ($image.attr('src') == params.background_url);

		if (!image_in_dom) {
			$element.empty();
			var $container = $('<div/>');
			$image = $('<img/>');
			$container.css(BACKGROUND_CSS);
			$container.append($image);
			$element.append($container);
		}

		function transition_image() {
			var translateX = params.endX - params.startX;
			var translateY = 0;
			if (params.endX < params.startX) {
				translateX += $element.innerWidth() / ratio;
			}
			if (params.endX > params.startX) {
				translateX += -$element.innerWidth() / ratio;
			}
			if (params.endY < params.startY) {
				translateY = (params.endY - params.startY) + $element.innerHeight() / ratio;
			}
			// todo: inverse y direction

			$image.css({
				transition: 'all '+params.duration+' linear',
				transform: 'translateX('+px(translateX)+') translateY('+px(translateY)+')',
			});
			$image.on('transitionend', on_end);
			on_start();
		}
		function postion_image() {
			var startX = params.startX;
			var startY = params.startY;
			if (params.endX > params.startX) {
				startX += $element.innerWidth() / ratio;
			}
			if (params.endY > params.startY) {
				startY += $element.innerHeight() / ratio;
			}
			$image.css({
				left: px(startX),
				top: px(startY),
				transition: '',
				transform: '',
			});
		}

		if (!image_in_dom) {
			on_image_load($image, transition_image);
			$image.attr('src', params.background_url);
			$image.css({
				position: 'absolute',
				width: px(params.source_width),
				height: px(params.source_height),
			});
			postion_image();
		}
		else {
			postion_image();
			// HACK: Have to wrap transition in arbatory timeout as the position must be set beforehand
			// As Chrome pipelines and optimises if the position and transition are set at the same time madness occours
			setTimeout(transition_image, 100);
		}
	}

	// External Export ---------------------------------------------------------
	
	external.setup_background = setup_background;
	external.scroller = scroller;

}(background_scroller, utils.functools.get('options.background_scroller')));
