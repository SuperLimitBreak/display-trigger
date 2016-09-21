import {layers} from './layers/__init__';

export class Screen {
    constructor(element) {
        this.element = element;
    }
    
    onMessage(msg) {
        console.log('screen', msg);
    }
}
