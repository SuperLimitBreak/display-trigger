import { TimelineMax } from 'gsap';

export class image {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('img'),
            console: console,
        }, kwargs);
        this._image_element = undefined;
        this._timeline = undefined;
    }
    
    get image() {
        if (!this._image_element) {
            this._image_element = this.documentCreateElement();
            this.element.appendChild(this._image_element);
        }
        return this._image_element;
    }
    
    
    start(msg) {return this.show(msg);}  // TODO: remove alias?
    show(msg) {
        this.empty();
        
        this.image.src = msg.src;
        if (msg.from && msg.to && msg.duration) {
            this._timeline = new TimelineMax({onComplete:()=>this.empty()});
            this._timeline.fromTo(this.image, msg.duration, msg.from, msg.to);
        }
    }
    
    clear() {return this.empty();}  // TODO: remove alias?
    empty() {
        if (this._timeline) {
            this._timeline.stop();
        }
        if (this._image_element) {
            this._image_element.remove();
            this._image_element = undefined;
        }
    }

}
image.className = 'image';
