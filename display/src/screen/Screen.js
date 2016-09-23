import {layerClasss} from './layers/__init__';
require('../styles/screen.scss');

export class Screen {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('div'),
            console: console,
            layerClasss: layerClasss,
            screenClassName: 'screen',
        }, kwargs);
        this.layers = new Map();
        
        this.element.classList.add(this.screenClassName);
        
        for (let layerClass of this.layerClasss) {
            const div = this.documentCreateElement();
            this.element.appendChild(div);
            this.layers.set(layerClass.constructor.name, new layerClass(div));
        }
    }
    
    onMessage(msg) {
        if (!msg.func) {return;}
        const [layerName, funcName] = msg.func.split('.');
        if (!this.layers.has(layerName)) {return;}
        this.layers.get(layerName)[funcName](msg);
    }
}
