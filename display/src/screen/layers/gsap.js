import { isIterable } from "core-js";
import { TimelineMax } from 'gsap';
import {MapDefaultGet, isObject, setIsEqual} from 'calaldees_libs/es6/core';
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
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
            currentTimeSyncThreshold: 0.40,  // gsap is slower to respond than the video element
        }, kwargs);
        this._elements = new Map();
        this._timelines = new Map();
        this._timelines_get = MapDefaultGet(this._timelines, () => new TimelineMax())
        this._parseDimension = this._parseDimension.bind(this);
        this._recursively_replace_string_object_references = this._recursively_replace_string_object_references.bind(this);
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

    _recursively_replace_string_object_references(i) {
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
                i[key] = this._recursively_replace_string_object_references(value);
            }
        }
        else if (Array.isArray(i)) {
            i = i.map(this._recursively_replace_string_object_references);
        }
        return i;
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

    pause(msg) {return this.stop(msg);}  // TODO: remove alias?
    stop(msg) {
        for (const _timeline of this._timelines.values()) {
            _timeline.paused(true);
            //_timeline.totalTime(0);
        }
    }

    start(msg) {
        msg.playing = typeof(msg.playing) === "boolean" ? msg.playing : true;

        // Has Timeline Changed? Reset!
        const elements_msg = new Set(Object.keys(msg.elements));
        const elements_existing = new Set(this._elements.keys());
        const timelines_msg = new Set(msg.gsap_timeline.reduce((acc, i) => {acc.push(i[0]); return acc;}, []));
        const timelines_existing = new Set(this._timelines.keys());
        const elements_have_changed = !setIsEqual(elements_msg, elements_existing);
        const timelines_have_changed = !setIsEqual(timelines_msg, timelines_existing);
        if (elements_have_changed || timelines_have_changed) {
            this.console.debug('timelines/elements changed. clearing gsap container');
            this.empty();
        }

        // Load elements
        if (this._elements.size == 0) {
            for (let [name, obj] of Object.entries(msg.elements)) {
                if (this._elements.has(name)) {continue;}
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
        }

        // Build Timeline
        if (this._timelines.size == 0) {
            for (const timeline_args of msg.gsap_timeline) {
                const timeline_name = timeline_args.shift();
                const gsapMethod = timeline_args.shift();
                this._timelines_get(timeline_name)[gsapMethod](...timeline_args.map(this._recursively_replace_string_object_references));
            }
            for (const _timeline of this._timelines.values()) {
                _timeline.paused(!msg.playing);
            }
        }

        // currentTime sync
        if (msg.position) {
            msg.position = Number(msg.position);
            for (const _timeline of this._timelines.values()) {
                msg.position = Math.min(msg.position, _timeline.totalDuration());
                const currentTimeDifference = Math.abs(_timeline.totalTime() - msg.position);
                if (currentTimeDifference > this.currentTimeSyncThreshold || !msg.playing) {
                    this.console.info('gsap catchup seek', _timeline.totalTime(), msg.position, currentTimeDifference);
                    _timeline.totalTime(msg.position);
                }
            }
        }

    }

    empty() {
        for (const _timeline of this._timelines.values()) {
            _timeline.clear();
        }
        this._timelines.clear();

        for (const _element of this._elements.values()) {
            _element.remove();
        }
        this._elements.clear();
    }

}
gsap.className = 'gsap';
