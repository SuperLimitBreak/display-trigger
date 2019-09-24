import { TimelineMax } from 'gsap';
import { MapDefaultGet, isObject, isSetEqual, hasIterationProtocol } from 'calaldees_libs/es6/core';
//import {timelineFromJson} from '../../utils/gsap';
import { bindRecursivelyReplaceStringsWithObjectReferences, parseDimension } from '../../utils/StringTools';

require('../../styles/layers/image.scss');
require('../../styles/layers/gsap.scss');

const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location


export class gsap {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
            currentTimeLagThreshold: 0.2,
        }, kwargs);

        this._elements = new Map();
        this._timelines = new Map();
        this._timelines_get = MapDefaultGet(this._timelines, () => new TimelineMax())

        this._stringMapLookup = new Map([
            ['element::', this._elements],
            ['timeline::', this._timelines],
        ]);

        this.parseDimension = (value) => parseDimension(value, this.element, this._stringMapLookup);
        this.funcReplaceStringReferences = bindRecursivelyReplaceStringsWithObjectReferences(
            this._stringMapLookup,
            this.element,
        );
    }

    cache(msg) {
        if (typeof(msg.src) == 'string') {msg.src = [msg.src];}
        if (hasIterationProtocol(msg.src)) {
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
        const elements_have_changed = !isSetEqual(elements_msg, elements_existing);
        const timelines_have_changed = !isSetEqual(timelines_msg, timelines_existing);
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
                        if (key == 'src' && typeof(value) === "string" && !value.match(/^http|^\//)) {
                            value = this.mediaUrl + value;
                        }
                        if (['width', 'height', 'x', 'y'].indexOf(key)>=0) {
                            value = this.parseDimension(value);
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
                this._timelines_get(timeline_name)[gsapMethod](...timeline_args.map(this.funcReplaceStringReferences));
            }
            for (const _timeline of this._timelines.values()) {
                if (msg.playing) {
                    // TimeLineMax will play automatically after a short duration if .play() is not called
                    // If we explicitly call .play(), we may prevent needing a large currentTimeLagThreshold
                    _timeline.play();
                } else {
                    _timeline.paused(true);
                }
            }
        }

        // currentTime sync
        if (msg.position) {
            const position = Number(msg.position);
            for (const _timeline of this._timelines.values()) {
                const _position_target = Math.min(position, _timeline.totalDuration());
                const _position_current = _timeline.totalTime() || 0;
                const currentTimeLag = Math.abs(_position_target - _position_current);
                if (
                    !msg.playing  // always seek when paused
                ) {
                    _timeline.totalTime(_position_target);
                } else if (
                    currentTimeLag > this.currentTimeLagThreshold  // currently behind too far - so requires catchup
                    //||
                    //currentTimeLag < 0  // currently ahead - should never happen - always snap back
                ) {
                    this.console.info(`gsap catchup seek - current:${_position_current} target:${_position_target} diff:${currentTimeLag}`);
                    _timeline.play(_position_target);
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
