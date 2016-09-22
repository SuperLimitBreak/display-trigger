import {layerClasss} from './layers/__init__';

export class Screen {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            document: document,
            console: console,
            layerClasss: layerClasss,
            className: 'screen',
        }, kwargs);
        this.layers = new Map();
        
        element.classList.add(this.className);
        
        for (let layerClass of this.layerClasss) {
            const div = this.document.createElement('div');
            this.element.appendChild(div);
            this.layers.set(layerClass.name, new layerClass(div));
        }
    }
    
    onMessage(msg) {
        console.log('screen', msg);
    }
}
