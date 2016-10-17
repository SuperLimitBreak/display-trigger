import * as PubSub from 'pubsub-js';
import { TimelineMax } from 'gsap';

export class fade {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
            parentSubscriptionName: 'UNDEFINED_FADE',
        }, kwargs);
        this.timeline = undefined;
    }
    
    fade() {
        this.timeline = new TimelineMax({onComplete:()=>this.onComplete()});
        this.timeline.fromTo(this.element, 1,
            {opacity:0, backgroundColor: 'black'},
            {opacity:1, backgroundColor: 'black'},
        );
    }
    
    onComplete() {
        PubSub.publish(this.parentSubscriptionName, {
            func: 'all.empty',
        })
    }
    
    empty() {
        if (this.timeline) {
            this.timeline.stop();
            this.timeline = undefined;
        }
        this.element.style = '';
    }
}
fade.className = 'fade';
