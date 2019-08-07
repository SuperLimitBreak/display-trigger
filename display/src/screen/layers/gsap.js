import { isIterable } from "core-js";
import { TimelineMax } from 'gsap';
import {timelineFromJson} from '../../utils/gsap';

require('../../styles/layers/image.scss');

const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location


export class gsap {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('img'),
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
        }, kwargs);
        this._images = new Map();
        this._timeline = undefined;
    }

    cache(msg) {
        if (typeof(msg.src) == 'string') {msg.src = [msg.src];}
        if (isIterable(msg.src)) {
            for (let src of msg.src) {
                const i = new Image();
                i.src = src;
            }
        }
    }

    start(msg) {
        //this.empty();

        // Load images
        for (let [name, src] of Object.entries(msg.images)) {
            const _image_element = this.documentCreateElement();
            _image_element.src = this.mediaUrl + msg.src;
            this.element.appendChild(_image_element);
            this._images.set(name, _image_element);
        }

        // Build timeline
        if (!this._timeline) {this._timeline = new TimelineMax();}
        let _timeline = this._timeline;
        for (const [gsapMethod, target_element_name, duration, animationObject] of msg.gsap_timeline) {
            _timeline = _timeline[gsapMethod](this._images.get(target_element_name), duration, animationObject);
        }
        this._timeline = _timeline;

    }

    empty() {
        //let i;
        //while (i = this._images.pop()) {
        //    const [_image_element, _timeline] = i;
        //for (const _image_element of this._images) {
        //while (i = this._images.pop()) {
        //    i.remove();
        //}
        this._timeline.stop();
        this._timeline = undefined;
    }

}
gsap.className = 'gsap';
