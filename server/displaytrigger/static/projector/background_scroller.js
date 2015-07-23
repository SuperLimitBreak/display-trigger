var background_scroller = {};


(function(external, options) {

	// Options -----------------------------------------------------------------

	options = _.extend({
		selector_holder: '#screen',
		backgrounds: {},
		scrolls: {},
	}, options);


	// Utils -------------------------------------------------------------------

	// Cache load fix - http://mikefowler.me/2014/04/22/cached-images-load-event/
	function on_image_load($image, f) {
		$image.on('load', f);
		if ($image[0].complete) {
			$image.load();
		}
	}

	// Scroll Sequence  --------------------------------------------------------
	
	function scroll_sequence(data) {
		var name = data.name || data;
		var _scrolls = _.map(options.scrolls[name], function(scroll_item_data){
			var background_item_data = options.backgrounds[scroll_item_data.background] || {};
			return _.extend({}, background_item_data, scroll_item_data);
		}).reverse();
		function next() {
			$(this).off('transitionend');  // WTF is this for?
			scroll_item(_scrolls.pop(), null, next);
		}
		next();
	}

	// Scroll Item  ------------------------------------------------------------
	
	function scroll_item(scroll_params, on_start, on_end, _options) {
		_options = _.extend({}, options, _options);
		var $parent_container = $(_options.selector_holder);
		
		if (!scroll_params.background_url) {
			console.error('scroll_item unable to process because missing background_url');
			return;
		}
		
		if (!on_start) {
			on_start = function() {};
		}
		if (!on_end) {
			on_end = function() {};
		}
		
		if (typeof(scroll_params.endX) != 'number') {
			scroll_params.endX = scroll_params.startX
		}
		if (typeof(scroll_params.endY) != 'number') {
			scroll_params.endY = scroll_params.startY
		}

		var ratio = $parent_container.innerHeight() / scroll_params.source_screen_height;
		function px(value) {
			return ''+(value*ratio)+'px';
		}
		function px2(x, y) {
			return ''+px(x)+' '+px(y);
		}
		var $image = $parent_container.find('img');
		var is_image_in_dom = ($image.attr('src') == scroll_params.background_url);

		if (!is_image_in_dom) {
			$parent_container.empty();
			var $container = $('<div/>');
			$image = $('<img/>');
			//$container.css(BACKGROUND_CSS);
			$container.addClass('background_scroller');
			$container.append($image);
			$parent_container.append($container);
		}
		function transition_image() {
			var translateX = scroll_params.endX - scroll_params.startX;
			var translateY = 0;
			if (scroll_params.endX < scroll_params.startX) {
				translateX += $parent_container.innerWidth() / ratio;
			}
			if (scroll_params.endX > scroll_params.startX) {
				translateX += -$parent_container.innerWidth() / ratio;
			}
			if (scroll_params.endY < scroll_params.startY) {
				translateY = (scroll_params.endY - scroll_params.startY) + $parent_container.innerHeight() / ratio;
			}
			// todo: inverse y direction
			$image.css({
				transition: 'all '+scroll_params.duration+' linear',
				transform: 'translateX('+px(translateX)+') translateY('+px(translateY)+')',
			});
			$image.on('transitionend', on_end);
			on_start();
		}
		function postion_image() {
			var startX = scroll_params.startX;
			var startY = scroll_params.startY;
			if (scroll_params.endX > scroll_params.startX) {
				startX += $parent_container.innerWidth() / ratio;
			}
			if (scroll_params.endY > scroll_params.startY) {
				startY += $parent_container.innerHeight() / ratio;
			}
			$image.css({
				left: px(startX),
				top: px(startY),
				transition: '',
				transform: '',
			});
		}
		if (!is_image_in_dom) {
			on_image_load($image, transition_image);
			$image.attr('src', scroll_params.background_url);
			$image.css({
				position: 'absolute',
				width: px(scroll_params.source_width),
				height: px(scroll_params.source_height),
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
	
	_.extend(external, {
		scroll_item: scroll_item,
		scroll_sequence: scroll_sequence,
	});

}(background_scroller, utils.functools.get('options.background_scroller')));
