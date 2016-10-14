import { TimelineMax } from 'gsap';
import {static_url} from '../../utils/utils';

require('../../styles/layers/image.scss');

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

    load(msg) {return this.cache(msg);}  // TODO: remove alias?
    precache(msg) {return this.cache(msg);}  // TODO: remove alias?
    cache(msg) {
        if (typeof(msg.src) == 'string') {msg.src = [msg.src];}
        if (Array.isArray(msg.src)) {
            for (let src of msg.src) {
                const i = new Image();
                i.src = src;
            }
        }
    }
    
    start(msg) {return this.show(msg);}  // TODO: remove alias?
    show(msg) {
        this.empty();
        
        // Calcualte scale factor for simulated screen height
        if (msg.source_screen_height) {
            msg.scale = this.element.clientHeight / msg.source_screen_height;
        }
        // Update x,y,width,height values with scale factor
        if (msg.scale) {
            msg.width *= msg.scale;
            msg.height *= msg.scale;
            for (let animation_object of msg.gasp_animation.map((item)=>item[2])) {
                for (let prop of ['x', 'y', 'width', 'height']) {
                    if (animation_object.hasOwnProperty(prop)) {
                        animation_object[prop] *= msg.scale;
                    }
                }
            }
        }
        
        this.image.src = static_url(msg.src);
        this.image.className += msg.className;
        const px = (value)=> value ? `${value}px` : '100%';
        this.image.style = `
            width: ${px(msg.width)};
            height: ${px(msg.height)};
        `;
        
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
