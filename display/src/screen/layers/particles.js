// https://greensock.com/forums/topic/15987-can-you-get-time-since-last-update-from-the-timeline/
// https://github.com/pixijs/pixi-particles

import * as PIXI from 'pixi.js'
import * as PIXI_particles from 'pixi-particles';


require('../../styles/layers/particles.scss');


const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location


export class particles {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
        }, kwargs);

        this._canvas = document.createElement('canvas');
        this.element.appendChild(this._canvas);
        this._renderer = PIXI.autoDetectRenderer(
            this._canvas.width,
            this._canvas.height,
            {
                view: this._canvas
            },
        )
        //this._pixi = new PIXI.Container();
    }


    pause(msg) {return this.stop(msg);}  // TODO: remove alias?
    stop(msg) {

    }

    start(msg) {
    }

    empty() {
    }

}
particles.className = 'particles';
