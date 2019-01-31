const DEFAULT_PATH_MEDIA = '/';  // TODO: Import this from a central location

export class audio {
    constructor(element, kwargs) {
        this.element = element;
        Object.assign(this, {
            documentCreateElement: ()=>document.createElement('audio'),
            console: console,
            mediaUrl: (new URLSearchParams(window.location.search)).get('path_media') || DEFAULT_PATH_MEDIA,
            //currentTimeSyncThreshold: 0.2,
            //currentTimeOffset: 0,
        }, kwargs);
        this._audioElement = undefined;
    }

    get audio() {
        if (!this._audioElement) {
            this._audioElement = this.documentCreateElement();
            this.element.appendChild(this._audioElement);
        }
        return this._audioElement;
    }

    empty() {
        if (this._audioElement) {
            this._audioElement.remove();
            this._audioElement = undefined;
        }
    }

    load(msg) {
        this._audio(
            msg.src,
            Object.assign(msg, {play: false})
        );
    }

    start(msg) {
        this._audio(
            this.mediaUrl + msg.src,
            Object.assign(msg, {play: true})
        );
    }


    _audio(src, options) {
        if (!src) {this.empty(); return;}
        const audio = this.audio;
        options = Object.assign({
            'play': true,
            'volume': 1.0,
            'loop': false,
            'currentTime': 0,
        }, options);
        //options.currentTime = options.position || options.currentTime;  // normalize input from multiple fieldnames

        audio.loop = options.loop;
        audio.volume = options.volume;
        audio.controls = false;
        audio.preload = 'auto';
        audio.autoplay = options.play;

        // src
        if (audio.currentSrc.indexOf(src) > -1) {
            if (!options.play) {audio.pause();}
        }
        else {
            this.console.log('audio loading', src);
            audio.src = src;
            audio.load();
        }

        if (options.play) {
            audio.play();
        }
    }

}
audio.className = 'audio';