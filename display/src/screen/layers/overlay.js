import { TimelineMax } from 'gsap';

export class overlay {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
        }, kwargs);
        this.timeline = undefined;
    }
    
    fade() {
        this.timeline = new TimelineMax({onComplete:()=>this.empty()});
        this.timeline.fromTo(this.element, 1,
            {opacity:0, backgroundColor: 'black'},
            {opacity:1, backgroundColor: 'black'},
        );
    }
    
    empty() {
        if (this.timeline) {
            this.timeline.stop();
            this.timeline = undefined;
        }
        this.element.style = '';
    }
}
overlay.className = 'overlay';
