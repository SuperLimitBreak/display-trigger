import { TimelineMax } from 'gsap';


export function timelineFromJson(container_element, target_element, data) {
    //return data.reduce((_timeline, [gsapMethod, duration, animationObject]) => _timeline[gsapMethod](element, duration, animationObject), new TimelineMax())
    const timeline = new TimelineMax();
    data = _preProcessUnits(container_element, data);
    let _timeline = timeline;
    for (const [gsapMethod, duration, animationObject] of data) {
        _timeline = _timeline[gsapMethod](target_element, duration, animationObject);
    }
    return timeline;
}


function _normalizeUnit(value, _referencePx=1) {
    if (typeof(value) != 'string') {return value;}
    let [__, number, unit] = value.match(/(\d+)([^\d]{1,3})$/) || [undefined, undefined, undefined];
    if (number == undefined) {return value;}
    number = Number(number);
    if (unit == '%') {number = (number/100) * _referencePx;}
    if (unit == 'vh' || unit == 'vw') {number = number * _referencePx;}
    if (unit == 'em') {console.warn('em unsupported');}
    return number;
}


function _preProcessUnits(container_element, data) {
    // pre-process '%' of screen values as gsap does not support this
    return data.map(([gsapMethod, duration, animationObject]) => {
        if (gsapMethod == 'to') {
            for (const [key, value] of Object.entries(animationObject)) {
                const _referencePx = (
                    key.toLocaleLowerCase() == 'x' ?  // TODO: check for a multitude of different fields
                        container_element.clientWidth : container_element.clientHeight
                );
                animationObject[key] = _normalizeUnit(value, _referencePx);
            }
        }
        return [gsapMethod, duration, animationObject];
    });
}
