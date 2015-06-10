navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var webrtc_video = {};


// Display ---------------------------------------------------------------------

(function(external, options){
	options = _.extend({
		selector_holder: '#offscreen_video_feeds',
	}, options);
	
	var streams = [];
	
	function errorCallback(error) {
		console.log('error: ', error);
	}
	
	function assignStreamToVideoElement(stream, video_element) {
		if (window.URL) {
			video_element.src = window.URL.createObjectURL(stream);
		} else {
			video_element.src = stream;
		}
	}
	
	function getAllVideoDevices(openStreamSuccessCallback, openStreamErrorCallback) {
		MediaStreamTrack.getSources(function (media_sources) {
			_.each(_.filter(media_sources, function(media_source){return media_source.kind == 'video'}), function(media_source, index, list){
				var constraints = {
					audio: false,
					video: {
						optional: [{
							sourceId: media_source.id
						}],
					},
				};
				navigator.getUserMedia(constraints, openStreamSuccessCallback, openStreamErrorCallback);
			});
			
		});
	}
	
	function openStream(stream) {
		streams.push(stream);
		var $video = $('<video/>');
		assignStreamToVideoElement(stream, $video[0]);
		$(options.selector_holder).append($video);
	}

	function initVideoDevices() {
		getAllVideoDevices(openStream, errorCallback);
	}

	external.initVideoDevices = initVideoDevices;
}(
	webrtc_video,{
	}
));
