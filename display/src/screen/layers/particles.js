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
const DEFAULT_PARTICLE_IMAGES = ['/assets/particle.png', '/assets/fire.png'];
const DEFAULT_TIME_FACTOR = 0.001;


export class particles {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
        }, kwargs);

        this._requestAnimationFrameTimestamp = undefined;
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

        this._emitter = undefined;

        this.start({
            emmitterConfig: {
                "alpha": {"start": 0.62, "end": 0},
                "scale": {"start": 0.25, "end": 0.75},
                "color": {"start": "fff191", "end": "ff622c"},
                "speed": {"start": 500, "end": 500},
                "startRotation": {"min": 265, "max": 275},
                "rotationSpeed": {"min": 50, "max": 50},
                "lifetime": {"min": 0.1, "max": 0.75},
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": 0,
                "maxParticles": 1000,
                "pos": {"x": 0, "y": 0},
                "addAtBack": false,
                "spawnType": "circle",
                "spawnCircle": {"x": 0, "y": 0, "r": 10},
            },
        });
    }


    pause(msg) {return this.stop(msg);}  // TODO: remove alias?
    stop(msg) {
        cancelAnimationFrame(this._updateAnimationFrameId);
        this._updateAnimationFrameId = undefined;
    }

    start(msg) {
        this.stop();

        const images = Array.isArray(msg.particleImages) ? msg.particleImages : DEFAULT_PARTICLE_IMAGES;
        this._emitter = new PIXI_particles.Emitter(
            this._pixi_container_emitter,
            images.map(PIXI.Texture.from),
            msg.emitterConfig,
        );

        const timeFactor = msg.timeFactor ? msg.timeFactor : DEFAULT_TIME_FACTOR;
        this._requestAnimationFrameTimestamp = Date.now();
        const update = function() {
            this._updateAnimationFrameId = requestAnimationFrame(update);
            const now = Date.now();
            if (this._emitter) {
                this._emitter.update((now - this._requestAnimationFrameTimestamp) * timeFactor);
            }
            this._requestAnimationFrameTimestamp = now;
            this._pixi_renderer.render(this._pixi_container_root);
        };
        update();
    }

    empty() {
        this.stop();
        this._emitter.destroy();
        this._emitter = undefined;
        //reset SpriteRenderer's batching to fully release particles for GC
        const r = this._pixi_renderer;
        if (r.plugins && r.plugins.sprite && r.plugins.sprite.sprites) {
            r.plugins.sprite.sprites.length = 0;
        }
        this._pixi_renderer.render(this._pixi_container_root);
    }

}
particles.className = 'particles';
