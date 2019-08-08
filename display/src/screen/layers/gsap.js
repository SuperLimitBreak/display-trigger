import { isIterable } from "core-js";
import { TimelineMax } from 'gsap';
import {buildObjectFromMap, isObject} from 'calaldees_libs/es6/core';
import {timelineFromJson} from '../../utils/gsap';

require('../../styles/layers/image.scss');

const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location
const STRING_ELEMENT_IDENTIFIER = 'element::';

export class gsap {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            //documentCreateElement: ()=>document.createElement('img'),
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
        }, kwargs);
        this._elements = new Map();
        this._timeline = new TimelineMax();
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

        // Load elements
        for (let [name, obj] of Object.entries(msg.elements)) {
            const _element = document.createElement(obj.type || 'img');
            for (let [key, value] of Object.entries(obj)) {
                if (key in _element) {
                    if (key == 'src') {
                        _element[key] = this.mediaUrl + value;
                    } else {
                        _element[key] = value;
                    }
                }
            }
            this.element.appendChild(_element);
            this._elements.set(name, _element);
        }

        function _process(i) {
            if (typeof(i) === 'string') {
                // Identify Element - lookup
                if (i.startsWith(STRING_ELEMENT_IDENTIFIER)) {
                    return this._elements.get(i.replace(STRING_ELEMENT_IDENTIFIER, ''));
                }
                // Process vh and vw values
                let [__, number, unit] = i.match(/(\d+)([^\d\s]{1,3})(?:\s|$)?/) || [undefined, undefined, undefined];
                if (number == undefined) {return i;}
                number = Number(number);
                if (unit == 'vh') {number = number * this.element.container_element.clientHeight;}
                if (unit == 'vw') {number = number * this.element.container_element.clientWidth;}
                return number;
            }
            else if (isObject(i)) {
                for (const [key, value] of Object.entries(i)) {
                    i[key] = _process(value);
                }
            }
            else if (Array.isArray(i)) {
                i = i.map(_process);
            }
            return i;
        }

        // Build timeline
        this._timeline.clear();
        for (const timeline_args of msg.gsap_timeline) {
            const gsapMethod = timeline_args.shift();
            this._timeline[gsapMethod](...timeline_args.map(_process));
        }
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
