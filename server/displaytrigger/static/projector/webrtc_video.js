navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var webrtc_video = {};

// http://stackoverflow.com/questions/12160174/always-accept-webrtc-webcam-request
//  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --use-fake-ui-for-media-stream

// Display ---------------------------------------------------------------------

(function(external, options){
	options = _.extend({
		selector_holder: '#offscreen_video_feeds',
		auto_init_devices: false,
		video_source: {
			minFrameRate: 30,
		},
		canvas: {
			width: 320,
			height: 200,
		}
	}, options);
	
	var videos = [];
	
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
						//width: {min: 640, ideal: 1024, max: 1280},
						//height: {min: 480, ideal: 720, max: 768},
						mandatory: {
							//width: 1280,
							//framerate: 60,
							minWidth: options.canvas.width, minHeight: options.canvas.height,
							maxWidth: options.canvas.width, maxHeight: options.canvas.height,
							//framerate: 60,
							minFrameRate: options.video_source.minFrameRate,
						},
						optional: [{
							sourceId: media_source.id
						}],
					},
				};
				navigator.getUserMedia(constraints, openStreamSuccessCallback, openStreamErrorCallback);
				/*
				 *
chrome://webrtc-internals/
http://www.maspick.co.il/Ddd/chromium/src/chrome/test/data/webrtc/manual/constraints.html
https://webrtchacks.com/how-to-figure-out-webrtc-camera-resolutions/
https://w3c.github.io/mediacapture-main/getusermedia.html#dictionary-mediatracksupportedconstraints-members

width: {min: 320, ideal: 1280, max: 1920},
    height: {min: 240, ideal: 720, max: 1080},
    framerate: 30,     // Shorthand for ideal.
    // facingMode: "environment" would be optional.
    facingMode: {exact: "environment"}
    
{video: {
  width: {min: 640, ideal: 1280, max: 1920},
  height: {min: 480, ideal: 720, max: 1080},
}}


var supports = navigator.mediaDevices.getSupportedConstraints();
if(!supports["deviceId"] || !supports["volume"]) {
  // Treat like an error.
}
var constraints = {
  advanced: [{
      deviceId: "64815-wi3c89-1839dk-x82-392aa"
    }, {
      volume: 0.5
    }]
};


var supports = navigator.mediaDevices.getSupportedConstraints();
if(!supports["deviceId"]) {
  // Treat like an error.
}
var constraints = {
  deviceId: {exact: "20983-20o198-109283-098-09812"},
  advanced: [{
      width: {
        min: 800,
        max: 1200
      }
    }, {
      height: {
        min: 600
      }
    }]
};

var supports = navigator.mediaDevices.getSupportedConstraints();
if(!supports["facingMode"]) {
  // Treat like an error.
}
var constraints = {
  width: {
    min: 640
  },
  height: {
    min: 480
  },
  advanced: [{
      width: 650
    }, {
      width: {
        min: 650
      }
    }, {
      frameRate: 60
    }, {
      width: {
        max: 800
      }
    }, {
      facingMode: "user"
    }]
};
				 **/
			});
			
		});
	}
	
	function openNewStream(stream) {
		var $video = $('<video/>');
		$video.attr('autoplay', true);  // http://stackoverflow.com/questions/20822833/only-one-frame-displayed-webrtc-stream
		var video = $video[0];
		assignStreamToVideoElement(stream, video);
		
		var offscreenCanvas = document.createElement('canvas');
		offscreenCanvas.width = options.canvas.width;
		offscreenCanvas.height = options.canvas.height;
		var offscreenContext = offscreenCanvas.getContext('2d');
		
		var $canvas = $('<canvas/>');
		var canvas = $canvas[0];
		canvas.width = options.canvas.width;
		canvas.height = options.canvas.height;
		var context = canvas.getContext('2d');
		
		videos.push({
			id: stream.id,
			$video: $video,
			video: video,
			stream: stream,
			canvas: canvas,
			context: context,
			offscreenCanvas: offscreenCanvas,
			offscreenContext: offscreenContext,
		});
		
		var $container = $(options.selector_holder);
		$container.append($video);
		$container.append($canvas);
		
		function update_video_canvas() {
			if (video.paused || video.ended) {return};

			offscreenContext.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
			//var idata = offscreenContext.getImageData(0,0,w,h);
			//context.putImageData(idata,0,0);
			
			//DitherJSInternals.dither(offscreenContext, "ordered", DitherJSInternals.palettes.C64, 1, context);
			//context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
			
			//setTimeout(update_video_canvas, 1);// Math.floor(1000/options.fps)
		};
		$video.on('play', update_video_canvas);
	}

	function initVideoDevices() {
		getAllVideoDevices(openNewStream, errorCallback);
	};
	
	function stopVideoDevices() {
		$(options.selector_holder).empty();
		_.each(videos, function(video, index, list){
			video.stream.stop();
		});
		videos = [];
	};

	_.extend(external, {
		initVideoDevices: initVideoDevices,
		stopVideoDevices: stopVideoDevices,
		videos: videos,
	});

	if (options.auto_init_devices) {
		initVideoDevices();
	}
}(webrtc_video, utils.functools.get('options.webrtc_video')));
