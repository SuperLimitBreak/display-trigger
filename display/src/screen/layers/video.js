import * as PubSub from 'pubsub-js';
const Immutable = require('immutable');

import {timelineFromJson} from '../../utils/gsap';

require('../../styles/layers/video.scss');

const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location


export class video {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('video'),
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
            parentSubscriptionName: 'UNDEFINED_VIDEO',
            currentTimeSyncThreshold: 0.2,
            eventHandlers: {
                ended: () => {
                    PubSub.publish(this.parentSubscriptionName, {
                        func: 'fade.fade',
                    });
                },
            },
        }, kwargs);
        this.eventHandlers = Immutable.fromJS(this.eventHandlers);
        this._videoElement = undefined;
        this._timeline = undefined;
    }

    get video() {
        if (!this._videoElement) {
            this._videoElement = this.documentCreateElement();
            for (const [eventName, eventHandler] of this.eventHandlers.entries()) {
                this._videoElement.addEventListener(eventName, eventHandler);
            }
            this.element.appendChild(this._videoElement);
        }
        return this._videoElement;
    }

    // Public ----------------------------------------------------

    //precache(msg) {return this.load(msg);}  // Alias for backwards compatibility TODO: Remove?
    //cache(msg) {return this.load(msg);}  // Alias for backwards compatibility TODO: Remove?
    load(msg) {
        this._video(
            msg.src,
            Object.assign(msg, {play: false})
        );
    }

    //show(msg) {return this.start(msg);}  // TODO: remove alias?
    //play(msg) {return this.start(msg);}  // TODO: remove alias?
    start(msg) {
        this._video(
            this.mediaUrl + msg.src,
            Object.assign(msg, {play: true})
        );
        this.video.style = msg.style || `
            width: 100%;
            height: 100%;
        `;
        if (msg.gsap_animation) {
            this._timeline = timelineFromJson(this.element, this.image, msg.gsap_animation);
        }
    }

    pause(msg) {return this.stop(msg);}  // TODO: remove alias?
    stop(msg) {
        this.video.pause();
    }

    //clear() {return this.empty();}  // TODO: remove alias?
    empty() {
        if (this._timeline) {
            this._timeline.stop();
        }
        if (this._videoElement) {
            this._videoElement.remove();
            this._videoElement = undefined;
        }
    }

    // Private ------------------------------------------------------

    _video(src, options) {
        if (!src) {this.empty(); return;}
        const video = this.video;
        options = Object.assign({
            'play': true,
            'volume': 1.0,
            'loop': false,
            'currentTime': 0,
        }, options);
        options.currentTime = options.position || options.currentTime;  // normalize input from multiple fieldnames
        options.play = options.playing == undefined ? options.play : options.playing;

        video.loop = options.loop;
        video.volume = options.volume;
        video.controls = false;
        video.preload = 'auto';
        video.autoplay = options.play;

        // src
        if (video.currentSrc.indexOf(src) > -1) {
            if (!options.play) {  // if pre-cacheing/loading, ensure video is stopped
                video.pause();
            }
        }
        else {
            this.console.log('video loading', src);
            video.src = src;
            video.load();
        }

        // currentTime sync
        const currentTimeDifference = Math.abs(video.currentTime - options.currentTime);
        if (currentTimeDifference > this.currentTimeSyncThreshold || !options.play) {
            this.console.info('video catchup seek', video.currentTime, options.currentTime, currentTimeDifference);
            video.currentTime = options.currentTime;
        }

        if (options.play) {
            video.play();
        }
    }
}
video.className = 'video';