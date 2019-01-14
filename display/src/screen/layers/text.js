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
        this._timeline = undefined;
    }
    
    get text() {
        if (!this._text_element) {
            this._text_element = this.documentCreateElement();
            this.element.appendChild(this._text_element);
        }
        return this._text_element;
    }
    
    html_bubble(msg) {
        this.empty();
        const text = this.text;
        text.innerHTML = msg.html;
        text.classList.add('html_bubble');
        // Scale the font size based on width of container
        const font_size = this.element.clientWidth * 0.02;
        text.style = `
            font-size: ${font_size}px;
            position: absolute;
            top: 5%;
            max-width: 90%;
            opacity: 1;
            color: white;
            background-color: rgba(0,0,0,.50);
            box-shadow:0 0 ${2*font_size}px ${2*font_size}px rgba(0,0,0,.50);
            border-radius: ${2*font_size}px;
        `;

        this._timeline = new TimelineMax({onComplete:()=>this.empty()});
        this._timeline
            .fromTo(text, 1.5, {opacity: 0, left:  '0%', filter: 'blur(1em)'},
                               {opacity: 1, left:  '5%', filter: 'blur(0em)'})
            .to    (text, 5.0, {})
            .to    (text, 3.0, {opacity: 0, left: '30%', filter: 'blur(1em)'})
        ;
    }
    
    empty() {
        if (this._timeline) {
            this._timeline.stop();
        }
        if (this._text_element) {
            this._text_element.remove();
            this._text_element = undefined;
        }
    }
}
text.className = 'text';