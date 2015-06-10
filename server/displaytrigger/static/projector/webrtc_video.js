var webrtc_video = {};


// Display ---------------------------------------------------------------------

(function(external, options){
	options = _.extend({
		selector_holder: '#overlay',
	}, options);
	
    MediaStreamTrack.getSources(function (media_sources) {
        _.each(_.filter(media_sources, function(media_source){return media_source.kind == 'video'}), function(media_source, index, list){
            var constraints = {
                video: {
                    optional: [{
                        sourceId: media_source.id
                    }],
                }
            };
        
            console.log(constraints);
        
            // invoke getUserMedia to capture this device
            /*
            navigator.webkitGetUserMedia(
                constraints,
                function (stream) {
                    console.log(stream.id, stream);
                },
                function () {
                    console.log('its fucked');
                }
            );
            */
        });
    });

	//external.display = display;
}(
	webrtc_video,{
	}
));
