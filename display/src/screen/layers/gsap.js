import { isIterable } from "core-js";
import { TimelineMax } from 'gsap';
import {MapDefaultGet, isObject} from 'calaldees_libs/es6/core';
import {timelineFromJson} from '../../utils/gsap';

require('../../styles/layers/image.scss');
require('../../styles/layers/gsap.scss');

const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location
const STRING_IDENTIFIER_ELEMENT = 'element::';
const STRING_IDENTIFIER_TIMELINE = 'timeline::';

export class gsap {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            //documentCreateElement: ()=>document.createElement('img'),
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
        }, kwargs);
        this._elements = new Map();
        this._timelines = new Map();
        this._timelines_get = MapDefaultGet(this._timelines, () => new TimelineMax())
        this._parseDimension.bind(this);
    }

    _parseDimension(value) {
        if (typeof(value) !== 'string') {return value;}

        // Parse String
        let [__, number, unit] = value.match(/((?:[\d]+\.)?[\d]+)([^\d\s]{1,3})(?:\s|$)?/) || [undefined, undefined, undefined];
        if (number == undefined) {return value;}
        number = Number(number);
        if      (!unit) {}
        else if (unit == 'vh') {number = number * this.element.clientHeight;}
        else if (unit == 'vw') {number = number * this.element.clientWidth;}
        else {
            this.console.warn(`Unsupported unit ${unit} in ${value}`);
            return value;
        }

        // Modify with +/- image sizes
        const [_value, sign, element_name, element_attr] = value.match(/([+-])(\w+)\.(width|height)?/) || [undefined, undefined, undefined];
        if (element_name) {
            number += this._elements.get(element_name)[element_attr] * (sign=='-' ? -1 : 1);
        }

        return number;
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
                        value = this.mediaUrl + value;
                    }
                    if (['width', 'height', 'x', 'y'].indexOf(key)>=0) {
                        value = this._parseDimension(value);
                    }
                    _element[key] = value;
                }
            }
            this.element.appendChild(_element);
            this._elements.set(name, _element);
        }

        function _process(i) {
            if (typeof(i) === 'string') {
                // Identify Element - lookup
                if (i.startsWith(STRING_IDENTIFIER_ELEMENT)) {
                    return this._elements.get(i.replace(STRING_IDENTIFIER_ELEMENT, ''));
                }
                if (i.startsWith(STRING_IDENTIFIER_TIMELINE)) {
                    return this._timelines_get(i.replace(STRING_IDENTIFIER_TIMELINE, ''));
                }

                return this._parseDimension(i);;
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
        _process = _process.bind(this);

        // Build timeline
        for (const timeline_args of msg.gsap_timeline) {
            const timeline_name = timeline_args.shift();
            const gsapMethod = timeline_args.shift();
            this._timelines_get(timeline_name)[gsapMethod](...timeline_args.map(_process));
        }
    }

    empty() {
        for (const _timeline of this._timelines.values()) {
            _timeline.stop();
            _timeline.clear();
        }
        this._timelines.clear();
        //let i;
        //while (i = this._images.pop()) {
        //    const [_image_element, _timeline] = i;
        //for (const _image_element of this._images) {
        //while (i = this._images.pop()) {
        //    i.remove();
        //}
    }

}
gsap.className = 'gsap';
