// https://greensock.com/forums/topic/15987-can-you-get-time-since-last-update-from-the-timeline/
// https://github.com/pixijs/pixi-particles
// https://www.npmjs.com/package/pixi-particles
// view-source:https://pixijs.io/pixi-particles/examples/flame.html
// view-source:https://pixijs.io/pixi-particles/examples/js/ParticleExample.js
// https://jameskiefer.com/posts/getting-started-with-pixi.js-and-webpack/
// https://pixijs.io/pixi-particles/docs/classes/emitter.html#particleconstructor
// https://github.com/pixijs/pixi-particles/issues/57

import * as PIXI from 'pixi.js'
import * as PIXI_particles from 'pixi-particles';

import { bindRecursivelyReplaceStringsWithObjectReferences } from '../../utils/StringTools';

require('../../styles/layers/particles.scss');


const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location
const DEFAULT_PARTICLE_IMAGES = ['/assets/particle.png', ];
const DEFAULT_TIME_FACTOR = 0.001;


export class particles {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
        }, kwargs);

        this._update = this._update.bind(this);

        this._requestAnimationFrameTimestamp = undefined;
        this._updateAnimationFrameId = undefined;

        this._canvas = document.createElement('canvas');
        this._canvas.height = 480;
        this._canvas.width = (this.element.clientWidth / this.element.clientHeight) * this._canvas.height;
        this.element.appendChild(this._canvas);
        this._pixi_renderer = PIXI.autoDetectRenderer(
            this._canvas.width,
            this._canvas.height,
            {
                view: this._canvas,
                antialiasing: false,
                transparent: true,
                resolution: 1,
            },
        )
        this._pixi_container_root = new PIXI.Container();
        this._pixi_container_emitter = new PIXI.Container();
        this._pixi_container_root.addChild(this._pixi_container_emitter);

        this.funcReplaceStringReferences = bindRecursivelyReplaceStringsWithObjectReferences(
            new Map(),
            this._canvas,
        );

        this._emitter = undefined;
    }


    pause(msg) {return this.stop(msg);}  // TODO: remove alias?
    stop(msg) {
        cancelAnimationFrame(this._updateAnimationFrameId);
        this._updateAnimationFrameId = undefined;
    }

    start(msg) {
        this.stop();

        if (!msg.emitterConfig) {
            console.warn('No emitterConfig provided');
            return;
        }

        if (!this._emitter) {
            const images = Array.isArray(msg.particleImages) ? msg.particleImages : DEFAULT_PARTICLE_IMAGES;
            this._emitter = new PIXI_particles.Emitter(
                this._pixi_container_emitter,
                images.map(PIXI.Texture.fromImage),
                this.funcReplaceStringReferences(msg.emitterConfig),
            );
        } else {
            
        }

        this._requestAnimationFrameTimestamp = Date.now();
        this._update();
    }

    _update() {
        const now = Date.now();
        if (this._emitter) {
            this._emitter.update((now - this._requestAnimationFrameTimestamp) * DEFAULT_TIME_FACTOR);
        }
        this._requestAnimationFrameTimestamp = now;
        this._pixi_renderer.render(this._pixi_container_root);
        this._updateAnimationFrameId = requestAnimationFrame(this._update);
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
