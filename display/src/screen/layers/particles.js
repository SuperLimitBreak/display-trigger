// https://greensock.com/forums/topic/15987-can-you-get-time-since-last-update-from-the-timeline/
// https://github.com/pixijs/pixi-particles
// https://www.npmjs.com/package/pixi-particles
// view-source:https://pixijs.io/pixi-particles/examples/flame.html
// view-source:https://pixijs.io/pixi-particles/examples/js/ParticleExample.js
// https://jameskiefer.com/posts/getting-started-with-pixi.js-and-webpack/


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

        this._timestamp = undefined;
        this._updateAnimationFrameId = undefined;

        this._canvas = document.createElement('canvas');
        this.element.appendChild(this._canvas);
        this._pixi_renderer = PIXI.autoDetectRenderer(
            this._canvas.width,
            this._canvas.height,
            {
                view: this._canvas,
            },
        )
        this._pixi_container_root = new PIXI.Container();

        this._pixi_container_emitter = new PIXI.Container();
        this._pixi_container_root.addChild(this._pixi_container_emitter);
        emitter = new PIXI.particles.Emitter(
            emitterContainer,
            art,
            config
        );
    }


    pause(msg) {return this.stop(msg);}  // TODO: remove alias?
    stop(msg) {
        cancelAnimationFrame(this._updateAnimationFrameId);
    }

    start(msg) {
        this.stop();
        this._timestamp = Date.now();
        const update = function() {
            this._updateAnimationFrameId = requestAnimationFrame(update);
            const now = Date.now();
            if (emitter) {
                emitter.update((now - this._timestamp) * 0.001);
            }
            this._timestamp = now;
            this._pixi_renderer.render(this._pixi_container_root);
        };
        update();
    }

    empty() {
    }

}
particles.className = 'particles';
