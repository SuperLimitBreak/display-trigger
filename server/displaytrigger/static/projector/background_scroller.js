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
    };

	// Options -----------------------------------------------------------------

	options = _.extendOwn({
        thing: DEFAULT_THING,
	}, options);


	// Variables ---------------------------------------------------------------

	var css = {};

    // Functions ---------------------------------------------------------------

    function px_str(x, y, ratio) {
        if (!ratio) {ratio = 1;}
        return ""+(x*ratio)+"px "+(y*ratio)+"px";
    }
    
    function scroll_backgoround($element, params) {
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
        var ratio = $element.height / params.scource_screen_height;
        $element.css(_.extend(BACKGROUND_CSS, {
            background: "url("+params.background_url+")",
            backgroundSize: px_str(params.sourceWidth, parmas.sourceHeight, ratio),
            backgroundPosition: px_str(params.startX, parmas.startY, ratio),
        }));
    }
    
    // External Export ---------------------------------------------------------
    
    external.scroll_backgoround = scroll_backgoround;

}(background_scroller, {}));
