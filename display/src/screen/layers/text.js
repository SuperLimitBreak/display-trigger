import { TimelineMax } from 'gsap';

require('../../styles/layers/text.scss');

export class text {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('div'),
            console: console,
        }, kwargs);
        this._text_element = undefined;
    }
    
    get text() {
        if (!this._text_element) {
            this._text_element = this.documentCreateElement();
            this.element.appendChild(this._text_element);
        }
        return this._text_element;
    }
    
    html_bubble(msg) {
        const text = this.text;
        text.innerHTML = msg.html;
        text.classList.add('html_bubble');
        text.style = `font-size: ${this.element.clientWidth * 0.04}px;`;  // Scale the font size based on width of container
        const tl = new TimelineMax({onComplete:this.empty});
        
        tl
            .from(this.element, 1.5, {opacity: 0, left:  '0%', filter: 'blur(1em)'})
            .to  (this.element, 5.0, {opacity: 1, left:  '5%', filter: 'blur(0em)'})
            .to  (this.element, 3.0, {opacity: 0, left: '30%', filter: 'blur(1em)'})
        ;
    }
    
    empty() {
        if (this._text_element) {
            this._text_element.remove();
            this._text_element = undefined;
        }
    }
}
text.className = 'text';