import {static_url} from '../../utils/utils';


export class video {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('video'),
            console: console,
        }, kwargs);
        this._video_element_element = undefined;
    }
    
    get video() {
        if (!this._video_element) {
            this._video_element = this.documentCreateElement();
            this.element.appendChild(this._video_element);
        }
        return this._video_element;
    }

    // Public ----------------------------------------------------

    precache(msg) {return this.load(msg);}  // Alias for backwards compatibility TODO: Remove?
    load(msg) {
        this.onMessage(
			msg.src,
			Object.assign(msg, {play: false}),
        );
    }

    play(msg) {return this.start(msg);}  // TODO: remove alias?
    start(msg) {
        this.onMessage(
			msg.src,
			Object.assign(msg, {play: true}),
        );
    }

    clear(msg) {return this.empty(msg);}  // TODO: remove alias?
    empty(msg) {
        if (this._video_element) {
            this._video_element.remove();
            this._video_element = undefined;
        }
    }

    // Private ------------------------------------------------------

    onMessage(src, options, event_listeners) {
        if (!src) {this.empty(); return;}
        src = static_url(src);
        const video = this.video;
        options = Object.assign({
			'play': true,
			'volume': 1.0,
			'loop': false,
            'currentTime': 0,
        }, options);

        video.loop = options.loop;
		video.volume = options.volume;
		video.controls = false;
		video.preload = 'auto';
		video.autoplay = options.play;
		if (video.currentSrc.indexOf(src) > -1) {
			this.console.log('video already loaded');
			video.pause();
		}
		else {
			this.console.log('video loading');
			video.src = src;
			video.load();
		}
		video.currentTime = options.currentTime;
		if (options.play) {
			video.play();
		}
    }
}
video.className = 'video';