import { TimelineMax } from 'gsap';


const ELEMENT_IDENTIFIER = '-target';


export function timelineFromJson(container_element, target_element, data) {
    //return data.reduce((_timeline, [gsapMethod, duration, animationObject]) => _timeline[gsapMethod](element, duration, animationObject), new TimelineMax())
    const timeline = new TimelineMax();
    data = _preProcessUnits(container_element, target_element, data);
    let _timeline = timeline;
    for (const [gsapMethod, duration, animationObject] of data) {
        _timeline = _timeline[gsapMethod](target_element, duration, animationObject);
    }
    return timeline;
}


function _normalizeUnit(value, _container_px=1) {
    if (typeof(value) != 'string') {return value;}
    let [__, number, unit] = value.match(/(\d+)([^\d\s]{1,3})(?:\s|$)?/) || [undefined, undefined, undefined];
    if (number == undefined) {return value;}
    number = Number(number);
    if (unit == '%') {number = (number/100) * _container_px;}
    if (unit == 'vh' || unit == 'vw') {number = number * _container_px;}
    if (unit == 'em') {console.warn('em unsupported');}
    return number;
}


function _preProcessUnits(container_element, target_element, data) {
    // pre-process '%' of screen values as gsap does not support this
    return data.map(([gsapMethod, duration, animationObject]) => {
        if (gsapMethod == 'to') {
            for (const [key, value] of Object.entries(animationObject)) {
                const _container_px = (
                    key.toLocaleLowerCase() == 'x' ?  // TODO: check for a multitude of different fields
                        container_element.clientWidth : container_element.clientHeight
                );
                const _target_px = (
                    key.toLocaleLowerCase() == 'x' ?  // TODO: check for a multitude of different fields
                        target_element.clientWidth : target_element.clientHeight
                );
                let _value = _normalizeUnit(value, _container_px);
                if (typeof(value) == 'string' && value.indexOf(ELEMENT_IDENTIFIER) >= 0) {
                    _value += -_target_px;
                }
                animationObject[key] = _value;
            }
        }
        return [gsapMethod, duration, animationObject];
    });
}
