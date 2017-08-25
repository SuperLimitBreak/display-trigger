import * as PubSub from 'pubsub-js';
const Immutable = require('immutable');

import {static_url} from '../../utils/utils';
import {timeline_from_json} from '../../utils/gasp';

require('../../styles/layers/video.scss');

export class video {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('video'),
            console: console,
            parentSubscriptionName: 'UNDEFINED_VIDEO',
            currentTimeSyncThreshold: 0.1,
            eventHandlers: {
                ended: ()=>{PubSub.publish(this.parentSubscriptionName, {
                    func: 'fade.fade',
                })},
            }
        }, kwargs);
        this.eventHandlers = Immutable.fromJS(this.eventHandlers);
        this._video_element = undefined;
        this._timeline = undefined;
    }

    get video() {
        if (!this._video_element) {
            this._video_element = this.documentCreateElement();
            for (let [eventName, eventHandler] of this.eventHandlers.entries()) {
                this._video_element.addEventListener(eventName, eventHandler);
            }
            this.element.appendChild(this._video_element);
        }
        return this._video_element;
    }

    // Public ----------------------------------------------------

    precache(msg) {return this.load(msg);}  // Alias for backwards compatibility TODO: Remove?
    cache(msg) {return this.load(msg);}  // Alias for backwards compatibility TODO: Remove?
    load(msg) {
        this._video(
            msg.src,
            Object.assign(msg, {play: false})
        );
    }

    show(msg) {return this.start(msg);}  // TODO: remove alias?
    play(msg) {return this.start(msg);}  // TODO: remove alias?
    start(msg) {
        this._video(
            static_url(msg.src),
            Object.assign(msg, {play: true})
        );
        this.video.style = msg.style || `
            width: 100%;
            height: 100%;
        `;
        if (msg.gasp_animation) {
            this._timeline = timeline_from_json(this.image, msg.gasp_animation);
        }
    }

    clear() {return this.empty();}  // TODO: remove alias?
    empty() {
        if (this._timeline) {
            this._timeline.stop();
        }
        if (this._video_element) {
            this._video_element.remove();
            this._video_element = undefined;
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
        if (currentTimeDifference > this.currentTimeSyncThreshold) {
            this.console.info('video catchup seek', options.currentTime);
            video.currentTime = options.currentTime;
        }

        if (options.play) {
            video.play();
        }
    }
}
video.className = 'video';