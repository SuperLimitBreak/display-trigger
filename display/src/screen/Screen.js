import {layerClasss} from './layers/__init__';

export class Screen {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('div'),
            elementAppendChild: (child)=>this.element.appendChild(child),
            console: console,
            layerClasss: layerClasss,
            screenClassName: 'screen',
        }, kwargs);
        this.layers = new Map();
        
        element.classList.add(this.screenClassName);
        
        for (let layerClass of this.layerClasss) {
            const div = this.documentCreateElement();
            this.elementAppendChild(div);
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
