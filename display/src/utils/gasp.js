import { TimelineMax } from 'gsap';

export function timelineFromJson(element, data) {
    const timeline = new TimelineMax();
    let _timeline = timeline;
    for (const [gaspMethod, duration, animationObject] of data) {
        _timeline = _timeline[gaspMethod](element, duration, animationObject);
    }
    return timeline;
}