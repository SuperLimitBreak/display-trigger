import { TimelineMax } from 'gsap';

export class text {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
        }, kwargs);

        this.console.log('Greensock is ', TimelineMax, kwargs, element);
    }
    
    text() {
    }
}
text.className = 'text';