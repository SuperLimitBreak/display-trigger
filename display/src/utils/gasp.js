import { TimelineMax } from 'gsap';

export function timeline_from_json(element, data) {
    let timeline = new TimelineMax();
    let _timeline = timeline;
    for (let [gasp_method, duration, animation_object] of data) {
        _timeline = _timeline[gasp_method](element, duration, animation_object);
    }
    return timeline;
}