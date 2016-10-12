import { TimelineMax } from 'gsap';
import {static_url} from '../../utils/utils';

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
        
        this.image.src = static_url(msg.src);
        const px = (value)=> value ? `${value}px` : '100%';
        this.image.style = `width: ${px(msg.width)}; height: ${px(msg.height)}`;
        
        if (msg.gasp_animation) {
            this._timeline = new TimelineMax();
            let animation_state = this._timeline;
            for (let [gasp_method, duration, animation_object] of msg.gasp_animation) {
                animation_state = animation_state[gasp_method](this.image, duration, animation_object);
            }
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
