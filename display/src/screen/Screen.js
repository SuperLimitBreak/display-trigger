import * as layers from './layers/__init__';
const layerClasss = layers['default']['layerClasss'];

require('../styles/screen.scss');

export class Screen {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('div'),
            console: console,
            layerClasss: layerClasss,
            screenClassName: 'screen',
            allLayersAlias: new Set(['all', 'trigger']),
        }, kwargs);
        this.layers = new Map();
        
        this.element.classList.add(this.screenClassName);
        
        for (let layerClass of this.layerClasss) {
            const div = this.documentCreateElement();
            this.element.appendChild(div);
            this.layers.set(layerClass.className, new layerClass(div));
        }
    }
    
    onMessage(msg) {
        if (!msg.func) {return;}
        let [layerName, funcName] = msg.func.split('.');
        if (this.allLayersAlias.has(layerName)) {
            for (layerName of this.layers.keys()) {
                this._callLayerFunc(layerName, funcName, msg);
            }
        }
        else {
            this._callLayerFunc(layerName, funcName, msg);
        }
    }
    
    _callLayerFunc(layerName, funcName, msg) {
        if (!this.layers.has(layerName)) {return;}
        const func = this.layers.get(layerName)[funcName];
        if (!func) {return;}
        func(msg);
    }
}
