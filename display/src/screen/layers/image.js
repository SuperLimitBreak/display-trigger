import {timelineFromJson} from '../../utils/gsap';

require('../../styles/layers/image.scss');

const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location


export class image {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('img'),
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
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
        const image_src = this.mediaUrl + msg.src;
        if (this.image.src.indexOf(image_src)>=0 && !msg.gsap_animation) {return;}
        //console.debug('Image invalidated', this.image.src, image_src, msg.gsap_animation);
        this.empty();

        // Calculate scale factor for simulated screen height
        if (msg.source_screen_height) {
            msg.scale = this.element.clientHeight / msg.source_screen_height;
        }
        // Update x,y,width,height values with scale factor
        if (msg.scale) {
            msg.width *= msg.scale;
            msg.height *= msg.scale;
            for (let animation_object of msg.gsap_animation.map((item)=>item[2])) {
                for (let prop of ['x', 'y', 'width', 'height']) {
                    if (animation_object.hasOwnProperty(prop) && typeof(animation_object[prop])=='number') {
                        animation_object[prop] *= msg.scale;
                    }
                }
            }
        }

        this.image.src = image_src;
        this.image.className += msg.className;
        const px = (value)=> value ? `${value}px` : '100%';
        this.image.style = `
            width: ${px(msg.width)};
            height: ${px(msg.height)};
        `;

        if (msg.gsap_animation) {
            this._timeline = timelineFromJson(this.element, this.image, msg.gsap_animation);
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
