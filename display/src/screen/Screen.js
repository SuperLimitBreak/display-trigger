import * as PubSub from 'pubsub-js';

import {SCREEN_SUBSCRIPTION} from './constants.js'
import * as layers from './layers/__init__';
const layerClasss = layers['default']['layerClasss'];

require('../styles/screen.scss');

export class Screen {
    constructor(id, element, kwargs) {
        this.id = id;
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('div'),
            console: console,
            layerClasss: layerClasss,
            screenClassName: 'screen',
            allLayersAlias: new Set(['all', 'trigger']),
        }, kwargs);

        this.element.classList.add(this.screenClassName);
        const subscriptionName = [SCREEN_SUBSCRIPTION, this.id].join('.');

        // Create Layers
        this.layers = new Map();
        for (let layerClass of this.layerClasss) {
            const div = this.documentCreateElement();
            div.classList.add(layerClass.className);
            this.element.appendChild(div);
            this.layers.set(layerClass.className, new layerClass(div, {parentSubscriptionName: subscriptionName}));
        }

        // Listen to PubSub for this screen
        PubSub.subscribe(subscriptionName, (msg, data)=>{
            this.onMessage(data);
        });
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
        const layer = this.layers.get(layerName)
        if (!layer) {return;}
        const func = layer[funcName];
        if (!func) {return;}
        func.bind(layer)(msg);
    }
}
